import { assert, expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { NftMarketplaceChallenge, BasicNft, IERC20, WETH9 } from "../../typechain"
import { developmentChains, networkConfig, ERC20ABI, WETHABI } from "../../helper-hardhat-config"
import { swap } from "../../scripts/swap"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { getGasPrice } from "../../scripts/getCurrentGas"
const TOKEN_ID = 0
const PRICE = ethers.utils.parseEther(".1")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftMarketplaceChallenge", function () {
          let nftMarketplace: NftMarketplaceChallenge,
              deployer: SignerWithAddress,
              user: SignerWithAddress,
              nftMarketplaceContract: NftMarketplaceChallenge,
              nftContract: BasicNft,
              daiContract: IERC20,
              usdcContract: IERC20
          let chainId = network.config.chainId!
          let listingParams = {
              tokenId: TOKEN_ID,
              token: 0,
              amount: PRICE,
              nftAddress: "",
          }
          const provider = ethers.provider
          beforeEach(async function () {
              await deployments.fixture(["basicnfts", "challenge"])
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              nftMarketplaceContract = await ethers.getContract("NftMarketplaceChallenge")
              nftMarketplace = await nftMarketplaceContract.connect(deployer)
              nftContract = await ethers.getContract("BasicNft")
              listingParams.nftAddress = nftContract.address
              daiContract = (await new ethers.Contract(
                  networkConfig[chainId].daiAddress!,
                  ERC20ABI,
                  provider
              )) as IERC20
              usdcContract = (await new ethers.Contract(
                  networkConfig[chainId].usdcAddress!,
                  ERC20ABI,
                  provider
              )) as IERC20
              const runMint = async () => {
                  let tx = await nftContract.connect(deployer).mintNft()
                  await tx.wait(1)
                  tx = await nftContract.connect(deployer).mintNft()
                  await tx.wait(1)
                  tx = await nftContract.connect(deployer).approve(nftMarketplace.address, 0)
                  await tx.wait(1)
                  tx = await nftContract.connect(deployer).approve(nftMarketplace.address, 1)
                  await tx.wait(1)
                  let tx3 = await nftMarketplace.listItem(listingParams)
                  await tx3.wait(1)
              }
              await runMint()
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
          describe("listItem", async function () {
              it("emits an event after listing an item", async function () {
                  let newListingParams = {
                      tokenId: 1,
                      token: 0,
                      amount: PRICE,
                      nftAddress: nftContract.address,
                  }

                  await expect(nftMarketplace.listItem(newListingParams)).to.emit(
                      nftMarketplace,
                      "ItemListed"
                  )
              })
              it("can create a listing", async function () {
                  let newListingParams = {
                      nftAddress: nftContract.address,
                      tokenId: 1,
                      token: 0,
                      amount: ethers.utils.parseEther("1"),
                  }
                  let tx = await nftMarketplace.listItem(newListingParams)
                  await tx.wait(1)
                  let listing = await nftMarketplace.getListing(
                      newListingParams.nftAddress,
                      newListingParams.tokenId
                  )
                  assert.equal(listing.amount.toString(), newListingParams.amount.toString())
                  assert.equal(listing.token, newListingParams.token)
                  assert.equal(listing.seller, deployer.address)
              })
              it("it can create a listing with token 1 mapping", async function () {
                  let newListingParams = {
                      nftAddress: nftContract.address,
                      tokenId: 1,
                      token: 1,
                      amount: ethers.utils.parseEther("100"),
                  }
                  let tx = await nftMarketplace.listItem(newListingParams)
                  await tx.wait(1)
                  let listing = await nftMarketplace.getListing(
                      newListingParams.nftAddress,
                      newListingParams.tokenId
                  )
                  assert.equal(listing.amount.toString(), newListingParams.amount.toString())
              })
              it("it can create a listing with token 2 mapping", async function () {
                  let newListingParams = {
                      nftAddress: nftContract.address,
                      tokenId: 1,
                      token: 2,
                      amount: ethers.utils.parseEther("100"),
                  }
                  let tx = await nftMarketplace.listItem(newListingParams)
                  await tx.wait(1)
                  let listing = await nftMarketplace.getListing(
                      newListingParams.nftAddress,
                      newListingParams.tokenId
                  )

                  assert.equal(listing.amount.toString(), newListingParams.amount.toString())
              })
              it("throws an error if incorrect parameters are input", async function () {
                  let newListingParams = {
                      nftAddress: nftContract.address,
                      tokenId: 1,
                      token: 3,
                      amount: ethers.utils.parseEther("100"),
                  }
                  await expect(nftMarketplace.listItem(newListingParams)).to.be.reverted
              })
          })
          describe("updateListing", function () {
              it("should update listing and emit event", async function () {
                  let oldListing = await nftMarketplace.getListing(
                      listingParams.nftAddress,
                      listingParams.tokenId
                  )

                  let newListingParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 1,
                      amount: ethers.utils.parseEther("2"),
                  }
                  await expect(nftMarketplace.updateListing(newListingParams)).to.emit(
                      nftMarketplace,
                      "ItemListed"
                  )
                  let listing = await nftMarketplace.getListing(
                      newListingParams.nftAddress,
                      newListingParams.tokenId
                  )
                  assert.notEqual(oldListing.amount.toString(), listing.amount.toString())
                  assert.notEqual(oldListing.token.toString(), listing.token.toString())
                  assert.equal(listing.amount.toString(), newListingParams.amount.toString())
                  assert.equal(listing.token.toString(), newListingParams.token.toString())
              })
              it("should error when listing new nft", async function () {
                  let newListingParams = {
                      nftAddress: nftContract.address,
                      tokenId: 2,
                      token: 0,
                      amount: ethers.utils.parseEther("2"),
                  }
                  await expect(nftMarketplace.updateListing(newListingParams)).to.be.reverted
              })
          })
          describe("cancelListing", function () {
              it("reverts if there is no listing", async function () {
                  await expect(nftMarketplace.cancelListing(nftContract.address, 3)).to.be.reverted
              })
              it("reverts if anyone but the owner tries to call", async function () {
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await nftContract.approve(user.address, TOKEN_ID)
                  await expect(
                      nftMarketplace.connect(user).cancelListing(nftContract.address, TOKEN_ID)
                  ).to.be.reverted
              })
              it("emits event and removes listing", async function () {
                  expect(await nftMarketplace.cancelListing(nftContract.address, TOKEN_ID)).to.emit(
                      nftMarketplace,
                      "ItemCanceled"
                  )
                  const listing = await nftMarketplace.getListing(nftContract.address, TOKEN_ID)
                  assert(listing.amount.toString() == "0")
              })
          })
          describe("buyItem", function () {
              it("reverts if the item isnt listed", async function () {
                  let newParams = {
                      nftAddress: nftContract.address,
                      tokenId: 4,
                      token: 0,
                      amount: ethers.utils.parseEther("100"),
                  }
                  await expect(nftMarketplace.buyItem(newParams)).to.be.reverted
              })
              it("reverts if the price isnt met in ether", async function () {
                  await expect(
                      nftMarketplace.buyItem(listingParams, {
                          value: ethers.utils.parseEther(".001"),
                      })
                  ).to.be.reverted
              })
              it("transfers the nft to the buyer and updates internal proceeds record", async function () {
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  expect(
                      await nftMarketplace.buyItem(listingParams, {
                          value: PRICE,
                      })
                  ).to.emit(nftMarketplace, "ItemBought")
                  const newOwner = await nftContract.ownerOf(TOKEN_ID)
                  const deployerProceeds = await nftMarketplace.getProceeds(deployer.address, 0)
                  assert(newOwner.toString() == user.address)
                  assert(deployerProceeds.toString() == PRICE.toString())
              })
              it("reverts if the price is not met in usdc", async function () {
                  let newParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 2,
                      amount: ethers.utils.parseEther("100"),
                  }
                  await nftMarketplace.updateListing(newParams)
                  newParams.amount = ethers.utils.parseEther("10")
                  await expect(nftMarketplace.buyItem(newParams)).to.be.reverted
              })
              it("reverts if the price is not met in dai", async function () {
                  let newParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 1,
                      amount: ethers.utils.parseEther("100"),
                  }
                  await nftMarketplace.updateListing(newParams)
                  newParams.amount = ethers.utils.parseEther("10")
                  await expect(nftMarketplace.buyItem(newParams)).to.be.reverted
              })
              it("works with dai", async function () {
                  let newParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 1,
                      amount: ethers.utils.parseEther("100"),
                  }

                  await network.provider.request({
                      method: "hardhat_impersonateAccount",
                      params: ["0x16b34ce9a6a6f7fc2dd25ba59bf7308e7b38e186"],
                  })
                  const signer = await ethers.getSigner(
                      "0x16b34ce9a6a6f7fc2dd25ba59bf7308e7b38e186"
                  )

                  await nftMarketplace.updateListing(newParams)

                  await daiContract
                      .connect(signer)
                      .approve(nftMarketplace.address, newParams.amount)

                  expect(
                      await nftMarketplace.connect(signer).buyItem(newParams, {
                          gasPrice: await getGasPrice(),
                      })
                  ).to.emit(nftMarketplace, "ItemBought")
                  const newOwner = await nftContract.ownerOf(TOKEN_ID)
                  const deployerProceeds = await nftMarketplace.getProceeds(deployer.address, 1)
                  assert(newOwner.toString() == signer.address)
                  assert(deployerProceeds.toString() == newParams.amount.toString())
              })
              it("works with usdc", async function () {
                  let newParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 2,
                      amount: "1463594550",
                  }

                  const wethContract = (await new ethers.Contract(
                      networkConfig[chainId].wethAddress!,
                      WETHABI,
                      user
                  )) as WETH9

                  await wethContract
                      .connect(user)
                      .deposit({ value: ethers.utils.parseEther("100") })

                  const args = {
                      tokenIn: networkConfig[chainId].wethAddress!,
                      tokenOut: usdcContract.address,
                      fee: 500,
                      recipient: user.address,
                      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
                      amountIn: ethers.utils.parseEther("10").toString(),
                      amountOutMinimum: "0",
                      sqrtPriceLimitX96: "0",
                  }

                  await swap(args, wethContract, user)

                  const oldBalanceUsdc = await usdcContract.connect(user).balanceOf(user.address)

                  await usdcContract.connect(user).approve(nftMarketplace.address, newParams.amount)

                  expect(
                      await nftMarketplace.connect(user).buyItem(newParams, {
                          gasLimit: 1000000,
                          gasPrice: await getGasPrice(),
                      })
                  ).to.emit(nftMarketplace, "ItemBought")

                  const newOwner = await nftContract.ownerOf(TOKEN_ID)
                  const deployerProceeds = await nftMarketplace.getProceeds(deployer.address, 2)

                  assert(newOwner.toString() == user.address)
                  assert(deployerProceeds.toString() == newParams.amount.toString())
              })
          })
          describe("withdrawSingleProceeds", function () {
              it("should withdraw eth", async function () {
                  let newParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 0,
                      amount: ethers.utils.parseEther("1"),
                  }

                  await nftMarketplace.connect(deployer).updateListing(newParams)
                  //   need to send the ether as in the value field
                  await nftMarketplace.connect(user).buyItem(newParams, {
                      gasLimit: 1000000,
                      gasPrice: await getGasPrice(),
                      value: newParams.amount,
                  })

                  const proceedBalance = await nftMarketplace
                      .connect(deployer)
                      .getProceeds(deployer.address, 0)

                  const oldEthBalance = await deployer.getBalance()
                  await expect(nftMarketplace.connect(deployer).withdrawSingleProceeds(0)).to.emit(
                      nftMarketplace,
                      "Withdraw"
                  )
                  const newEthBalance = await deployer.getBalance()

                  assert.equal(proceedBalance.toString(), newParams.amount.toString())
                  assert.isAtLeast(Number(newEthBalance), Number(oldEthBalance))
              })
              it("should withdraw dai", async function () {
                  let newParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 1,
                      amount: "1463594550",
                  }

                  await nftMarketplace.connect(deployer).updateListing(newParams)

                  await network.provider.request({
                      method: "hardhat_impersonateAccount",
                      params: ["0x16b34ce9a6a6f7fc2dd25ba59bf7308e7b38e186"],
                  })
                  const signer = await ethers.getSigner(
                      "0x16b34ce9a6a6f7fc2dd25ba59bf7308e7b38e186"
                  )

                  await daiContract
                      .connect(signer)
                      .approve(nftMarketplace.address, newParams.amount)

                  await nftMarketplace.connect(signer).buyItem(newParams, {
                      gasLimit: 1000000,
                      gasPrice: await getGasPrice(),
                  })

                  const proceedBalance = await nftMarketplace
                      .connect(deployer)
                      .getProceeds(deployer.address, 1)

                  await expect(nftMarketplace.connect(deployer).withdrawSingleProceeds(1)).to.emit(
                      nftMarketplace,
                      "Withdraw"
                  )

                  const sellerBalance = await daiContract
                      .connect(deployer)
                      .balanceOf(deployer.address)

                  assert.equal(sellerBalance.toString(), newParams.amount.toString())
                  assert.equal(proceedBalance.toString(), sellerBalance.toString())
              })
              it("should withdraw usdc", async function () {
                  let newParams = {
                      nftAddress: nftContract.address,
                      tokenId: 0,
                      token: 2,
                      amount: "1463594550",
                  }

                  await nftMarketplace.connect(deployer).updateListing(newParams)

                  const wethContract = (await new ethers.Contract(
                      networkConfig[chainId].wethAddress!,
                      WETHABI,
                      user
                  )) as WETH9

                  await wethContract
                      .connect(user)
                      .deposit({ value: ethers.utils.parseEther("100") })

                  const args = {
                      tokenIn: networkConfig[chainId].wethAddress!,
                      tokenOut: usdcContract.address,
                      fee: 500,
                      recipient: user.address,
                      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
                      amountIn: ethers.utils.parseEther("10").toString(),
                      amountOutMinimum: "0",
                      sqrtPriceLimitX96: "0",
                  }

                  await swap(args, wethContract, user)

                  await usdcContract.connect(user).approve(nftMarketplace.address, newParams.amount)

                  await nftMarketplace.connect(user).buyItem(newParams, {
                      gasLimit: 1000000,
                      gasPrice: await getGasPrice(),
                  })

                  const proceedBalance = await nftMarketplace
                      .connect(deployer)
                      .getProceeds(deployer.address, 2)

                  await expect(nftMarketplace.connect(deployer).withdrawSingleProceeds(2)).to.emit(
                      nftMarketplace,
                      "Withdraw"
                  )

                  const sellerBalance = await usdcContract
                      .connect(deployer)
                      .balanceOf(deployer.address)

                  assert.equal(sellerBalance.toString(), newParams.amount.toString())
                  assert.equal(proceedBalance.toString(), sellerBalance.toString())
              })
          })
          describe("getPrice", async function () {
              it("returns the correct price in eth", async function () {
                  let price = await nftMarketplace.getListingPriceUsd(
                      listingParams.nftAddress,
                      TOKEN_ID
                  )
                  console.log(ethers.utils.formatEther(price))
              })
              it("returns the correct price in dai", async function () {
                  let newListing = {
                      nftAddress: nftContract.address,
                      tokenId: 1,
                      token: 1,
                      amount: ethers.utils.parseEther("100"),
                  }

                  let tx = await nftMarketplace.listItem(newListing)
                  await tx.wait(1)
                  let price = await nftMarketplace.getListingPriceUsd(
                      newListing.nftAddress,
                      newListing.tokenId
                  )
                  console.log(ethers.utils.formatEther(price))
              })
              it("returns the correct price in usdc", async function () {
                  let newListing = {
                      nftAddress: nftContract.address,
                      tokenId: 1,
                      token: 2,
                      amount: ethers.utils.parseEther("100"),
                  }

                  let tx = await nftMarketplace.listItem(newListing)
                  await tx.wait(1)
                  let price = await nftMarketplace.getListingPriceUsd(
                      newListing.nftAddress,
                      newListing.tokenId
                  )
                  console.log(ethers.utils.formatEther(price))
              })
          })
      })
