import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const basicNft1 = await deploy("BasicNft", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: 1,
    })

    const basicNft2 = await deploy("BasicNftTwo", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: 1,
    })

    log(`Deployed BasicNft at ${basicNft1.address}`)
    log(`Deployed BasicNftTwo at ${basicNft2.address}`)
}

export default func

func.tags = ["all", "basicnfts", "test"]
