import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { StakeStatus } from "./StakeRow";

export const StakeHeaderFooter: NextPage<any> = (props) => {
  const { t } = useTranslation("common");

  const progressHeader = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.ACTIVE:
        return <th className="text-right">{t("portfolio.progress")}</th>;
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <th className="text-right">{t("portfolio.payout")}</th>;
    }
  };

  return (
    <tr>
      <th>{t("portfolio.start")}</th>
      <th>{t("portfolio.end")}</th>
      <th className="text-right">{t("portfolio.principal")}</th>
      <th className="text-right">{t("portfolio.shares")}</th>
      {progressHeader(props.status)}
      <th className="w-12"></th>
    </tr>
  );
};

export default StakeHeaderFooter;
