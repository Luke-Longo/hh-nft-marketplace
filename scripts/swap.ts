import { ethers, network } from "hardhat"
import { ISwapRouter } from "../typechain"
import { swapRouterABI } from "../helper-hardhat-config"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

export const swap = async (
    amountIn: string,
    amountOut: string,
    path: string[],
    to: string,
    account: SignerWithAddress
) => {
    const provider = ethers.provider
    const router = (await new ethers.Contract(
        "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        swapRouterABI,
        provider
    )) as ISwapRouter
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20
    const tx = await router.exactInputSingle({
        tokenIn: path[0],
        tokenOut: path[1],
        fee: 3000,
        recipient: to,
        deadline,
        amountIn,
        amountOutMinimum: amountOut,
        sqrtPriceLimitX96: 0,
    })
    await tx.wait(1)
}
