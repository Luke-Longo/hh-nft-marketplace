import { BigNumber } from "ethers"

type NetworkConfigItem = {
    name: string
    fundAmount: BigNumber
    fee?: string
    keyHash?: string
    interval?: string
    linkToken?: string
    vrfCoordinator?: string
    keepersUpdateInterval?: string
    oracle?: string
    jobId?: string
    ethUsdPriceFeed?: string
    daiUsdPriceFeed?: string
    usdcUsdPriceFeed?: string
    daiAddress?: string
    usdcAddress?: string
    wethAddress?: string
}

type NetworkConfigMap = {
    [chainId: string]: NetworkConfigItem
}

export const networkConfig: NetworkConfigMap = {
    default: {
        name: "hardhat",
        fee: "100000000000000000",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
        fundAmount: BigNumber.from("1000000000000000000"),
        keepersUpdateInterval: "30",
        ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        daiUsdPriceFeed: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
        usdcUsdPriceFeed: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
        daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    31337: {
        name: "localhost",
        fee: "100000000000000000",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
        fundAmount: BigNumber.from("1000000000000000000"),
        keepersUpdateInterval: "30",
        ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        daiUsdPriceFeed: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
        usdcUsdPriceFeed: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
        daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    1: {
        name: "mainnet",
        linkToken: "0x514910771af9ca656af840dff83e8264ecf986ca",
        fundAmount: BigNumber.from("0"),
        keepersUpdateInterval: "30",
        ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        daiUsdPriceFeed: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
        usdcUsdPriceFeed: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
        daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    5: {
        name: "goerli",
        linkToken: "0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
        keyHash: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        vrfCoordinator: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        oracle: "0xCC79157eb46F5624204f47AB42b3906cAA40eaB7",
        jobId: "ca98366cc7314957b8c012c72f05aeeb",
        fee: "100000000000000000",
        fundAmount: BigNumber.from("100000000000000000"),
        keepersUpdateInterval: "30",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        daiUsdPriceFeed: "0x0d79df66BE487753B02D015Fb622DED7f0E9798d",
        usdcUsdPriceFeed: "0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7",
        daiAddress: "0x73967c6a0904aA032C103b4104747E88c566B1A2",
        usdcAddress: "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557",
        wethAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    },
    137: {
        name: "polygon",
        linkToken: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        oracle: "0x0a31078cd57d23bf9e8e8f1ba78356ca2090569e",
        jobId: "12b86114fa9e46bab3ca436f88e1a912",
        fee: "100000000000000",
        fundAmount: BigNumber.from("100000000000000"),
        wethAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    },
}

export const developmentChains: string[] = ["hardhat", "localhost"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6
export const ERC20ABI = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_spender",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "approve",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_from",
                type: "address",
            },
            {
                name: "_to",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "transferFrom",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
            {
                name: "",
                type: "uint8",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "balance",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_to",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address",
            },
            {
                name: "_spender",
                type: "address",
            },
        ],
        name: "allowance",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        payable: true,
        stateMutability: "payable",
        type: "fallback",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                name: "value",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
]

export const swapRouterABI = [
    {
        inputs: [
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_WETH9", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "WETH9",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "bytes", name: "path", type: "bytes" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                    { internalType: "uint256", name: "amountIn", type: "uint256" },
                    { internalType: "uint256", name: "amountOutMinimum", type: "uint256" },
                ],
                internalType: "struct ISwapRouter.ExactInputParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInput",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                    { internalType: "uint256", name: "amountIn", type: "uint256" },
                    { internalType: "uint256", name: "amountOutMinimum", type: "uint256" },
                    { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
                ],
                internalType: "struct ISwapRouter.ExactInputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInputSingle",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "bytes", name: "path", type: "bytes" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                    { internalType: "uint256", name: "amountOut", type: "uint256" },
                    { internalType: "uint256", name: "amountInMaximum", type: "uint256" },
                ],
                internalType: "struct ISwapRouter.ExactOutputParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutput",
        outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                    { internalType: "uint256", name: "amountOut", type: "uint256" },
                    { internalType: "uint256", name: "amountInMaximum", type: "uint256" },
                    { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
                ],
                internalType: "struct ISwapRouter.ExactOutputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutputSingle",
        outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "factory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes[]", name: "data", type: "bytes[]" }],
        name: "multicall",
        outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }],
        stateMutability: "payable",
        type: "function",
    },
    { inputs: [], name: "refundETH", outputs: [], stateMutability: "payable", type: "function" },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermit",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermitAllowed",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermitAllowedIfNecessary",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermitIfNecessary",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
        ],
        name: "sweepToken",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
        ],
        name: "sweepTokenWithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "int256", name: "amount0Delta", type: "int256" },
            { internalType: "int256", name: "amount1Delta", type: "int256" },
            { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "uniswapV3SwapCallback",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
        ],
        name: "unwrapWETH9",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
        ],
        name: "unwrapWETH9WithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
]
