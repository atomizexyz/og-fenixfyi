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
import { fenixContract } from "~/lib/fenix-contract";
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
  xenBalance?: Balance;
  fenixBalance?: Balance;
  startTs: number;
  shareRate: number;
  allowance: number;
}

const FENIXContext = createContext<IFENIXContext>({
  setChainOverride: (chain: Chain) => {},
  feeData: undefined,
  xenBalance: undefined,
  fenixBalance: undefined,
  startTs: 0,
  shareRate: 0,
  allowance: 0,
});

export const FENIXProvider = ({ children }: any) => {
  const [chainOverride, setChainOverride] = useState<Chain | undefined>();
  const [feeData, setFeeData] = useState<FeeData | undefined>();
  const [xenBalance, setXenBalance] = useState<Balance | undefined>();
  const [fenixBalance, setFenixBalance] = useState<Balance | undefined>();
  const [startTs, setStartTs] = useState(0);
  const [shareRate, setShareRate] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const { address } = useAccount();
  const { chain: networkChain } = useNetwork();

  const chain = chainOverride ?? networkChain ?? chainList[0];

  useBalance({
    addressOrName: address,
    token: fenixContract(chain).addressOrName,
    onSuccess(data) {
      setFenixBalance({
        decimals: data.decimals,
        formatted: data.formatted,
        symbol: data.symbol,
        value: data.value,
      });
    },
    // watch: true,
  });

  useBalance({
    addressOrName: address,
    token: xenContract(chain).addressOrName,
    onSuccess(data) {
      setXenBalance({
        decimals: data.decimals,
        formatted: data.formatted,
        symbol: data.symbol,
        value: data.value,
      });
    },
    // watch: true,
  });

  useContractReads({
    contracts: [
      {
        ...fenixContract(chain),
        functionName: "startTs",
      },
      {
        ...fenixContract(chain),
        functionName: "shareRate",
      },
      {
        ...fenixContract(chain),
        functionName: "allowance",
        args: [address, fenixContract(chain).addressOrName],
      },
    ],
    onSuccess(data) {
      setStartTs(Number(data[0]));
      setShareRate(Number(data[1]));
      setAllowance(Number(data[2]));
    },
    watch: true,
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
        xenBalance,
        fenixBalance,
        startTs,
        shareRate,
        allowance,
      }}
    >
      {children}
    </FENIXContext.Provider>
  );
};

export default FENIXContext;
