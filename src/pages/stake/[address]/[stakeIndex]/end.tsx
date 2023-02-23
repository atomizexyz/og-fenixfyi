import { clsx } from "clsx";
import { ethers } from "ethers";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import FENIX_ABI from "~/abi/FENIX_ABI";
import { CardContainer, Container } from "~/components/containers/";
import GasEstimate from "~/components/GasEstimate";
import { DataCard, NumberStatCard, ProgressStatCard, StakeStatusCard } from "~/components/StatCards";
import FENIXContext from "~/contexts/FENIXContext";
import { fenixContract } from "~/lib/fenix-contract";
import { truncatedAddress } from "~/lib/helpers";

const End: NextPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { chain } = useNetwork();
  const { address: acocuntAddress } = useAccount();

  const { address, stakeIndex } = router.query as unknown as { address: string; stakeIndex: number };

  const { feeData, stakePoolSupply } = useContext(FENIXContext);
  const [stake, setStake] = useState<any>(null);

  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);

  const { data: stakeData } = useContractRead({
    ...fenixContract(chain),
    functionName: "stakeFor",
    args: [address, stakeIndex],
    watch: true,
  });

  // Write end stake
  const {
    handleSubmit,
    formState: {},
  } = useForm({
    mode: "onChange",
  });

  const { config } = usePrepareContractWrite({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "endStake",
    args: [stakeIndex],
    enabled: !disabled,
  });

  const { data, write } = useContractWrite({
    ...config,
    onSuccess(_data) {
      setProcessing(true);
      setDisabled(true);
    },
  });

  const {} = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(_data) {
      toast(t("toast.end-stake-successful"));
    },
  });

  const handleEndSubmit = (_data: any) => {
    write?.();
  };

  const startTime = Number(stake?.startTs ?? 0);
  const endTime = startTime + stake?.term * 86400;
  const elapsedTime = Date.now() / 1000 - startTime;
  const totalTime = endTime - startTime;
  const percentComplete = (elapsedTime / totalTime) * 100;
  const shares = Number(ethers.utils.formatUnits(stake?.shares ?? 0));
  const stakeRatio = shares / Number(ethers.utils.formatUnits(stakePoolSupply));
  const fenixReward = stakeRatio * Number(ethers.utils.formatUnits(stakePoolSupply));
  const rewardRatio = Math.pow(elapsedTime / totalTime, 2);

  useEffect(() => {
    if (address == acocuntAddress) {
      setDisabled(false);
    }
    if (stakeData) {
      setStake(stakeData);
    }
  }, [acocuntAddress, address, stake, stakeData]);

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <form onSubmit={handleSubmit(handleEndSubmit)}>
          <div className="flex flex-col space-y-4">
            <h2 className="card-title text-neutral">End</h2>
            <DataCard title={t("stake.address")} value={truncatedAddress(address)} description={address} />
            <DataCard title={t("stake.index")} value={String(stakeIndex)} />
            <ProgressStatCard
              title={t("stake.progress")}
              percentComplete={percentComplete}
              value={elapsedTime}
              max={totalTime}
              daysRemaining={endTime - elapsedTime}
              dateTs={endTime}
            />
            <StakeStatusCard status={stake?.status} />
            <NumberStatCard title={t("stake.shares")} value={shares} />

            <NumberStatCard title={t("stake.reward")} value={fenixReward * rewardRatio} description="FENIX" />
            <NumberStatCard title={t("stake.penalty")} value={fenixReward * (1 - rewardRatio)} description="FENIX" />

            <div className="form-control w-full">
              <button
                type="submit"
                className={clsx("btn glass text-neutral", {
                  loading: processing,
                })}
              >
                {t("stake.end")}
              </button>
            </div>

            <GasEstimate feeData={feeData} gasLimit={config?.request?.gasLimit} />
          </div>
        </form>
      </CardContainer>
    </Container>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"], null, ["en"])),
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default End;
