import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { StakeStatus } from "./StakeRow";

export const StakeHeaderFooter: NextPage<any> = (props) => {
  const { t } = useTranslation("common");

  const progressHeader = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.ACTIVE:
        return <th className="text-right">{t("stake.progress")}</th>;
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return <th className="text-right">{t("stake.payout")}</th>;
    }
  };

  return (
    <tr>
      <th>{t("stake.start")}</th>
      <th>{t("stake.end")}</th>
      <th className="text-right">{t("stake.principal")}</th>
      <th className="text-right">{t("stake.shares")}</th>
      {progressHeader(props.status)}
      <th className="w-12"></th>
    </tr>
  );
};

export default StakeHeaderFooter;
