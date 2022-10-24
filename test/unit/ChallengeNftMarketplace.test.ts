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
              user2 = accounts[2]
              user3 = accounts[3]
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
      })
