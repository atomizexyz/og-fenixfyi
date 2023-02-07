import { Chain, chain } from "wagmi";

import FENIX_ABI from "~/abi/FENIX_ABI";
import { avaxMainnet } from "~/lib/chains/avaxMainnet";
import { bscMainnet } from "~/lib/chains/bscMainnet";
import { bscTestnet } from "~/lib/chains/bscTestnet";
import { dogechainMainnet } from "~/lib/chains/dogechainMainnet";
import { ethwMainnet } from "~/lib/chains/ethwMainnet";
import { evmosMainnet } from "~/lib/chains/evmosMainnet";
import { fantomMainnet } from "~/lib/chains/fantomMainnet";
import { moonbeamMainnet } from "~/lib/chains/moonbeamMainnet";
import { polygonMainnet } from "~/lib/chains/polygonMainnet";
import { pulseChain } from "~/lib/chains/pulseChainTestnet";

export const fenixContract = (contractChain?: Chain) => {
  switch (contractChain?.id) {
    case chain.foundry.id:
    case chain.localhost.id:
      return {
        addressOrName: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        contractInterface: FENIX_ABI,
        chainId: contractChain.id,
      };
    case chain.goerli.id:
      return {
        addressOrName: "0x2f513FC3e2DE3Bcd9bd9936f479ada5139517CeC",
        contractInterface: FENIX_ABI,
        chainId: contractChain.id,
      };
    case chain.polygonMumbai.id:
      return {
        addressOrName: "0x932b3C9F0C8db726Da67f5159af76f3d80d70fc9",
        contractInterface: FENIX_ABI,
        chainId: contractChain.id,
      };
    case bscTestnet.id:
    case pulseChain.id:
    case dogechainMainnet.id:
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
        addressOrName: "0x2f513FC3e2DE3Bcd9bd9936f479ada5139517CeC",
        contractInterface: FENIX_ABI,
        chainId: chain.mainnet.id,
      };
  }
};
