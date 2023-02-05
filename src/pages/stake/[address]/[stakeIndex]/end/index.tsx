import { clsx } from "clsx";
import { useState, useContext } from "react";
import { BigNumber, ethers } from "ethers";
import { useTranslation } from "next-i18next";
import { Container, CardContainer } from "~/components/containers/";
import FENIXContext from "~/contexts/FENIXContext";
import GasEstimate from "~/components/GasEstimate";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useRouter } from "next/router";
import { useNetwork, useContractRead, useContractWrite, useWaitForTransaction, usePrepareContractWrite } from "wagmi";
import FENIX_ABI from "~/abi/FENIX_ABI";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fenixContract } from "~/lib/fenix-contract";
import toast from "react-hot-toast";
import { NumberStatCard, StakeStatusCard, ProgressStatCard } from "~/components/StatCards";

const End = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { chain } = useNetwork();

  const { address, stakeIndex } = router.query as unknown as { address: string; stakeIndex: number };

  const { feeData, stakePoolSupply, stakePoolTotalShares } = useContext(FENIXContext);
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { data: stake } = useContractRead({
    ...fenixContract(chain),
    functionName: "stakeFor",
    args: [address, stakeIndex],
    watch: true,
  });

  // Write end stake
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
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
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });

  const {} = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast(t("toast.end-stake-successful"));
    },
  });

  const handleEndSubmit = (data: any) => {
    write?.();
  };

  const startTime = Number(stake?.startTs ?? 0);
  const endTime = startTime + stake?.term * 86400;
  const elapsedTime = Date.now() / 1000 - startTime;
  const totalTime = endTime - startTime;
  const percentComplete = (elapsedTime / totalTime) * 100;
  const shares = Number(ethers.utils.formatUnits(stake?.shares ?? 0, 18));
  const stakeRatio = shares / Number(stakePoolTotalShares);
  const fenixReward = stakeRatio * Number(stakePoolSupply);
  const rewardRatio = Math.pow(elapsedTime / totalTime, 2);

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
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default End;
