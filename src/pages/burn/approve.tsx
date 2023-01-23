import { clsx } from "clsx";
import Link from "next/link";
import { NextPage } from "next";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "next-i18next";
import { MaxValueField } from "~/components/FormFields";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Container, CardContainer } from "~/components/containers/";
import FENIXContext from "~/contexts/FENIXContext";
import GasEstimate from "~/components/GasEstimate";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { useNetwork, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { xenContract } from "~/lib/xen-contract";
import XENCryptoABI from "~/abi/XENCryptoABI";
import { fenixContract } from "~/lib/fenix-contract";
import { InfoCard } from "~/components/StatCards";

const Approve: NextPage = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { feeData, xenBalance, allowance } = useContext(FENIXContext);

  const schema = yup
    .object()
    .shape({
      burnXENAmount: yup
        .number()
        .required(t("form-field.amount-required"))
        .max(
          Number(ethers.utils.formatUnits(xenBalance?.value ?? BigNumber.from(0))),
          t("form-field.amount-maximum", {
            maximumAmount: xenBalance?.formatted,
          })
        )
        .positive(t("form-field.amount-positive"))
        .typeError(t("form-field.amount-required")),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { burnXENAmount } = watch() as { burnXENAmount: number };

  const { config: fixedConfig, error: fixedError } = usePrepareContractWrite({
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
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: fixedApproveData?.hash,
    onSuccess(data) {
      toast(t("toast.spend-approved"));
      router.push("/burn/xen");
    },
  });
  const onFixedSubmit = () => {
    fixedWrite?.();
  };

  /*** CONTRACT APPROVE UNLIMITED ***/

  const { handleSubmit: handleUnlimitedSubmit } = useForm();

  const { config: unlimitedConfig, error: unlimitedError } = usePrepareContractWrite({
    addressOrName: xenContract(chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "approve",
    args: [fenixContract(chain).addressOrName, ethers.constants.MaxUint256],
    enabled: !disabled,
  });
  const { data: unlimitedApproveData, write: unlimitedWrite } = useContractWrite({
    ...unlimitedConfig,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: unlimitedApproveData?.hash,
    onSuccess(data) {
      toast(t("toast.spend-approved"));
      router.push("/burn/xen");
    },
  });
  const onUnlimitedSubmit = () => {
    unlimitedWrite?.();
  };

  useEffect(() => {
    setDisabled(false);
  }, []);

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
              <h2 className="card-title text-neutral">{t("burn.approve-fixed")}</h2>

              <MaxValueField
                title={t("form-field.xen").toUpperCase()}
                description={t("form-field.xen-description")}
                decimals={0}
                value={ethers.utils.formatUnits(
                  xenBalance?.value ?? BigNumber.from(0),
                  xenBalance?.decimals ?? BigNumber.from(0)
                )}
                disabled={disabled}
                errorMessage={<ErrorMessage errors={errors} name="burnXENAmount" />}
                register={register("burnXENAmount")}
                setValue={setValue}
              />

              <InfoCard title={t("burn.approve-fixed")} description={t("burn.approve-details")} />

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

              <InfoCard title={t("burn.approve-unlimited")} description={t("burn.approve-details")} />

              <div className="form-control w-full">
                <button
                  type="submit"
                  className={clsx("btn glass text-neutral", {
                    loading: processing,
                  })}
                  disabled={disabled}
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
