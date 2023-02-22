import { Chain, chain } from "wagmi";

import FENIX_ABI from "~/abi/FENIX_ABI";
import {
  avaxMainnet,
  bscMainnet,
  dogechainMainnet,
  ethwMainnet,
  evmosMainnet,
  fantomMainnet,
  moonbeamMainnet,
  polygonMainnet,
  x1Testnet,
} from "~/lib/chains";

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
        addressOrName: "0x03E5BF7A1A861F23c9E1aAccAB02f172F6FDd8A9",
        contractInterface: FENIX_ABI,
        chainId: contractChain.id,
      };
    case chain.polygonMumbai.id:
      return {
        addressOrName: "0x79E968E74618C24BA48D8DC2D3673fD23B68A07f",
        contractInterface: FENIX_ABI,
        chainId: contractChain.id,
      };
    case x1Testnet.id:
      return {
        addressOrName: "0xf4a0dfD69Cb0AD1dA2056b31b911C7dd51129cBe",
        contractInterface: FENIX_ABI,
        chainId: contractChain.id,
      };
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
        addressOrName: "",
        contractInterface: FENIX_ABI,
        chainId: chain.mainnet.id,
      };
  }
};
