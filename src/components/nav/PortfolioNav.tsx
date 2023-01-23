import { clsx } from "clsx";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const PortfolioNav: NextPage = () => {
  const { t } = useTranslation("common");

  const router = useRouter();
  const { pathname } = router;
  return (
    <div className="tabs">
      <Link
        href="/portfolio/active"
        className={clsx("tab tab-lg tab-lifted text-neutral", {
          "tab-active glass": pathname == "/portfolio/active",
        })}
      >
        {t("portfolio.active")}
      </Link>
      <Link
        href="/portfolio/defer"
        className={clsx("tab tab-lg tab-lifted text-neutral", {
          "tab-active glass": pathname == "/portfolio/defer",
        })}
      >
        {t("portfolio.deferred")}
      </Link>
      <Link
        href="/portfolio/end"
        className={clsx("tab tab-lg tab-lifted text-neutral", {
          "tab-active glass": pathname == "/portfolio/end",
        })}
      >
        {t("portfolio.ended")}
      </Link>
    </div>
  );
};

export default PortfolioNav;
