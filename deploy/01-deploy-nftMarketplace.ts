import { DeployFunction } from "hardhat-deploy/dist/types"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployNftMarketplace: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network, ethers } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await network.config.chainId

    let NftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        args: [],
        log: true,
    })
}

export default deployNftMarketplace

deployNftMarketplace.tags = ["all", "marketplace"]
