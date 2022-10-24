import { assert, expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { NftMarketplaceChallenge, IERC20, BasicNft, BasicNftTwo } from "../../typechain"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Signer } from "ethers"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftMarketplaceChallenge", function () {
          let nftMarketplace: NftMarketplaceChallenge,
              deployer: Signer,
              user: Signer,
              nftMarketplaceContract: NftMarketplaceChallenge,
              nftContract: BasicNft,
              nftContractTwo: BasicNftTwo,
              user2: Signer,
              user3: Signer
          let chainId = network.config.chainId!
          beforeEach(async function () {
              await deployments.fixture(["basicnfts", "challenge"])
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              nftMarketplaceContract = (await ethers.getContract(
                  "NftMarketplaceChallenge"
              )) as NftMarketplaceChallenge
              nftMarketplace = await nftMarketplaceContract.connect(deployer)
              nftContract = (await ethers.getContract("BasicNft")) as BasicNft
              nftContractTwo = (await ethers.getContract("BasicNftTwo")) as BasicNftTwo
          })

          describe("constructor", function () {
              it("should set immutable variables", async function () {
                  let ethPriceFeed: string = await nftMarketplace.getEthPriceFeed()
                  let daiPriceFeed: string = await nftMarketplace.getDaiPriceFeed()
                  let usdcPriceFeed: string = await nftMarketplace.getUsdcPriceFeed()
                  let daiAddress: string = await nftMarketplace.getDaiToken()
                  let usdcAddress: string = await nftMarketplace.getUsdcToken()

                  assert.equal(ethPriceFeed, networkConfig[chainId].ethUsdPriceFeed)
                  assert.equal(daiPriceFeed, networkConfig[chainId].daiUsdPriceFeed)
                  assert.equal(usdcPriceFeed, networkConfig[chainId].usdcUsdPriceFeed)
                  assert.equal(daiAddress, networkConfig[chainId].daiAddress)
                  assert.equal(usdcAddress, networkConfig[chainId].usdcAddress)
              })
          })
          describe("nft listings", async function () {
              beforeEach(async function () {
                  // adds two nfts to both wallets, and approves the marketplace to transfer them
                  let tx = await nftContract.connect(deployer).mintNft()
                  await tx.wait(1)
                  tx = await nftContract.connect(deployer).approve(nftMarketplace.address, 0)
                  let tx2 = await nftContract.connect(user).mintNft()
                  await tx2.wait(1)
                  tx2 = await nftContract.connect(user).approve(nftMarketplace.address, 1)
                  let tx3 = await nftContractTwo.connect(deployer).mintNft()
                  await tx3.wait(1)
                  tx3 = await nftContractTwo.connect(deployer).approve(nftMarketplace.address, 0)
                  let tx4 = await nftContractTwo.connect(user).mintNft()
                  await tx4.wait(1)
                  tx4 = await nftContractTwo.connect(user).approve(nftMarketplace.address, 1)
              })
              it("should have minted two nfts for both wallets", async function () {
                  let deployerBalance1 = await nftContract.balanceOf(await deployer.getAddress())
                  let userBalance1 = await nftContract.balanceOf(await user.getAddress())
                  let deployerBalance2 = await nftContractTwo.balanceOf(await deployer.getAddress())
                  let userBalance2 = await nftContractTwo.balanceOf(await user.getAddress())
                  assert.equal(deployerBalance1.toString(), "1")
                  assert.equal(userBalance1.toString(), "1")
                  assert.equal(deployerBalance2.toString(), "1")
                  assert.equal(userBalance2.toString(), "1")
              })
              it("can create a listing", async function () {
                  let listingParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 0,
                      amount: ethers.utils.parseEther(".1"),
                  }
                  let tx = await nftMarketplace.listItem(listingParams)
                  await tx.wait(1)
                  let listing = await nftMarketplace.getListing(
                      listingParams.nftAddress,
                      listingParams.tokenId
                  )
                  assert.equal(listing.amount.toString(), listingParams.amount.toString())
              })
              it("it can create a listing with token 1 mapping", async function () {
                  let listingParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 1,
                      amount: ethers.utils.parseEther("100"),
                  }
                  let tx = await nftMarketplace.listItem(listingParams)
                  await tx.wait(1)
                  let listing = await nftMarketplace.getListing(
                      listingParams.nftAddress,
                      listingParams.tokenId
                  )
                  assert.equal(listing.amount.toString(), listingParams.amount.toString())
              })
              it("it can create a listing with token 2 mapping", async function () {
                  let listingParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 2,
                      amount: ethers.utils.parseEther("100"),
                  }
                  let tx = await nftMarketplace.listItem(listingParams)
                  await tx.wait(1)
                  let listing = await nftMarketplace.getListing(
                      listingParams.nftAddress,
                      listingParams.tokenId
                  )

                  assert.equal(listing.amount.toString(), listingParams.amount.toString())
              })
              it("throws an error if incorrect parameters are input", async function () {
                  let listingParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 3,
                      amount: ethers.utils.parseEther("100"),
                  }
                  await expect(nftMarketplace.listItem(listingParams)).to.be.reverted
              })
          })

          describe("nft updating", function () {
              beforeEach(async function () {
                  let tx = await nftContract.connect(deployer).mintNft()
                  await tx.wait(1)
                  tx = await nftContract.connect(deployer).approve(nftMarketplace.address, 0)
                  let tx2 = await nftContract.connect(user).mintNft()
                  await tx2.wait(1)
                  tx2 = await nftContract.connect(user).approve(nftMarketplace.address, 1)
              })
              it("should update listing", async function () {})
          })
      })
