import { ethers } from "hardhat"
import { IERC20, ISwapRouter } from "../typechain"
import { swapRouterABI } from "../helper-hardhat-config"
import { getGasPrice } from "./getCurrentGas"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

export const swap = async (
    exactInputSingleParams: {
        tokenIn: string
        tokenOut: string
        fee: number
        recipient: string
        deadline: number
        amountIn: string
        amountOutMinimum: string
        sqrtPriceLimitX96: string
    },
    tokenContract: IERC20,
    user: SignerWithAddress
) => {
    const provider = ethers.provider
    const approveTx = await tokenContract
        .connect(user)
        .approve("0xE592427A0AEce92De3Edee1F18E0157C05861564", ethers.utils.parseEther("99"))
    await approveTx.wait(1)

    const router: ISwapRouter = (await new ethers.Contract(
        "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        swapRouterABI,
        provider
    )) as ISwapRouter

    const tx = await router.connect(user).exactInputSingle(
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
