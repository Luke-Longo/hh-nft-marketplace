/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface NftMarketplaceInterface extends utils.Interface {
  functions: {
    "buyItem(address,uint256)": FunctionFragment;
    "listItem(address,uint256,uint256)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "buyItem" | "listItem"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "buyItem",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "listItem",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "buyItem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "listItem", data: BytesLike): Result;

  events: {
    "ItemBought(address,uint256,address,uint256,address)": EventFragment;
    "NftListed(address,address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ItemBought"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NftListed"): EventFragment;
}

export interface ItemBoughtEventObject {
  nftAddress: string;
  tokenId: BigNumber;
  buyer: string;
  price: BigNumber;
  seller: string;
}
export type ItemBoughtEvent = TypedEvent<
  [string, BigNumber, string, BigNumber, string],
  ItemBoughtEventObject
>;

export type ItemBoughtEventFilter = TypedEventFilter<ItemBoughtEvent>;

export interface NftListedEventObject {
  seller: string;
  nftAddress: string;
  tokenId: BigNumber;
  price: BigNumber;
}
export type NftListedEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  NftListedEventObject
>;

export type NftListedEventFilter = TypedEventFilter<NftListedEvent>;

export interface NftMarketplace extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: NftMarketplaceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    buyItem(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    listItem(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  buyItem(
    nftAddress: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  listItem(
    nftAddress: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    price: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    buyItem(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    listItem(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      price: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ItemBought(address,uint256,address,uint256,address)"(
      nftAddress?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
      buyer?: PromiseOrValue<string> | null,
      price?: null,
      seller?: null
    ): ItemBoughtEventFilter;
    ItemBought(
      nftAddress?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
      buyer?: PromiseOrValue<string> | null,
      price?: null,
      seller?: null
    ): ItemBoughtEventFilter;

    "NftListed(address,address,uint256,uint256)"(
      seller?: PromiseOrValue<string> | null,
      nftAddress?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
      price?: null
    ): NftListedEventFilter;
    NftListed(
      seller?: PromiseOrValue<string> | null,
      nftAddress?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
      price?: null
    ): NftListedEventFilter;
  };

  estimateGas: {
    buyItem(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    listItem(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buyItem(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    listItem(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
