// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

error NftMarketplace__PriceMustBeGreaterThanZero();
error NftMarketplace__NotApproved();
error NftMarketplace__NftAlreadyListed(address nftAddress, uint256 tokenId, address owner);
error NftMarketplace__NotOwner();
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);

contract NftMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }
    // NFT contract address => NFT tokenId => Listing Struct
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    // will map the proceeds to the seller wallet address
    mapping(address => uint256) private s_proceeds;

    event NftListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price,
        address seller
    );

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        // if(listing.seller == owner){
        //     revert NftMarketplace__NftAlreadyListed(nftAddress, tokenId, owner);
        // }
        if (listing.price > 0) {
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
        if (listing.price <= 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
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
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external notListed(nftAddress, tokenId, msg.sender) isOwner(nftAddress, tokenId, msg.sender) {
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeGreaterThanZero();
        }

        IERC721 nft = IERC721(nftAddress);
        // owners should give approval to this contract to swap the NFT when a purcahse is complete

        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApproved();
        }
        // double mapping, one for the nftContract address and the second that maps the tokenId to the listing
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        // best practice to updated mappings is to emit an event once completed the mapping, this will be listened to by the frontend
        emit NftListed(nftAddress, msg.sender, price, tokenId);
    }

    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
        nonReentrant
    {
        Listing memory listing = s_listings[nftAddress][tokenId];

        if (msg.value < listing.price) {
            revert NftMarketplace__PriceNotMet(nftAddress, tokenId, listing.price);
        }
        // pull over push methods, pull is more secure as it prevents reentrancy attacks
        // https://fravoll.github.io/solidity-patterns/pull_over_push.html
        s_proceeds[listing.seller] += msg.value;
        // always want to change your state before you make any external calls
        delete s_listings[nftAddress][tokenId];

        IERC721 nft = IERC721(nftAddress);

        nft.safeTransferFrom(listing.seller, msg.sender, tokenId);

        emit ItemBought(nftAddress, tokenId, msg.sender, listing.price, listing.seller);
    }
}
