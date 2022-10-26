import { ethers } from "hardhat"
import { ISwapRouter } from "../typechain"
import { swapRouterABI } from "../helper-hardhat-config"
import { getGasPrice } from "./getCurrentGas"

export const swap = async (exactInputSingleParams: {
    tokenIn: string
    tokenOut: string
    fee: number
    recipient: string
    deadline: number
    amountIn: string
    amountOutMinimum: string
    sqrtPriceLimitX96: string
}) => {
    const accounts = await ethers.getSigners()
    console.log()
    const provider = ethers.provider
    const router = (await new ethers.Contract(
        "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        swapRouterABI,
        provider
    )) as ISwapRouter

    const tx = await router.connect(accounts[1]).exactInputSingle(
        {
            ...exactInputSingleParams,
        },
        {
            gasLimit: 1000000,
            gasPrice: await getGasPrice(),
        }
    )
    await tx.wait(1)
}
