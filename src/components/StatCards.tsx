import CountUp from "react-countup";
import { UTC_TIME, formatFullDate } from "~/lib/helpers";
import { InformationCircleIcon } from "@heroicons/react/outline";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { t } from "i18next";

interface ProgressStat {
  title: string;
  percentComplete: number;
  value: number;
  max: number;
  daysRemaining: number;
  dateTs: number;
}

export const ProgressStatCard: NextPage<ProgressStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <div className="stat-value text-lg md:text-2xl text-right">
        <CountUp end={props.percentComplete} preserveValue={true} separator="," suffix="%" decimals={2} />
      </div>
      <div>
        <progress className="progress progress-secondary" value={props.value} max={props.max}></progress>
      </div>
      <div className="stat-desc text-right">{formatFullDate(props.dateTs)}</div>
    </div>
  );
};

interface DateStat {
  title: string;
  dateTs: number;
  isPast: boolean;
}

// days since date
export const daysSince = (date: number) => {
  return Math.floor((UTC_TIME - date) / 86400);
};

export const daysUntil = (date: number) => {
  return Math.floor((date - UTC_TIME) / 86400);
};

export const DateStatCard: NextPage<DateStat> = (props) => {
  const { t } = useTranslation("common");

  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <code className="stat-value text-lg md:text-2xl text-right">
        <CountUp
          end={props.isPast ? daysSince(props.dateTs) : daysUntil(props.dateTs)}
          preserveValue={true}
          separator={","}
          suffix={` ${t("card.days")}`}
        />
      </code>
      <div className="stat-desc text-right">{formatFullDate(props.dateTs)}</div>
    </div>
  );
};

interface NumberStat {
  title: string;
  value: number;
  separator?: string;
  decimals?: number;
  suffix?: string;
  description?: string;
  tokenDecimals?: number;
  tooltip?: string;
}

export const NumberStatCard: NextPage<NumberStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <code className="stat-value text-lg md:text-2xl text-right">
        <CountUp
          end={props.value}
          preserveValue={true}
          separator={props?.separator ?? ","}
          decimals={props?.decimals ?? 2}
          suffix={props.suffix ?? ""}
        />
      </code>
      <div className="stat-desc text-right">{props.description}</div>
      {props.tooltip && (
        <div className="alert shadow-lg glass mt-4">
          <div>
            <div>
              <InformationCircleIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs">{props.tooltip}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ChainStat {
  value: string;
  id: number;
}

export const ChainStatCard: NextPage<ChainStat> = (props) => {
  const { t } = useTranslation("common");

  return (
    <div className="stat">
      <div className="stat-title">{t("card.chain")}</div>
      <code className="stat-value text-lg md:text-2xl text-right">{props.value}</code>
      <div className="stat-desc text-right">{`Chain ID: ${props.id}`}</div>
    </div>
  );
};

interface DataStat {
  title: string;
  value: string;
  description?: string;
}

export const DataCard: NextPage<DataStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <code className="stat-value text-lg md:text-2xl text-right">{props.value}</code>
      <div className="stat-desc text-right">{props?.description}</div>
    </div>
  );
};

interface GrossRewardStat {
  title: string;
  value: number;
  suffix?: string;
  description?: string;
  descriptionNumber?: number;
  descriptionNumberSuffix?: string;
}

export const CountDataCard: NextPage<GrossRewardStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">{props.title}</div>
      <code className="stat-value text-lg md:text-2xl text-right">
        <CountUp end={props.value} preserveValue={true} separator="," suffix={props.suffix ?? ""} />
      </code>

      <div className="stat-desc text-right">
        {props?.descriptionNumber ? (
          <CountUp
            end={props.descriptionNumber}
            preserveValue={true}
            separator=","
            suffix={props.descriptionNumberSuffix ?? ""}
          />
        ) : (
          <>{props?.description}</>
        )}
      </div>
    </div>
  );
};

interface CountdownCardStat {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownCard: NextPage<CountdownCardStat> = (props) => {
  const { t } = useTranslation("common");

  return (
    <div className="stat">
      <div className="stat-title">{t("card.matures-in")}</div>
      <code className="stat-value text-lg md:text-2xl text-right">
        {props.days > 99 ? (
          <div className="">
            <div className="font-mono inline">{props.days}•</div>
            <span className="countdown font-mono">
              <span style={{ "--value": props.hours } as any}></span>:
              <span style={{ "--value": props.minutes } as any}></span>:
              <span style={{ "--value": props.seconds } as any}></span>
            </span>
          </div>
        ) : (
          <span className="countdown font-mono">
            <span style={{ "--value": props.days } as any}></span>•
            <span style={{ "--value": props.hours } as any}></span>:
            <span style={{ "--value": props.minutes } as any}></span>:
            <span style={{ "--value": props.seconds } as any}></span>
          </span>
        )}
      </code>
      <div className="stat-desc text-right">{t("card.countdown-details")}</div>
    </div>
  );
};

interface BonusShareCardStat {
  timeBonus: number;
  sizeBonus: number;
  subtotal: number;
  shareRate: number;
  shares: number;
}

export const BonusShareCard: NextPage<BonusShareCardStat> = (props) => {
  const { t } = useTranslation("common");

  return (
    <div className="stat">
      <div className="stat-title">{"Calculator"}</div>

      <div className="overflow-x-auto">
        <table className="table table-zebra table-compact w-full">
          <thead>
            <tr>
              <th colSpan={2}></th>
              <th className="text-right text-neutral">{t("fenix").toUpperCase()}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>
                <div className="flex flex-row space-x-1 items-center text-base-content">
                  <div className="font-medium">{t("card.time-bonus")}</div>
                  <div className="tooltip tooltip-right" data-tip="Time Bonus Formula">
                    <InformationCircleIcon className="w-4 h-4" />
                  </div>
                </div>
              </td>
              <td className="text-right text-sm text-neutral">
                <pre>
                  <CountUp end={props.timeBonus} preserveValue={true} separator="," decimals={4} />
                </pre>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="flex flex-row space-x-1 items-center text-base-content">
                  <div className="font-medium ">{t("card.size-bonus")}</div>
                  <div className="tooltip tooltip-right" data-tip="Size Bonus Formula">
                    <InformationCircleIcon className="w-4 h-4" />
                  </div>
                </div>
              </td>
              <td className="text-right text-sm text-neutral">
                <pre>
                  <CountUp end={props.sizeBonus} preserveValue={true} separator="," decimals={4} />
                </pre>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={2} className="text-left md:text-right text-sm text-base-content sm:table-cell">
                {t("card.subtotal")}
              </th>
              <td className="text-right text-sm text-neutral">
                <pre>
                  <CountUp end={props.subtotal} preserveValue={true} separator="," decimals={4} />
                </pre>
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={2} className="text-left md:text-right text-sm text-base-content sm:table-cell">
                {t("share-rate")}
              </th>
              <td className="text-right text-sm text-neutral">
                <pre>
                  <CountUp end={props.shareRate} preserveValue={true} separator="," suffix="%" decimals={4} />
                </pre>
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={2} className="text-left md:text-right text-sm text-base-content sm:table-cell">
                {t("card.shares")}
              </th>
              <td className="text-right text-sm text-neutral">
                <pre>
                  <CountUp end={props.shares} preserveValue={true} separator="," decimals={4} />
                </pre>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
