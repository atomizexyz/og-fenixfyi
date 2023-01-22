import { NextPage } from "next";
import { useState, useContext } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Container, CardContainer } from "~/components/containers/";
import { useTranslation } from "next-i18next";
import FENIXContext from "~/contexts/FENIXContext";
import GasEstimate from "~/components/GasEstimate";
import clsx from "clsx";

import { useRouter } from "next/router";
import { useNetwork, useContractRead, useContractWrite, useWaitForTransaction, usePrepareContractWrite } from "wagmi";
import FENIX_ABI from "~/abi/FENIX_ABI";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fenixContract } from "~/lib/fenix-contract";
import toast from "react-hot-toast";
import { InfoCard } from "~/components/StatCards";

const Bonus: NextPage = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();
  const router = useRouter();

  const { feeData } = useContext(FENIXContext);
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
    functionName: "bonus",
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
            <h2 className="card-title text-neutral">{t("bonus.title")}</h2>

            <InfoCard title={t("bonus.claim")} description={t("bonus.claim-details")} />

            <div className="form-control w-full">
              <button
                type="submit"
                className={clsx("btn glass text-neutral", {
                  loading: processing,
                })}
              >
                {t("bonus.claim")}
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