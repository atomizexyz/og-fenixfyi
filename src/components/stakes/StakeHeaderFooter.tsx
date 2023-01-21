import type { NextPage } from "next";
import { useTranslation } from "next-i18next";

export const StakeHeaderFooter: NextPage<any> = (props) => {
  const { t } = useTranslation("common");

  return (
    <tr>
      <th>{t("portfolio.start")}</th>
      <th>{t("portfolio.end")}</th>
      <th className="text-right">{t("portfolio.principal")}</th>
      <th className="text-right">{t("portfolio.shares")}</th>
      <th className="text-right">{t("portfolio.progress")}</th>
      <th className="w-12"></th>
    </tr>
  );
};

export default StakeHeaderFooter;
