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

export declare namespace NftMarketplaceChallenge {
  export type PricingStruct = {
    amount: PromiseOrValue<BigNumberish>;
    token: PromiseOrValue<BigNumberish>;
  };

  export type PricingStructOutput = [BigNumber, number] & {
    amount: BigNumber;
    token: number;
  };

  export type ListingParamsStruct = {
    nftAddress: PromiseOrValue<string>;
    tokenId: PromiseOrValue<BigNumberish>;
    pricing: NftMarketplaceChallenge.PricingStruct;
  };

  export type ListingParamsStructOutput = [
    string,
    BigNumber,
    NftMarketplaceChallenge.PricingStructOutput
  ] & {
    nftAddress: string;
    tokenId: BigNumber;
    pricing: NftMarketplaceChallenge.PricingStructOutput;
  };

  export type ListingStruct = {
    pricing: NftMarketplaceChallenge.PricingStruct;
    seller: PromiseOrValue<string>;
  };

  export type ListingStructOutput = [
    NftMarketplaceChallenge.PricingStructOutput,
    string
  ] & { pricing: NftMarketplaceChallenge.PricingStructOutput; seller: string };
}

export interface NftMarketplaceChallengeInterface extends utils.Interface {
  functions: {
    "buyItem((address,uint256,(uint256,uint8)))": FunctionFragment;
    "cancelListing(address,uint256)": FunctionFragment;
    "getListing(address,uint256)": FunctionFragment;
    "getListingPrice(address,uint256)": FunctionFragment;
    "getListingPriceUsd(address,uint256)": FunctionFragment;
    "getProceeds(address,uint8)": FunctionFragment;
    "listItem((address,uint256,(uint256,uint8)))": FunctionFragment;
    "tokenAddresses(uint8)": FunctionFragment;
    "updateListing((address,uint256,(uint256,uint8)))": FunctionFragment;
    "withdrawAllProceeds()": FunctionFragment;
    "withdrawSingleProceeds(uint8)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "buyItem"
      | "cancelListing"
      | "getListing"
      | "getListingPrice"
      | "getListingPriceUsd"
      | "getProceeds"
      | "listItem"
      | "tokenAddresses"
      | "updateListing"
      | "withdrawAllProceeds"
      | "withdrawSingleProceeds"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "buyItem",
    values: [NftMarketplaceChallenge.ListingParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelListing",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getListing",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getListingPrice",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getListingPriceUsd",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getProceeds",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "listItem",
    values: [NftMarketplaceChallenge.ListingParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenAddresses",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateListing",
    values: [NftMarketplaceChallenge.ListingParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawAllProceeds",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawSingleProceeds",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "buyItem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "cancelListing",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getListing", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getListingPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getListingPriceUsd",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProceeds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "listItem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateListing",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawAllProceeds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawSingleProceeds",
    data: BytesLike
  ): Result;

  events: {
    "ItemBought(tuple,address,address)": EventFragment;
    "ItemListed(tuple,address)": EventFragment;
    "ListingCancelled(address,uint256,address)": EventFragment;
    "Withdraw(address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ItemBought"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ItemListed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ListingCancelled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}

export interface ItemBoughtEventObject {
  listingParams: NftMarketplaceChallenge.ListingParamsStructOutput;
  buyer: string;
  seller: string;
}
export type ItemBoughtEvent = TypedEvent<
  [NftMarketplaceChallenge.ListingParamsStructOutput, string, string],
  ItemBoughtEventObject
>;

export type ItemBoughtEventFilter = TypedEventFilter<ItemBoughtEvent>;

export interface ItemListedEventObject {
  listingParams: NftMarketplaceChallenge.ListingParamsStructOutput;
  seller: string;
}
export type ItemListedEvent = TypedEvent<
  [NftMarketplaceChallenge.ListingParamsStructOutput, string],
  ItemListedEventObject
>;

export type ItemListedEventFilter = TypedEventFilter<ItemListedEvent>;

export interface ListingCancelledEventObject {
  nftAddress: string;
  tokenId: BigNumber;
  seller: string;
}
export type ListingCancelledEvent = TypedEvent<
  [string, BigNumber, string],
  ListingCancelledEventObject
>;

export type ListingCancelledEventFilter =
  TypedEventFilter<ListingCancelledEvent>;

export interface WithdrawEventObject {
  withdrawer: string;
  amount: BigNumber;
  token: BigNumber;
}
export type WithdrawEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  WithdrawEventObject
>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface NftMarketplaceChallenge extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: NftMarketplaceChallengeInterface;

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
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    cancelListing(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getListing(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[NftMarketplaceChallenge.ListingStructOutput]>;

    getListingPrice(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[NftMarketplaceChallenge.PricingStructOutput]>;

    getListingPriceUsd(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getProceeds(
      user: PromiseOrValue<string>,
      token: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    listItem(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    tokenAddresses(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    updateListing(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawAllProceeds(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawSingleProceeds(
      token: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  buyItem(
    listingParams: NftMarketplaceChallenge.ListingParamsStruct,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  cancelListing(
    nftAddress: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getListing(
    nftAddress: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<NftMarketplaceChallenge.ListingStructOutput>;

  getListingPrice(
    nftAddress: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<NftMarketplaceChallenge.PricingStructOutput>;

  getListingPriceUsd(
    nftAddress: PromiseOrValue<string>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getProceeds(
    user: PromiseOrValue<string>,
    token: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  listItem(
    listingParams: NftMarketplaceChallenge.ListingParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  tokenAddresses(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  updateListing(
    listingParams: NftMarketplaceChallenge.ListingParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawAllProceeds(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawSingleProceeds(
    token: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    buyItem(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    cancelListing(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getListing(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<NftMarketplaceChallenge.ListingStructOutput>;

    getListingPrice(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<NftMarketplaceChallenge.PricingStructOutput>;

    getListingPriceUsd(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getProceeds(
      user: PromiseOrValue<string>,
      token: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    listItem(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    tokenAddresses(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    updateListing(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawAllProceeds(overrides?: CallOverrides): Promise<void>;

    withdrawSingleProceeds(
      token: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ItemBought(tuple,address,address)"(
      listingParams?: null,
      buyer?: PromiseOrValue<string> | null,
      seller?: null
    ): ItemBoughtEventFilter;
    ItemBought(
      listingParams?: null,
      buyer?: PromiseOrValue<string> | null,
      seller?: null
    ): ItemBoughtEventFilter;

    "ItemListed(tuple,address)"(
      listingParams?: null,
      seller?: null
    ): ItemListedEventFilter;
    ItemListed(listingParams?: null, seller?: null): ItemListedEventFilter;

    "ListingCancelled(address,uint256,address)"(
      nftAddress?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
      seller?: PromiseOrValue<string> | null
    ): ListingCancelledEventFilter;
    ListingCancelled(
      nftAddress?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
      seller?: PromiseOrValue<string> | null
    ): ListingCancelledEventFilter;

    "Withdraw(address,uint256,uint256)"(
      withdrawer?: PromiseOrValue<string> | null,
      amount?: PromiseOrValue<BigNumberish> | null,
      token?: null
    ): WithdrawEventFilter;
    Withdraw(
      withdrawer?: PromiseOrValue<string> | null,
      amount?: PromiseOrValue<BigNumberish> | null,
      token?: null
    ): WithdrawEventFilter;
  };

  estimateGas: {
    buyItem(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    cancelListing(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getListing(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getListingPrice(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getListingPriceUsd(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getProceeds(
      user: PromiseOrValue<string>,
      token: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    listItem(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    tokenAddresses(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    updateListing(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdrawAllProceeds(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdrawSingleProceeds(
      token: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buyItem(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    cancelListing(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getListing(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getListingPrice(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getListingPriceUsd(
      nftAddress: PromiseOrValue<string>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getProceeds(
      user: PromiseOrValue<string>,
      token: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    listItem(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    tokenAddresses(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    updateListing(
      listingParams: NftMarketplaceChallenge.ListingParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdrawAllProceeds(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdrawSingleProceeds(
      token: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
