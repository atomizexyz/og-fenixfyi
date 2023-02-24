import { Address, Chain } from "wagmi";
import {
  avalanche,
  bsc,
  evmos,
  fantom,
  foundry,
  goerli,
  localhost,
  mainnet,
  moonbeam,
  polygon,
  polygonMumbai,
} from "wagmi/chains";

import FENIX_ABI from "~/abi/FENIX_ABI";
import { dogechain, ethpow, x1Testnet } from "~/lib/chains";

export const fenixContract = (contractChain?: Chain) => {
  switch (contractChain?.id) {
    case foundry.id:
    case localhost.id:
      return {
        address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case goerli.id:
      return {
        address: "0x03E5BF7A1A861F23c9E1aAccAB02f172F6FDd8A9" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case polygonMumbai.id:
      return {
        address: "0x79E968E74618C24BA48D8DC2D3673fD23B68A07f" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case x1Testnet.id:
      return {
        address: "0xf4a0dfD69Cb0AD1dA2056b31b911C7dd51129cBe" as Address,
        abi: FENIX_ABI,
        chainId: contractChain.id,
      };
    case dogechain.id:
    case fantom.id:
    case avalanche.id:
    case ethpow.id:
    case bsc.id:
    case polygon.id:
    case evmos.id:
    case moonbeam.id:
    case mainnet.id:
    default:
      return {
        address: "" as Address,
        abi: FENIX_ABI,
        chainId: mainnet.id,
      };
  }
};
