import { clsx } from "clsx";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const PortfolioNav: NextPage = () => {
  const { t } = useTranslation("common");

  const router = useRouter();
  const { pathname } = router;
  return (
    <div className="tabs">
      <Link
        href="/stake"
        className={clsx("tab tab-lg tab-lifted text-neutral", {
          "tab-active glass": pathname == "/stake",
        })}
      >
        {t("stake.new")}
      </Link>
      <Link
        href="/stake/active"
        className={clsx("tab tab-lg tab-lifted text-neutral", {
          "tab-active glass": pathname == "/stake/active",
        })}
      >
        {t("stake.active")}
      </Link>
      <Link
        href="/stake/defer"
        className={clsx("tab tab-lg tab-lifted text-neutral", {
          "tab-active glass": pathname == "/stake/defer",
        })}
      >
        {t("stake.deferred")}
      </Link>
      <Link
        href="/stake/end"
        className={clsx("tab tab-lg tab-lifted text-neutral", {
          "tab-active glass": pathname == "/stake/end",
        })}
      >
        {t("stake.ended")}
      </Link>
    </div>
  );
};

export default PortfolioNav;
