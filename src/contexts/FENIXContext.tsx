import { Address } from "@wagmi/core";
import { BigNumber } from "ethers";
import React, { createContext, useEffect, useState } from "react";
import {
  Chain,
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useFeeData,
  useNetwork,
  useToken,
} from "wagmi";
import { mainnet } from "wagmi/chains";

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
  address: Address;
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
  setChainOverride: (_chain: Chain) => void;
  currentChain: Chain;
  feeData?: FeeData;
  equityPoolSupply: BigNumber;
  rewardPoolSupply: BigNumber;
  xenBalance?: Balance;
  fenixBalance?: Balance;
  genesisTs: number;
  cooldownUnlockTs: number;
  shareRate: BigNumber;
  allowance: BigNumber;
  equityPoolTotalShares: BigNumber;
  token?: Token;
}

const FENIXContext = createContext<IFENIXContext>({
  setChainOverride: (_chain: Chain) => {},
  currentChain: mainnet,
  feeData: undefined,
  equityPoolSupply: BigNumber.from(0),
  rewardPoolSupply: BigNumber.from(0),
  xenBalance: undefined,
  fenixBalance: undefined,
  genesisTs: 0,
  cooldownUnlockTs: 0,
  shareRate: BigNumber.from(0),
  allowance: BigNumber.from(0),
  equityPoolTotalShares: BigNumber.from(0),
  token: undefined,
});

export const FENIXProvider = ({ children }: any) => {
  const [chainOverride, setChainOverride] = useState<Chain | undefined>();
  const [currentChain, setCurrentChain] = useState<Chain>(mainnet);
  const [feeData, setFeeData] = useState<FeeData | undefined>();
  const [equityPoolSupply, setEquityPoolSupply] = useState<BigNumber>(BigNumber.from(0));
  const [rewardPoolSupply, setRewardPoolSupply] = useState<BigNumber>(BigNumber.from(0));
  const [xenBalance, setXenBalance] = useState<Balance | undefined>();
  const [fenixBalance, setFenixBalance] = useState<Balance | undefined>();
  const [genesisTs, setGenesisTs] = useState(0);
  const [cooldownUnlockTs, setCooldownUnlockTs] = useState(0);
  const [shareRate, setShareRate] = useState<BigNumber>(BigNumber.from(0));
  const [allowance, setAllowance] = useState<BigNumber>(BigNumber.from(0));
  const [equityPoolTotalShares, setEquityPoolTotalShares] = useState<BigNumber>(BigNumber.from(0));
  const [token, setToken] = useState<Token | undefined>();

  const { address } = useAccount() as unknown as { address: Address };
  const { chain: networkChain } = useNetwork();

  const chain = chainOverride ?? networkChain ?? mainnet;

  const { data: tokenData } = useToken({
    address: fenixContract(chain).address,
    chainId: chain?.id,
  });

  useBalance({
    address: address,
    token: fenixContract(chain).address,
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
    address: address,
    token: xenContract(chain).address,
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

  useContractRead({
    ...xenContract(chain),
    functionName: "allowance",
    args: [address, fenixContract(chain).address],
    onSuccess(data) {
      setAllowance(BigNumber.from(data ?? 0));
    },
    // watch: true,
  });

  useContractReads({
    contracts: [
      {
        ...fenixContract(chain),
        functionName: "genesisTs",
      },
      {
        ...fenixContract(chain),
        functionName: "shareRate",
      },
      {
        ...fenixContract(chain),
        functionName: "equityPoolSupply",
      },
      {
        ...fenixContract(chain),
        functionName: "rewardPoolSupply",
      },
      {
        ...fenixContract(chain),
        functionName: "cooldownUnlockTs",
      },
      {
        ...fenixContract(chain),
        functionName: "equityPoolTotalShares",
      },
    ],
    onSuccess(data) {
      setGenesisTs(Number(data[0]));
      setShareRate(BigNumber.from(data[1] ?? 0));
      console.log("hwew:", BigNumber.from(data[2] ?? 0));
      setEquityPoolSupply(BigNumber.from(data[2] ?? 0));
      setRewardPoolSupply(BigNumber.from(data[3] ?? 0));
      setCooldownUnlockTs(Number(data[4]));
      setEquityPoolTotalShares(BigNumber.from(data[5] ?? 0));
    },
    // watch: true,
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

  useEffect(() => {
    if (tokenData) {
      setToken(tokenData);
      setCurrentChain(chain);
    }
  }, [chain, tokenData]);

  return (
    <FENIXContext.Provider
      value={{
        setChainOverride,
        currentChain,
        feeData,
        equityPoolSupply,
        rewardPoolSupply,
        xenBalance,
        fenixBalance,
        genesisTs,
        cooldownUnlockTs,
        shareRate,
        allowance,
        equityPoolTotalShares,
        token,
      }}
    >
      {children}
    </FENIXContext.Provider>
  );
};

export default FENIXContext;
