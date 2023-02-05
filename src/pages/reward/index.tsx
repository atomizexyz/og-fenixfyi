import { NextPage } from "next";
import { useState, useContext } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Container, CardContainer } from "~/components/containers/";
import { useTranslation } from "next-i18next";
import FENIXContext from "~/contexts/FENIXContext";
import GasEstimate from "~/components/GasEstimate";
import clsx from "clsx";
import Countdown from "react-countdown";
import { BigNumber, ethers } from "ethers";
import { useRouter } from "next/router";
import { useNetwork, useContractWrite, useWaitForTransaction, usePrepareContractWrite } from "wagmi";
import FENIX_ABI from "~/abi/FENIX_ABI";
import { useForm } from "react-hook-form";
import { fenixContract } from "~/lib/fenix-contract";
import toast from "react-hot-toast";
import { InfoCard, NumberStatCard, CountdownCard } from "~/components/StatCards";

const Bonus: NextPage = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();
  const router = useRouter();

  const { feeData, fenixBalance, cooldownUnlockTs, stakePoolSupply, rewardPoolSupply } = useContext(FENIXContext);
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);

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
    functionName: "flushRewardPool",
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
