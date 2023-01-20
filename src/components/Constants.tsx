import {
  BookOpenIcon,
  ViewGridIcon,
  LockClosedIcon,
  DocumentTextIcon,
  ViewListIcon,
  FireIcon,
} from "@heroicons/react/outline";
import {
  DuneIcon,
  TwitterIcon,
  TelegramIcon,
  GitHubIcon,
  DiamondIcon,
  DiscordIcon,
  CoinmarketCapIcon,
  EthereumIcon,
  PulseChainIcon,
  PolygonIcon,
  AvalancheIcon,
  BinanceSmartChainIcon,
  EthereumPOWIcon,
  EVMOSIcon,
  MoonbeamIcon,
  FantomIcon,
  DogeChainIcon,
} from "~/components/Icons";

export const chainIcons: Record<number, JSX.Element> = {
  1: <EthereumIcon />,
  5: <EthereumIcon />,
  56: <BinanceSmartChainIcon />,
  97: <BinanceSmartChainIcon />,
  137: <PolygonIcon />,
  250: <FantomIcon />,
  941: <PulseChainIcon />,
  1284: <MoonbeamIcon />,
  2000: <DogeChainIcon />,
  9001: <EVMOSIcon />,
  10001: <EthereumPOWIcon />,
  43114: <AvalancheIcon />,
  80001: <PolygonIcon />,
};

export const navigationItems = [
  {
    id: 0,
    t: "dashboard.title",
    icon: <ViewGridIcon className="h-5 w-5" />,
    href: "/dashboard",
    canDisable: false,
  },
  {
    id: 1,
    t: "burn.title",
    icon: <FireIcon className="h-5 w-5" />,
    href: "/burn",
    canDisable: true,
  },
  {
    id: 2,
    t: "stake.title",
    icon: <LockClosedIcon className="h-5 w-5" />,
    href: "/stake",
    canDisable: true,
  },
  {
    id: 3,
    t: "portfolio.title",
    icon: <ViewListIcon className="h-5 w-5" />,
    href: "/portfolio",
    canDisable: false,
  },
];

export const textLinkItems = [
  {
    name: "Developer",
    t: "link.developer",
    href: "http://twitter.com/joeblau",
  },

  {
    name: "Website Source Code",
    t: "link.website-source-code",
    href: "https://github.com/atomizexyz/fenixfyi",
  },
];

export const linkItems = [
  {
    name: "Litepaper",
    t: "link.litepaper",
    icon: <DocumentTextIcon className="h-5 w-5" />,
    href: "http://github.com/atomizexyz/litepaper",
  },
  {
    name: "Docs",
    t: "link.docs",
    icon: <BookOpenIcon className="h-5 w-5" />,
    href: "http://docs.atomize.xyz",
  },
  {
    name: "Twitter",
    t: "link.twitter",
    icon: <TwitterIcon />,
    href: "https://twitter.com/fenix_protocol",
  },
  {
    name: "Telegram",
    t: "link.telegram",
    icon: <TelegramIcon />,
    href: "https://t.me/fenix_protocol",
  },
  {
    name: "GitHub",
    t: "link.github",
    icon: <GitHubIcon />,
    href: "https://github.com/atomizexyz",
  },
];
