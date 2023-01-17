import { Chain, chain } from "wagmi";
import FENIX_ABI from "~/abi/FENIX_ABI";
import { pulseChain } from "~/lib/chains/pulseChainTestnet";
import { bscTestnet } from "~/lib/chains/bscTestnet";
import { bscMainnet } from "~/lib/chains/bscMainnet";
import { polygonMainnet } from "~/lib/chains/polygonMainnet";
import { avaxMainnet } from "~/lib/chains/avaxMainnet";
import { ethwMainnet } from "~/lib/chains/ethwMainnet";
import { moonbeamMainnet } from "~/lib/chains/moonbeamMainnet";
import { evmosMainnet } from "~/lib/chains/evmosMainnet";
import { fantomMainnet } from "~/lib/chains/fantomMainnet";
import { dogechainMainnet } from "~/lib/chains/dogechainMainnet";

export const fenixContract = (contractChain?: Chain) => {
  switch (contractChain?.id) {
    case chain.foundry.id:
    case chain.localhost.id:
      return {
        addressOrName: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
        contractInterface: FENIX_ABI,
        chainId: contractChain.id,
      };
    case dogechainMainnet.id:
    case pulseChain.id:
    case chain.goerli.id:
    case chain.polygonMumbai.id:
    case bscTestnet.id:
    case fantomMainnet.id:
    case avaxMainnet.id:
    case ethwMainnet.id:
    case bscMainnet.id:
    case polygonMainnet.id:
    case evmosMainnet.id:
    case moonbeamMainnet.id:
    case chain.mainnet.id:
    default:
      return {
        addressOrName: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
        contractInterface: FENIX_ABI,
        chainId: chain.mainnet.id,
      };
  }
};
