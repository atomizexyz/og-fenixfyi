import { clsx } from "clsx";
import { useState, useContext } from "react";
import { BigNumber } from "ethers";
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

const End = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();
  const router = useRouter();
  const { stakeId } = router.query as unknown as { stakeId: number };

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
    functionName: "endStake",
    args: [stakeId],
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
            <h2 className="card-title text-neutral">End</h2>

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

export default End;
