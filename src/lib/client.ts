import { Chain,chain, configureChains, createClient } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import {
  avaxMainnet,
  bscMainnet,
  bscTestnet,
  dogechainMainnet,
  ethwMainnet,
  evmosMainnet,
  fantomMainnet,
  moonbeamMainnet,
  okxMainnet,
  polygonMainnet,
  polygonTestnet,
  pulseChain,
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
  bscTestnet,
  okxMainnet,
  chain.goerli,
  pulseChain,
  polygonTestnet,
  chain.foundry,
  chain.localhost,
];

export const { chains, provider, webSocketProvider } = configureChains(chainList, [
  // alchemyProvider({ apiKey: alchemyId, priority: 0 }),
  // infuraProvider({ apiKey: infuraId, priority: 0 }),
  jsonRpcProvider({
    priority: 0,
    rpc: (c: Chain) => {
      if (c.id === chain.mainnet.id) {
        return null;
      }
      return { http: c.rpcUrls.default };
    },
  }),
  publicProvider({ priority: 1 }),
  // jsonRpcProvider({
  //   priority: 2,
  //   rpc: (chain: Chain) => ({
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
