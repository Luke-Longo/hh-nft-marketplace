// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error NftMarketplace__PriceMustBeGreaterThanZero();
error NftMarketplace__NotApproved();
error NftMarketplace__NftAlreadyListed(address nftAddress, uint256 tokenId, address owner);
error NftMarketplace__NotOwner();
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__PriceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 price,
    uint256 token
);
error NftMarketplace__WithdrawFailed(address withdrawer, uint256 amount);
error NftMarketplace__NoProceeds(address withdrawer);
error NftMarketplace__NotApprovedToken();
error NftMarketplace__ERC20ApproveFailed();

contract NftMarketplaceChallenge is ReentrancyGuard {
    // only allowed to trade eth, dai, usdc

    enum Token {
        ETH,
        DAI,
        USDC
    }

    struct Pricing {
        uint256 amount;
        Token token;
    }

    struct Listing {
        Pricing pricing;
        address seller;
    }

    struct ListingParams {
        address nftAddress;
        uint256 tokenId;
        Pricing pricing;
    }

    AggregatorV3Interface internal immutable i_ethUsdPriceFeed;
    AggregatorV3Interface internal immutable i_daiUsdPriceFeed;
    AggregatorV3Interface internal immutable i_usdcUsdPriceFeed;

    // NFT contract address => NFT tokenId => Listing Struct
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    // will map the sellers wallet address to a erc20 contract address, using 0 for eth address, then the amount of proceeds the seller is owed
    mapping(address => mapping(address => uint256)) private s_proceeds;

    mapping(Token => address) public tokenAddresses;

    constructor(
        address _daiAddress,
        address _usdcAddress,
        address _ethPriceFeed,
        address _daiPricefeed,
        address _usdcPricefeed
    ) {
        tokenAddresses[Token.ETH] = address(0);
        tokenAddresses[Token.DAI] = _daiAddress;
        tokenAddresses[Token.USDC] = _usdcAddress;
        i_ethUsdPriceFeed = AggregatorV3Interface(_ethPriceFeed);
        i_daiUsdPriceFeed = AggregatorV3Interface(_daiPricefeed);
        i_usdcUsdPriceFeed = AggregatorV3Interface(_usdcPricefeed);
    }

    // using the aggreator interface inside the pricing functions, this will allow us to use any price feed. The pricefeed desired will be a parmater in the price and purchase functions

    event ItemListed(ListingParams listingParams, address seller);

    event ItemBought(ListingParams listingParams, address indexed buyer, address seller);

    event ListingCancelled(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed seller
    );

    event Withdraw(address indexed withdrawer, uint256 indexed amount, uint256 token);

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        // if(listing.seller == owner){
        //     revert NftMarketplace__NftAlreadyListed(nftAddress, tokenId, owner);
        // }
        if (listing.pricing.amount > 0) {
            revert NftMarketplace__NftAlreadyListed(nftAddress, tokenId, owner);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nftContract = IERC721(nftAddress);
        address owner = nftContract.ownerOf(tokenId);
        if (owner != spender) {
            revert NftMarketplace__NotOwner();
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.pricing.amount <= 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isTradable(Token token) {
        if (token != Token.ETH && token != Token.DAI && token != Token.USDC) {
            revert NftMarketplace__NotApprovedToken();
        }
        _;
    }

    modifier purchasePriceMet(ListingParams memory listingParams) {
        Listing memory listing = s_listings[listingParams.nftAddress][listingParams.tokenId];
        if (listingParams.pricing.token == Token.ETH) {
            if (msg.value < listing.pricing.amount) {
                revert NftMarketplace__PriceNotMet(
                    listingParams.nftAddress,
                    listingParams.tokenId,
                    listingParams.pricing.amount,
                    uint256(listingParams.pricing.token)
                );
            }
        } else {
            ERC20 tokenContract = ERC20(tokenAddresses[listingParams.pricing.token]);
            if (tokenContract.balanceOf(msg.sender) < listingParams.pricing.amount) {
                revert NftMarketplace__PriceNotMet(
                    listingParams.nftAddress,
                    listingParams.tokenId,
                    listingParams.pricing.amount,
                    uint256(listingParams.pricing.token)
                );
            }
        }
        _;
    }

    /*
      * @notice Method for listing an nft on the market place
      * @param nftAddress - address of the NFT contract
      * @param tokenId - ID of the NFT
      * @param price - price of the NFT
      * @dev - technically you could hve the contract custody the nfts but that would prevent the owner from using the nft and also add up in transaction costs
      
    */
    // challenge would be to accept payment of the nft in a different token other than eth, using an additional parameter of the token address they are trying to pay with, ie usdc or dai or weth
    // will need to integrate chainlink price feeds
    // using the Pricing struct that contains the token address and the amount
    function listItem(ListingParams memory listingParams)
        external
        // checks if the nft has been listed
        notListed(listingParams.nftAddress, listingParams.tokenId, msg.sender)
        // checks if they are the owner of the nft
        isOwner(listingParams.nftAddress, listingParams.tokenId, msg.sender)
        //checks if the token is valid token
        isTradable(listingParams.pricing.token)
    {
        if (listingParams.pricing.amount <= 0) {
            revert NftMarketplace__PriceMustBeGreaterThanZero();
        }

        IERC721 nft = IERC721(listingParams.nftAddress);

        // owners should give approval to this contract to swap the NFT when a purcahse is complete
        if (nft.getApproved(listingParams.tokenId) != address(this)) {
            revert NftMarketplace__NotApproved();
        }

        // double mapping, one for the nftContract address and the second that maps the ListingParams.tokenId to the listing
        s_listings[listingParams.nftAddress][listingParams.tokenId] = Listing(
            listingParams.pricing,
            msg.sender
        );
        // best practice to updated mappings is to emit an event once completed the mapping, this will be listened to by the frontend
        emit ItemListed(listingParams, msg.sender);
    }

    function buyItem(ListingParams memory listingParams)
        external
        payable
        isListed(listingParams.nftAddress, listingParams.tokenId)
        isTradable(listingParams.pricing.token)
        // checks if the price has been met
        purchasePriceMet(listingParams)
        nonReentrant
    {
        ERC20 tokenContract;
        Listing memory listing = s_listings[listingParams.nftAddress][listingParams.tokenId];
        IERC721 nft = IERC721(listingParams.nftAddress);

        if (listingParams.pricing.token != Token.ETH) {
            tokenContract = ERC20(tokenAddresses[listingParams.pricing.token]);
            bool success = tokenContract.approve(listing.seller, listingParams.pricing.amount);
            if (!success) {
                revert NftMarketplace__ERC20ApproveFailed();
            }

            // transfers the erc20 tokens to the marketplace contract
            tokenContract.transferFrom(msg.sender, address(this), listingParams.pricing.amount);

            // updated the sellers balance in the mapping
            s_proceeds[listing.seller][tokenAddresses[listingParams.pricing.token]] += listingParams
                .pricing
                .amount;
        }

        // update the sellers balance in the mapping for eth
        if (listingParams.pricing.token == Token.ETH) {
            s_proceeds[listing.seller][tokenAddresses[Token.ETH]] += msg.value;
        }

        // delete the listing
        delete s_listings[listingParams.nftAddress][listingParams.tokenId];

        // transfer the nft to the buyer
        nft.safeTransferFrom(listing.seller, msg.sender, listingParams.tokenId);

        // emit the event
        emit ItemBought(listingParams, msg.sender, listing.seller);
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ListingCancelled(nftAddress, tokenId, msg.sender);
    }

    function updateListing(ListingParams memory listingParams)
        external
        isOwner(listingParams.nftAddress, listingParams.tokenId, msg.sender)
        isListed(listingParams.nftAddress, listingParams.tokenId)
    {
        s_listings[listingParams.nftAddress][listingParams.tokenId].pricing = listingParams.pricing;

        emit ItemListed(listingParams, msg.sender);
    }

    function withdrawSingleProceeds(Token token) public nonReentrant {
        uint256 amount = s_proceeds[msg.sender][tokenAddresses[token]];
        if (amount <= 0) {
            revert NftMarketplace__NoProceeds(msg.sender);
        }

        s_proceeds[msg.sender][tokenAddresses[token]] = 0;

        if (token == Token.ETH) {
            (bool success, ) = msg.sender.call{value: amount}("");
            if (!success) {
                s_proceeds[msg.sender][tokenAddresses[token]] = amount;
                revert NftMarketplace__WithdrawFailed(msg.sender, amount);
            }
        } else {
            ERC20 tokenContract = ERC20(tokenAddresses[token]);
            bool success = tokenContract.transfer(payable(msg.sender), amount);

            if (!success) {
                s_proceeds[msg.sender][tokenAddresses[token]] = amount;
                revert NftMarketplace__WithdrawFailed(msg.sender, amount);
            }
        }

        emit Withdraw(msg.sender, amount, uint256(token));
    }

    function withdrawAllProceeds() external nonReentrant {
        for (uint256 i = 0; i < 3; i++) {
            withdrawSingleProceeds(Token(i));
        }
    }

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address user, Token token) external view returns (uint256) {
        return s_proceeds[user][tokenAddresses[token]];
    }
}
