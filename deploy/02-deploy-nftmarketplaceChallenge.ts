import { DeployFunction } from "hardhat-deploy/dist/types"
import { networkConfig } from "../helper-hardhat-config"
import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployChallengeMarketplace: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await network.config.chainId!

    let daiAddress, usdcAddress, ethPriceFeed, daiPriceFeed, usdcPriceFeed

    daiAddress = networkConfig[chainId].daiAddress
    usdcAddress = networkConfig[chainId].usdcAddress
    ethPriceFeed = networkConfig[chainId].ethUsdPriceFeed
    daiPriceFeed = networkConfig[chainId].daiUsdPriceFeed
    usdcPriceFeed = networkConfig[chainId].usdcUsdPriceFeed

    let args = [daiAddress, usdcAddress, ethPriceFeed, daiPriceFeed, usdcPriceFeed]

    await deploy("NftMarketplaceChallenge", {
        from: deployer,
        args: args,
        log: true,
    })
}

export default deployChallengeMarketplace

deployChallengeMarketplace.tags = ["all", "challenge"]
