import type { NextPage } from "next";
import { useTranslation } from "next-i18next";

export const StakeHeaderFooter: NextPage<any> = (props) => {
  const { t } = useTranslation("common");

  return (
    <tr>
      <th className="bg-transparent hidden lg:table-cell">{t("portfolio.start")}</th>
      <th className="bg-transparent hidden lg:table-cell">{t("portfolio.end")}</th>
      <th className="bg-transparent hidden lg:table-cell text-right">{t("portfolio.principal")}</th>
      <th className="bg-transparent hidden lg:table-cell text-right">{t("portfolio.shares")}</th>
      <th className="bg-transparent hidden lg:table-cell text-right">{t("portfolio.total")}</th>
      <th className="bg-transparent hidden lg:table-cell text-right">{t("portfolio.progress")}</th>
      <th className="bg-transparent hidden lg:table-cell"></th>
    </tr>
  );
};

export default StakeHeaderFooter;
