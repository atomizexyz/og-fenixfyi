import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Chain,chain, useNetwork } from "wagmi";

import { linkItems, textLinkItems } from "~/components/Constants";

const Footer = () => {
  const { t } = useTranslation("common");

  const { chain: currentChain } = useNetwork();

  const defaultChain: Chain = currentChain ?? chain.mainnet;

  return (
    <footer className="footer footer-center text-base-content py-8">
      <div>
        <div className="grid grid-cols-3 lg:grid-flow-col gap-10 lg:gap-6 text-neutral">
          {linkItems.map((item, index) => (
            <div key={index} className="tooltip tooltip-info" data-tip={t(item.t)}>
              <Link href={item.href} target="_blank">
                {item.icon}
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* <AddressLink name={t("donate")} address={DONATION_ADDRESS} chain={defaultChain} /> */}
      <div className="grid grid-flow-col gap-3">
        {textLinkItems.map((item, index) => (
          <Link href={item.href} key={index} target="_blank" className="link link-hover text-neutral">
            {t(item.t)}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
