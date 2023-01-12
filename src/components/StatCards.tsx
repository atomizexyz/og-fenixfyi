import CountUp from "react-countup";
import { ethers } from "ethers";
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

const projects = [
  { id: 1, name: "Time", fenix: "$900.00" },
  { id: 1, name: "Size", fenix: "$900.00" },
  // More projects...
];
interface BonusShareCardStat {}

export const BonusShareCard: NextPage<BonusShareCardStat> = (props) => {
  return (
    <div className="stat">
      <div className="stat-title">{"Calculator"}</div>

      <div className="min-w-full">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                colSpan={2}
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral sm:pl-6 md:pl-0"
              >
                Bonus
              </th>
              <th
                scope="col"
                className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-neutral sm:pr-6 md:pr-0"
              >
                FENIX
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-gray-200">
                <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0" colSpan={2}>
                  <div className="font-medium text-neutral">{project.name}</div>
                </td>
                <td className="py-4 pl-3 pr-4 text-right text-sm text-base-content sm:pr-6 md:pr-0">{project.fenix}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th
                scope="row"
                colSpan={2}
                className="hidden pl-6 pr-3 pt-4 text-right text-sm text-base-content sm:table-cell md:pl-0"
              >
                Subtotal
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm text-base-content sm:hidden">
                Subtotal
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm text-base-content sm:pr-6 md:pr-0">$4,485.00</td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={2}
                className="hidden pl-6 pr-3 pt-4 text-right text-sm text-base-content sm:table-cell md:pl-0"
              >
                Share Rate
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm text-base-content sm:hidden">
                Share Rate
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm text-base-content  sm:pr-6 md:pr-0">1.0%</td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={2}
                className="hidden pl-6 pr-3 pt-4 text-right text-sm text-neutral sm:table-cell md:pl-0"
              >
                Shares
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm text-neutral sm:hidden">
                Shares
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm text-neutral sm:pr-6 md:pr-0">$4,485.00</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
