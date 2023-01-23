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

export const StakeRow: NextPage<any> = (props) => {
  const { t } = useTranslation("common");
  const [progress, setProgress] = useState(0);
  const [percent, setPercent] = useState(0);
  const [canDefer, setCanDefer] = useState<boolean>(false);

  const { data: stake } = useContractRead({
    addressOrName: props.contractAddressOrName,
    contractInterface: FENIX_ABI,
    functionName: "stakeFor",
    args: [props.stakerAddress, props.index],
    watch: true,
  });

  const startTime = Number(stake?.startTs ?? 0);
  const endTime = startTime + stake?.term * 86400;

  useEffect(() => {
    if (endTime) {
      const progress = progressDays(endTime ?? 0, stake?.term ?? 0);
      const percentComplete = (progress / stake?.term ?? 0) * 100;
      setProgress(progress);
      setPercent(percentComplete);
      setCanDefer(percentComplete > 100.0);
    }
  }, [endTime, stake]);

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
      <td className="bg-transparent text-center">
        <div className="flex flex-col">
          <progress className="progress progress-primary" value={progress} max={stake?.term}></progress>
          <pre className="text-sm">
            <CountUp end={percent} preserveValue={true} separator="," suffix="%" decimals={2} />
          </pre>
        </div>
      </td>
      <td className="bg-transparent text-right">
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
      </td>
    </>
  );
};

export default StakeRow;
