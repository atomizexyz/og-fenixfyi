import { Chain, chain, configureChains, createClient } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import {
  avaxMainnet,
  bscMainnet,
  dogechainMainnet,
  ethwMainnet,
  evmosMainnet,
  fantomMainnet,
  moonbeamMainnet,
  okxMainnet,
  polygonMainnet,
  polygonTestnet,
} from "~/lib/chains";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;

export const chainList = [
  chain.mainnet,
  bscMainnet,
  polygonMainnet,
  avaxMainnet,
  ethwMainnet,
  moonbeamMainnet,
  evmosMainnet,
  fantomMainnet,
  dogechainMainnet,
  okxMainnet,
  chain.goerli,
  polygonTestnet,
  chain.foundry,
  chain.localhost,
];

export const { chains, provider, webSocketProvider } = configureChains(chainList, [
  alchemyProvider({ apiKey: alchemyId, priority: 0 }),
  // jsonRpcProvider({
  //   priority: 1,
  //   rpc: (c: Chain) => {
  //     if (c.id === chain.mainnet.id) {
  //       return null;
  //     }
  //     return { http: c.rpcUrls.default };
  //   },
  // }),
  // infuraProvider({ apiKey: infuraId, priority: 2 }),
  publicProvider({ priority: 3 }),
  // jsonRpcProvider({
  //   priority: 4,
  //   rpc: (_chain: Chain) => ({
  //     http: "https://rpc.ankr.com/multichain",
  //   }),
  // }),
]);

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: false,
        shimChainChangedDisconnect: false,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "fenix.fyi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: false,
      },
    }),
  ],
  provider,
  webSocketProvider,
});
