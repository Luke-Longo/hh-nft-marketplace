import { ethers } from "hardhat"
import { ISwapRouter } from "../typechain"
import { swapRouterABI } from "../helper-hardhat-config"

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
    const provider = ethers.provider
    const router = (await new ethers.Contract(
        "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        swapRouterABI,
        provider
    )) as ISwapRouter
    const tx = await router.exactInputSingle({
        ...exactInputSingleParams,
    })
    await tx.wait(1)
}
