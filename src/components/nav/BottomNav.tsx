import { clsx } from "clsx";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { isMobile } from "react-device-detect";

import { navigationItems } from "~/components/Constants";
import FENIXContext from "~/contexts/FENIXContext";

export const BottomNav: NextPage = () => {
  const { t } = useTranslation("common");

  const router = useRouter();
  const { xenBalance, allowance } = useContext(FENIXContext);

  return (
    <div
      className={clsx("btm-nav lg:hidden", {
        "h-24 pb-6": isMobile && ((window.navigator as any).standalone ?? false),
      })}
    >
      {navigationItems.map((item, index) => (
        <Link
          href={(() => {
            switch (index) {
              case 1:
                if (xenBalance?.value.eq(0)) return "/burn/get";
                if (allowance.gt(0)) return "/burn/xen";
                return "/burn/approve";
              default:
                return item.href;
            }
          })()}
          key={index}
          className={clsx("text-neutral", {
            "disabled active": router.pathname.startsWith(item.href),
            glass: !router.pathname.startsWith(item.href),
          })}
        >
          {item.icon}
          <span className="btm-nav-label">{t(item.t)}</span>
        </Link>
      ))}
    </div>
  );
};
