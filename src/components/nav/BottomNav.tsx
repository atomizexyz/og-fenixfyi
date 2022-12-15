import Link from "next/link";
import { useRouter } from "next/router";
import { clsx } from "clsx";
import React from "react";
import { navigationItems } from "~/components/Constants";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { isMobile } from "react-device-detect";

export const BottomNav: NextPage = () => {
  const { t } = useTranslation("common");

  const router = useRouter();

  return (
    <div
      className={clsx("btm-nav lg:hidden", {
        "h-24 pb-6":
          isMobile && ((window.navigator as any).standalone ?? false),
      })}
    >
      {navigationItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <a
            className={clsx("text-neutral", {
              "disabled active": router.pathname.startsWith(item.href),
              glass: !router.pathname.startsWith(item.href),
            })}
          >
            {item.icon}
            <span className="btm-nav-label">{t(item.t)}</span>
          </a>
        </Link>
      ))}
    </div>
  );
};
