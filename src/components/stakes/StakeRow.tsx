import type { NextPage } from "next";
import { formatDate, formatDecimals } from "~/lib/helpers";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export const StakeRow: NextPage<any> = (props) => {
  const { t } = useTranslation("common");

  const { stake } = props;

  const startTime = stake.startTs.getTime() / 1000;
  const endTime = startTime + stake.term * 86400;

  return (
    <>
      <td className="bg-transparent text-sm">{formatDate(startTime)}</td>
      <td className="bg-transparent text-sm">{formatDate(endTime)}</td>
      <td className="bg-transparent text-right text-sm">
        <pre>{formatDecimals(stake.fenix, 0)}</pre>
      </td>
      <td className="bg-transparent text-right text-sm">
        <pre>{formatDecimals(stake.shares, 0)}</pre>
      </td>
      <td className="bg-transparent text-right text-sm">
        <pre>{formatDecimals(stake.fenix, 0)}</pre>
      </td>
      <td className="bg-transparent text-center">
        <div className="flex flex-col">
          <progress className="progress progress-primary" value={5} max={10}></progress>
          <pre className="text-sm">50%</pre>
        </div>
      </td>
      <td className="bg-transparent text-right">
        <div className="dropdown dropdown-left">
          <label tabIndex={0} className="btn btn-sm glass text-neutral m-1">
            {t("portfolio.actions")}
          </label>
          <ul tabIndex={0} className="dropdown-content menu menu-compact p-2 shadow glass rounded-box w-48 space-y-2">
            <li>
              <Link href={`/stake/${stake.id}/defer`}>
                <a className="btn btn-sm glass text-neutral">{t("portfolio.defer-stake")}</a>
              </Link>
            </li>
            <li>
              <Link href={`/stake/${stake.id}/end`}>
                <a className="btn btn-sm glass text-neutral">{t("portfolio.end-stake")}</a>
              </Link>
            </li>
          </ul>
        </div>
      </td>
    </>
  );
};

export default StakeRow;
