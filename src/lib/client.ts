import { chain, configureChains, createClient } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
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
  x1Testnet,
} from "~/lib/chains";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;

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
  x1Testnet,
];

export const { chains, provider, webSocketProvider } = configureChains(chainList, [
  alchemyProvider({ apiKey: alchemyId, priority: 0 }),
  publicProvider({ priority: 3 }),
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
