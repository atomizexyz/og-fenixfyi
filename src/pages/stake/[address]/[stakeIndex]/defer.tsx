import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { clsx } from "clsx";
import { BigNumber, ethers } from "ethers";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Address,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as yup from "yup";

import FENIX_ABI from "~/abi/FENIX_ABI";
import { CardContainer, Container } from "~/components/containers/";
import { WalletAddressField } from "~/components/FormFields";
import GasEstimate from "~/components/GasEstimate";
import { DataCard, NumberStatCard } from "~/components/StatCards";
import FENIXContext from "~/contexts/FENIXContext";
import { fenixContract } from "~/lib/fenix-contract";
import { WALLET_ADDRESS_REGEX } from "~/lib/helpers";
import { truncatedAddress } from "~/lib/helpers";

const Defer: NextPage = ({ address, stakeIndex }: any) => {
  const { t } = useTranslation("common");

  const { chain } = useNetwork();

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

  // Write defer stake

  const schema = yup
    .object()
    .shape({
      deferAddress: yup
        .string()
        .required(`${t("form-field.wallet-address-required")}`)
        .matches(WALLET_ADDRESS_REGEX, {
          message: t("form-field.wallet-address-invalid"),
          excludeEmptyString: true,
        }),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { deferAddress } = watch();

  const { config } = usePrepareContractWrite({
    address: fenixContract(chain).address,
    abi: FENIX_ABI,
    functionName: "deferStake",
    args: [stakeIndex, deferAddress],
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
      toast(t("toast.defer-stake-successful"));
    },
  });

  const handleDeferSubmit = (_data: any) => {
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
    setDisabled(percentComplete < 100);
    if (stakeData) {
      setStake(stakeData);
    }
  }, [address, percentComplete, setValue, stakeData]);

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <form onSubmit={handleSubmit(handleDeferSubmit)}>
          <div className="flex flex-col space-y-4">
            <h2 className="card-title text-neutral">Defer</h2>
            <DataCard title={t("stake.address")} value={truncatedAddress(address)} description={address} />
            <DataCard title={t("stake.index")} value={String(stakeIndex)} />
            <NumberStatCard title={t("stake.shares")} value={shares} />
            <NumberStatCard title={t("stake.reward")} value={fenixReward * rewardRatio} description="FENIX" />
            <NumberStatCard title={t("stake.penalty")} value={fenixReward * (1 - rewardRatio)} description="FENIX" />
            <WalletAddressField
              disabled={disabled}
              errorMessage={<ErrorMessage errors={errors} name="deferAddress" />}
              register={register("deferAddress")}
            />

            <div className="form-control w-full">
              <button
                type="submit"
                className={clsx("btn glass text-neutral", {
                  loading: processing,
                })}
                disabled={disabled}
              >
                {t("stake.defer")}
              </button>
            </div>

            <GasEstimate feeData={feeData} gasLimit={config?.request?.gasLimit} />
          </div>
        </form>
      </CardContainer>
    </Container>
  );
};

export async function getStaticProps({ locale, params }: any) {
  const { address, stakeIndex } = params;

  return {
    props: {
      address: address as Address,
      stakeIndex: stakeIndex as BigNumber,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default Defer;
