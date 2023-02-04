import React, { createContext, useState } from "react";
import {
  Chain,
  useFeeData,
  useBalance,
  useAccount,
  useNetwork,
  useContractRead,
  useContractReads,
  useBlockNumber,
} from "wagmi";
import { BigNumber } from "ethers";
import { chainList } from "~/lib/client";
import { fenixContract } from "~/lib/fenix-contract";
import { xenContract } from "~/lib/xen-contract";
import { provider } from "~/lib/client";

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
  stakePoolSupply: string;
  rewardPoolSupply: string;
  xenBalance?: Balance;
  fenixBalance?: Balance;
  genesisTs: number;
  cooldownUnlockTs: number;
  shareRate: number;
  allowance: string;
}

const FENIXContext = createContext<IFENIXContext>({
  setChainOverride: (chain: Chain) => {},
  feeData: undefined,
  stakePoolSupply: "0",
  rewardPoolSupply: "0",
  xenBalance: undefined,
  fenixBalance: undefined,
  genesisTs: 0,
  cooldownUnlockTs: 0,
  shareRate: 0,
  allowance: "0",
});

export const FENIXProvider = ({ children }: any) => {
  const [chainOverride, setChainOverride] = useState<Chain | undefined>();
  const [feeData, setFeeData] = useState<FeeData | undefined>();
  const [stakePoolSupply, setStakePoolSupply] = useState<string>("0");
  const [rewardPoolSupply, setRewardPoolSupply] = useState<string>("0");
  const [xenBalance, setXenBalance] = useState<Balance | undefined>();
  const [fenixBalance, setFenixBalance] = useState<Balance | undefined>();
  const [genesisTs, setGenesisTs] = useState(0);
  const [cooldownUnlockTs, setCooldownUnlockTs] = useState(0);
  const [shareRate, setShareRate] = useState(0);
  const [allowance, setAllowance] = useState<string>("0");

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
    watch: true,
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
    watch: true,
  });

  useContractRead({
    ...xenContract(chain),
    functionName: "allowance",
    args: [address, fenixContract(chain).addressOrName],
    onSuccess(data) {
      setAllowance(String(data));
    },
    watch: true,
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
        functionName: "stakePoolSupply",
      },
      {
        ...fenixContract(chain),
        functionName: "rewardPoolSupply",
      },

      {
        ...fenixContract(chain),
        functionName: "cooldownUnlockTs",
      },
    ],
    onSuccess(data) {
      setGenesisTs(Number(data[0]));
      setShareRate(Number(data[1]));
      setStakePoolSupply(String(data[2]));
      setRewardPoolSupply(String(data[3]));
      setCooldownUnlockTs(Number(data[4]));
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
        stakePoolSupply,
        rewardPoolSupply,
        xenBalance,
        fenixBalance,
        genesisTs,
        cooldownUnlockTs,
        shareRate,
        allowance,
      }}
    >
      {children}
    </FENIXContext.Provider>
  );
};

export default FENIXContext;
