import { ISwapRouter } from "../typechain"
import { ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"

const func: DeployFunction = async function (hre) {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments

    const { deployer } = await getNamedAccounts()

    let tx = await deploy("ISwapRouter", {
        from: deployer,
        args: [],
        log: true,
    })
    if (tx.newlyDeployed) {
        console.log("Deployed ISwapRouter at", tx.address)
    }
    // const swapRouter = (await ethers.getContract("ISwapRouter")) as ISwapRouter
    // console.log("swapRouter.address", swapRouter.address)
}
