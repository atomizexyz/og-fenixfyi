import {
  BookOpenIcon,
  ViewGridIcon,
  LockClosedIcon,
  DocumentTextIcon,
  ViewListIcon,
  FireIcon,
  HomeIcon,
  GiftIcon,
  BriefcaseIcon,
} from "@heroicons/react/outline";
import { TwitterIcon, TelegramIcon, GitHubIcon, FigmaIcon } from "~/components/Icons";

import {
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
  OKChainIcon,
  FoundryIcon,
} from "~/components/ChainIcons";

export const chainIcons: Record<number, JSX.Element> = {
  1: <EthereumIcon />,
  5: <EthereumIcon />,
  56: <BinanceSmartChainIcon />,
  66: <OKChainIcon />,
  97: <BinanceSmartChainIcon />,
  137: <PolygonIcon />,
  250: <FantomIcon />,
  941: <PulseChainIcon />,
  1284: <MoonbeamIcon />,
  1337: <HomeIcon className="h-5 w-5" />,
  2000: <DogeChainIcon />,
  9001: <EVMOSIcon />,
  10001: <EthereumPOWIcon />,
  43114: <AvalancheIcon />,
  80001: <PolygonIcon />,
  31337: <FoundryIcon />,
};

export const navigationItems = [
  {
    id: 0,
    t: "Dashboard",
    icon: <ViewGridIcon className="h-5 w-5" />,
    href: "/dashboard",
    canDisable: false,
  },
  {
    id: 1,
    t: "Burn",
    icon: <FireIcon className="h-5 w-5" />,
    href: "/burn",
    canDisable: true,
  },
  {
    id: 2,
    t: "Stake",
    icon: <LockClosedIcon className="h-5 w-5" />,
    href: "/stake",
    canDisable: true,
  },
  {
    id: 3,
    t: "Portfolio",
    icon: <BriefcaseIcon className="h-5 w-5" />,
    href: "/portfolio",
    canDisable: false,
  },
  {
    id: 4,
    t: "Reward",
    icon: <GiftIcon className="h-5 w-5" />,
    href: "/reward",
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
    name: "Brand Assets",
    t: "link.brand",
    icon: <FigmaIcon />,
    href: "https://brand.fenix.fyi",
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
