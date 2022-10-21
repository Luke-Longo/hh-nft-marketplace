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

    event ItemListed(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 amount,
        uint256 token
    );

    event ItemBought(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 amount,
        uint256 token,
        address seller
    );

    event ListingCancelled(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed seller
    );

    event Withdraw(address indexed withdrawer, uint256 indexed amount);

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

    modifier purchasePriceMet(
        address nftAddress,
        uint256 tokenId,
        Pricing memory pricing
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (pricing.token == Token.ETH) {
            if (msg.value < listing.pricing.amount) {
                revert NftMarketplace__PriceNotMet(
                    nftAddress,
                    tokenId,
                    pricing.amount,
                    uint256(pricing.token)
                );
            }
        } else {
            ERC20 tokenContract = ERC20(tokenAddresses[pricing.token]);
            if (tokenContract.balanceOf(msg.sender) < pricing.amount) {
                revert NftMarketplace__PriceNotMet(
                    nftAddress,
                    tokenId,
                    pricing.amount,
                    uint256(pricing.token)
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
    function listItem(
        address nftAddress,
        uint256 tokenId,
        Pricing memory pricing
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
        isTradable(pricing.token)
    {
        if (pricing.amount <= 0) {
            revert NftMarketplace__PriceMustBeGreaterThanZero();
        }

        IERC721 nft = IERC721(nftAddress);

        // owners should give approval to this contract to swap the NFT when a purcahse is complete
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApproved();
        }

        // double mapping, one for the nftContract address and the second that maps the tokenId to the listing
        s_listings[nftAddress][tokenId] = Listing(pricing, msg.sender);
        // best practice to updated mappings is to emit an event once completed the mapping, this will be listened to by the frontend
        emit ItemListed(nftAddress, tokenId, msg.sender, pricing.amount, uint256(pricing.token));
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId,
        Pricing memory pricing
    )
        external
        payable
        isListed(nftAddress, tokenId)
        isTradable(pricing.token)
        purchasePriceMet(nftAddress, tokenId, pricing)
        nonReentrant
    {
        ERC20 tokenContract;
        Listing memory listing = s_listings[nftAddress][tokenId];
        IERC721 nft = IERC721(nftAddress);

        if (pricing.token != Token.ETH) {
            tokenContract = ERC20(tokenAddresses[pricing.token]);
            bool success = tokenContract.approve(address(this), pricing.amount);
            if (!success) {
                revert NftMarketplace__ERC20ApproveFailed();
            }
        }
        // getting complex, need to add a check to see if the currency is eth or not
        // if it is eth then we need to check the msg.value
        // if it is not eth then we need to check the token balance of the msg.sender
        // if the token balance is less than the price then we need to revert
        // if the token balance is greater than the price then we need to transfer the token to the seller
        // transfer the nft to the buyer
        nft.safeTransferFrom(listing.seller, msg.sender, tokenId);
        // transfer the funds to the seller
        // if the currency is eth then we need to transfer eth
        // if the currency is not eth then we need to transfer the token
        if (pricing.token == Token.ETH) {
            // transfer eth
            (bool success, ) = listing.seller.call{value: msg.value}("");
            if (!success) {
                revert NftMarketplace__WithdrawFailed(listing.seller, msg.value);
            }
        } else {
            // transfer token
            ERC20 token = ERC20(tokenAddresses[pricing.token]);
            if (!token.transfer(listing.seller, pricing.amount)) {
                revert NftMarketplace__WithdrawFailed(listing.seller, pricing.amount);
            }
        }
        // delete the listing
        delete s_listings[nftAddress][tokenId];
        // emit the event
        emit ItemBought(
            nftAddress,
            tokenId,
            msg.sender,
            pricing.amount,
            pricing.currency,
            listing.seller
        );
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ListingCancelled(nftAddress, tokenId, msg.sender);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        Pricing memory pricing
    ) external isOwner(nftAddress, tokenId, msg.sender) isListed(nftAddress, tokenId) {
        s_listings[nftAddress][tokenId].pricing = pricing;

        emit ItemListed(nftAddress, tokenId, msg.sender, pricing.amount, pricing.currency);
    }

    function withdrawProceeds() external nonReentrant {
        uint256 amount = s_proceeds[msg.sender];
        if (amount <= 0) {
            revert NftMarketplace__NoProceeds(msg.sender);
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) {
            s_proceeds[msg.sender] = amount;
            revert NftMarketplace__WithdrawFailed(msg.sender, amount);
        }

        emit Withdraw(msg.sender, amount);
    }

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address user) external view returns (uint256) {
        return s_proceeds[user];
    }
}
