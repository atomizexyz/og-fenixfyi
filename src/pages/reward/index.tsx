import clsx from "clsx";
import { BigNumber, ethers } from "ethers";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useState } from "react";
import Countdown from "react-countdown";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import FENIX_ABI from "~/abi/FENIX_ABI";
import { CardContainer, Container } from "~/components/containers/";
import GasEstimate from "~/components/GasEstimate";
import { CountdownCard, InfoCard, NumberStatCard } from "~/components/StatCards";
import FENIXContext from "~/contexts/FENIXContext";
import { fenixContract } from "~/lib/fenix-contract";

const Bonus: NextPage = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();

  const { feeData, fenixBalance, cooldownUnlockTs, stakePoolSupply, rewardPoolSupply } = useContext(FENIXContext);
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);

  const {
    handleSubmit,
    formState: {},
  } = useForm({
    mode: "onChange",
  });

  const { config } = usePrepareContractWrite({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "flushRewardPool",
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

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <form onSubmit={handleSubmit(handleEndSubmit)}>
          <div className="flex flex-col space-y-4">
            <h2 className="card-title text-neutral">{t("reward.title")}</h2>

            <Countdown
              date={new Date(cooldownUnlockTs * 1000)}
              renderer={(props) => (
                <CountdownCard days={props.days} hours={props.hours} minutes={props.minutes} seconds={props.seconds} />
              )}
            />
            <div className="flex stats glass w-full text-neutral">
              <NumberStatCard
                title={t("card.reward-pool-supply")}
                value={Number(
                  ethers.utils.formatUnits(rewardPoolSupply ?? "0", fenixBalance?.decimals ?? BigNumber.from(0))
                )}
                decimals={0}
                description={t("token.fenix")}
              />
              <NumberStatCard
                title={t("card.stake-pool-supply")}
                value={Number(
                  ethers.utils.formatUnits(stakePoolSupply ?? "0", fenixBalance?.decimals ?? BigNumber.from(0))
                )}
                decimals={0}
                description={t("token.fenix")}
              />
            </div>
            <InfoCard title={t("reward.claim")} description={t("reward.claim-details")} />
            <div className="form-control w-full">
              <button
                type="submit"
                className={clsx("btn glass text-neutral", {
                  loading: processing,
                })}
              >
                {t("reward.claim")}
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

export default Bonus;
