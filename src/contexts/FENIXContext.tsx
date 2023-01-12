import React, { createContext, useState } from "react";
import {
  Chain,
  useToken,
  useFeeData,
  useBalance,
  useAccount,
  useNetwork,
  useContractRead,
  useContractReads,
} from "wagmi";
import { BigNumber } from "ethers";
import { chainList } from "~/lib/client";
import { xenContract } from "~/lib/xen-contract";

export interface UserMint {
  user: string;
  amplifier: BigNumber;
  eaaRate: BigNumber;
  maturityTs: BigNumber;
  rank: BigNumber;
  term: BigNumber;
}

export interface UserStake {
  amount: BigNumber;
  apy: BigNumber;
  maturityTs: BigNumber;
  term: BigNumber;
}

export interface Formatted {
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

export interface FeeData {
  formatted: Formatted;
  gasPrice: BigNumber;
  lastBaseFeePerGas: BigNumber;
  maxFeePerGas: BigNumber;
  maxPriorityFeePerGas: BigNumber;
}

export interface TotalSupply {
  formatted: string;
  value: BigNumber;
}

export interface Token {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: TotalSupply;
}

export interface Balance {
  decimals: number;
  formatted: string;
  symbol: string;
  value: BigNumber;
}

interface IFENIXContext {
  setChainOverride: (chain: Chain) => void;
  feeData?: FeeData;
  token?: Token;
}

const FENIXContext = createContext<IFENIXContext>({
  setChainOverride: (chain: Chain) => {},
  feeData: undefined,
  token: undefined,
});

export const FENIXProvider = ({ children }: any) => {
  const [chainOverride, setChainOverride] = useState<Chain | undefined>();
  const [feeData, setFeeData] = useState<FeeData | undefined>();
  const [token, setToken] = useState<Token | undefined>();

  const { address } = useAccount();
  const { chain: networkChain } = useNetwork();

  const chain = chainOverride ?? networkChain ?? chainList[0];

  useToken({
    address: xenContract(chain).addressOrName,
    chainId: chain?.id,
    onSuccess(data) {
      setToken({
        address: data.address,
        decimals: data.decimals,
        name: data.name,
        symbol: data.symbol,
        totalSupply: {
          formatted: data.totalSupply.formatted,
          value: data.totalSupply.value,
        },
      });
    },
  });

  useFeeData({
    formatUnits: "gwei",
    onSuccess(data) {
      setFeeData({
        formatted: {
          gasPrice: data.formatted.gasPrice ?? "",
          maxFeePerGas: data.formatted.maxFeePerGas ?? "",
          maxPriorityFeePerGas: data.formatted.maxPriorityFeePerGas ?? "",
        },
        gasPrice: data.gasPrice ?? BigNumber.from(0),
        lastBaseFeePerGas: data.lastBaseFeePerGas ?? BigNumber.from(0),
        maxFeePerGas: data.maxFeePerGas ?? BigNumber.from(0),
        maxPriorityFeePerGas: data.maxPriorityFeePerGas ?? BigNumber.from(0),
      });
    },
    // watch: true,
  });

  return (
    <FENIXContext.Provider
      value={{
        setChainOverride,
        feeData,
        token,
      }}
    >
      {children}
    </FENIXContext.Provider>
  );
};

export default FENIXContext;