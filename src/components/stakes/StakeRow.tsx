import type { NextPage } from "next";
import { formatDate, formatDecimals } from "~/lib/helpers";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useContractRead } from "wagmi";
import { fenixContract } from "~/lib/fenix-contract";
import FENIX_ABI from "~/abi/FENIX_ABI";
import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import { progressDays } from "~/lib/helpers";
import CountUp from "react-countup";
import { clsx } from "clsx";
import { watch } from "fs";
import { BigNumber, ethers } from "ethers";

export enum StakeStatus {
  ACTIVE = 0,
  DEFER = 1,
  END = 2,
}

export const StakeRow: NextPage<any> = (props) => {
  const { t } = useTranslation("common");
  const [percent, setPercent] = useState(0);
  const [canDefer, setCanDefer] = useState<boolean>(false);

  const { data: stake } = useContractRead({
    addressOrName: props.contractAddressOrName,
    contractInterface: FENIX_ABI,
    functionName: "stakeFor",
    args: [props.stakerAddress, props.index],
    watch: true,
  });

  console.log("start:", stake);
  const startTime = Number(stake?.startTs ?? 0);
  const endTime = startTime + stake?.term * 86400;

  const renderProgress = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.END:
      case StakeStatus.DEFER:
        return (
          <div className="flex flex-col">
            <pre className="text-right text-sm">
              <CountUp
                end={Number(ethers.utils.formatUnits(stake?.payout ?? 0, 18))}
                preserveValue={true}
                separator=","
                decimals={2}
              />
            </pre>
          </div>
        );
      default:
        return (
          <div className="flex flex-col">
            <progress className="progress progress-primary" value={percent} max={100}></progress>
            <pre className="text-sm">
              <CountUp end={percent} preserveValue={true} separator="," suffix="%" decimals={2} />
            </pre>
          </div>
        );
    }
  };

  const renderActions = (status: StakeStatus) => {
    switch (status) {
      case StakeStatus.ACTIVE:
        return (
          <div className="space-x-1">
            <Link href={`/stake/${props.stakerAddress}/${props.index}/defer`}>
              <button className="btn btn-sm glass text-neutral" disabled={!canDefer}>
                {t("portfolio.defer")}
              </button>
            </Link>
            <Link
              href={`/stake/${props.stakerAddress}/${props.index}/end`}
              className={clsx("btn btn-sm text-neutral", {
                "btn-error": !canDefer,
                glass: canDefer,
              })}
            >
              {t("portfolio.end")}
            </Link>
          </div>
        );
      case StakeStatus.DEFER:
        return (
          <div className="space-x-1">
            <Link
              href={`/stake/${props.stakerAddress}/${props.index}/end`}
              className={clsx("btn btn-sm text-neutral", {
                "btn-error": !canDefer,
                glass: canDefer,
              })}
            >
              {t("portfolio.end")}
            </Link>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  useEffect(() => {
    if (endTime) {
      const elapsedTime = Date.now() / 1000 - startTime;
      const totalTime = endTime - startTime;

      const percentComplete = (elapsedTime / totalTime) * 100;
      console.log(startTime);
      console.log(elapsedTime);

      // const progress = progressDays(endTime ?? 0, stake?.term ?? 0);
      // const percentComplete = (progress / stake?.term ?? 0) * 100;
      // setProgress(elapsedTime / totalTime);
      setPercent(percentComplete);

      setCanDefer(percentComplete > 100.0);
    }
  }, [endTime, stake]);

  if (stake?.status != props?.status) return null;

  return (
    <>
      <td className="bg-transparent text-sm">{formatDate(startTime)}</td>
      <td className="bg-transparent text-sm">{formatDate(endTime)}</td>
      <td className="bg-transparent text-right text-sm">
        <pre>
          <CountUp
            end={Number(ethers.utils.formatUnits(stake?.fenix ?? 0, 18))}
            preserveValue={true}
            separator=","
            decimals={2}
          />
        </pre>
      </td>
      <td className="bg-transparent text-right text-sm">
        <pre>
          <CountUp
            end={Number(ethers.utils.formatUnits(stake?.shares ?? 0, 18))}
            preserveValue={true}
            separator=","
            decimals={2}
          />
        </pre>
      </td>
      <td className="bg-transparent text-center">{renderProgress(stake?.status ?? StakeStatus.END)}</td>
      <td className="bg-transparent text-right">{renderActions(stake?.status ?? StakeStatus.END)}</td>
    </>
  );
};

export default StakeRow;
