import { ethers } from "hardhat"

export const getGasPrice = async () => {
    const provider = ethers.provider
    const gasPrice = await provider.getGasPrice()
    console.log("gasPrice", gasPrice.toString())
    return gasPrice
}
