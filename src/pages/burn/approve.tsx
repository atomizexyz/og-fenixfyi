import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { clsx } from "clsx";
import { BigNumber, ethers } from "ethers";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import * as yup from "yup";

import XENCryptoABI from "~/abi/XENCryptoABI";
import { CardContainer, Container } from "~/components/containers/";
import { MaxValueField } from "~/components/FormFields";
import GasEstimate from "~/components/GasEstimate";
import { DataCard, InfoCard, NumberStatCard } from "~/components/StatCards";
import FENIXContext from "~/contexts/FENIXContext";
import { fenixContract } from "~/lib/fenix-contract";
import { xenContract } from "~/lib/xen-contract";

const Approve: NextPage = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();
  const router = useRouter();

  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { feeData, xenBalance, allowance } = useContext(FENIXContext);

  const schema = yup
    .object()
    .shape({
      burnXENAmount: yup
        .number()
        .required(`${t("form-field.amount-required")}`)
        .max(
          Number(ethers.utils.formatUnits(xenBalance?.value ?? BigNumber.from(0))),
          `${t("form-field.amount-maximum", {
            maximumAmount: xenBalance?.formatted,
          })}`
        )
        .positive(`${t("form-field.amount-positive")}`)
        .typeError(`${t("form-field.amount-required")}`),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const { burnXENAmount } = watch() as { burnXENAmount: number };

  const { config: fixedConfig } = usePrepareContractWrite({
    addressOrName: xenContract(chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "approve",
    args: [
      fenixContract(chain).addressOrName,
      ethers.utils.parseUnits((burnXENAmount || 0).toString(), xenBalance?.decimals ?? 0),
    ],
    enabled: !disabled,
  });
  const { data: fixedApproveData, write: fixedWrite } = useContractWrite({
    ...fixedConfig,
    onSuccess(_data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: fixedApproveData?.hash,
    onSuccess(_data) {
      toast(t("toast.spend-approved"));
      router.push("/burn/xen");
    },
  });
  const onFixedSubmit = () => {
    fixedWrite?.();
  };

  /*** CONTRACT APPROVE UNLIMITED ***/

  const { handleSubmit: handleUnlimitedSubmit } = useForm();

  const { config: unlimitedConfig } = usePrepareContractWrite({
    addressOrName: xenContract(chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "approve",
    args: [fenixContract(chain).addressOrName, ethers.constants.MaxUint256],
  });
  const { data: unlimitedApproveData, write: unlimitedWrite } = useContractWrite({
    ...unlimitedConfig,
    onSuccess(_data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: unlimitedApproveData?.hash,
    onSuccess(_data) {
      toast(t("toast.spend-approved"));
      router.push("/burn/xen");
    },
  });
  const onUnlimitedSubmit = () => {
    unlimitedWrite?.();
  };

  useEffect(() => {
    setDisabled(!isValid);
  }, [isValid]);

  return (
    <Container className="max-w-2xl">
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/burn/get" className="step step-neutral">
            {t("burn.get")}
          </Link>

          <Link href="/burn/approve" className="step step-neutral">
            {t("burn.approve")}
          </Link>

          <Link href="/burn/xen" className="step">
            {t("burn.title")}
          </Link>
        </ul>
        <CardContainer>
          <form onSubmit={handleSubmit(onFixedSubmit)}>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">{t("burn.approve-limited")}</h2>

              <MaxValueField
                title={t("form-field.xen").toUpperCase()}
                description={t("form-field.xen-description")}
                decimals={0}
                value={ethers.utils.formatUnits(xenBalance?.value ?? BigNumber.from(0))}
                errorMessage={<ErrorMessage errors={errors} name="burnXENAmount" />}
                register={register("burnXENAmount")}
                setValue={setValue}
              />

              <div className="flex stats glass w-full text-neutral">
                {allowance.eq(ethers.constants.MaxUint256) ? (
                  <DataCard
                    title={t("card.spend-allowance")}
                    value={t("burn.unlimited")}
                    description={`${t("token.xen")}`}
                  />
                ) : (
                  <NumberStatCard
                    title={t("card.spend-allowance")}
                    value={Number(ethers.utils.formatUnits(allowance))}
                    decimals={0}
                    description={`${t("token.xen")}`}
                  />
                )}
              </div>

              <InfoCard title={t("burn.approve-limited")} description={t("burn.approve-limited-details")} />

              <div className="form-control w-full">
                <button
                  type="submit"
                  className={clsx("btn glass text-neutral", {
                    loading: processing,
                  })}
                  disabled={disabled}
                >
                  {t("burn.approve-number", { tokenAmount: burnXENAmount })}
                </button>
              </div>

              <GasEstimate feeData={feeData} gasLimit={fixedConfig?.request?.gasLimit} />
            </div>
          </form>
        </CardContainer>

        {/* OR */}
        <div className="divider">{t("or").toUpperCase()}</div>
        {/* OR */}
        <CardContainer>
          <form onSubmit={handleUnlimitedSubmit(onUnlimitedSubmit)}>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">{t("burn.approve-unlimited")}</h2>

              <InfoCard title={t("burn.approve-unlimited")} description={t("burn.approve-unlimited-details")} />

              <div className="form-control w-full">
                <button
                  type="submit"
                  className={clsx("btn glass text-neutral", {
                    loading: processing,
                  })}
                >
                  {t("burn.approve-unlimited")}
                </button>
              </div>

              <GasEstimate feeData={feeData} gasLimit={unlimitedConfig?.request?.gasLimit} />
            </div>
          </form>
        </CardContainer>
      </div>
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

export default Approve;
