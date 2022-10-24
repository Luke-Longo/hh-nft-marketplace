import { assert, expect } from "chai"
import { ethers, network } from "hardhat"
import { NftMarketplaceChallenge, IERC20 } from "../../typechain"
import { developmentChains } from "../../helper-hardhat-config"
import { Signer } from "ethers"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftMarketplaceChallenge", function () {
          let nftMarketplace: NftMarketplaceChallenge,
              deployer: Signer,
              user: Signer,
              nftMarketplaceContract: NftMarketplaceChallenge
          beforeEach(async function () {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              nftMarketplaceContract = (await ethers.getContract(
                  "NftMarketplaceChallenge"
              )) as NftMarketplaceChallenge
              nftMarketplace = await nftMarketplaceContract.connect(deployer)
          })
      })
