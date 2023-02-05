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

import FENIX_ABI from "~/abi/FENIX_ABI";
import { CardContainer, Container } from "~/components/containers/";
import { MaxValueField } from "~/components/FormFields";
import GasEstimate from "~/components/GasEstimate";
import { NumberStatCard } from "~/components/StatCards";
import FENIXContext from "~/contexts/FENIXContext";
import { fenixContract } from "~/lib/fenix-contract";

const Burn: NextPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const { chain } = useNetwork();

  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [burnMaximum, setBurnMaximum] = useState<string>("0");
  const { feeData, xenBalance, fenixBalance, allowance } = useContext(FENIXContext);

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

  const { config } = usePrepareContractWrite({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "burnXEN",
    args: [ethers.utils.parseUnits((burnXENAmount || 0).toString(), fenixBalance?.decimals ?? 0)],
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
      toast(t("toast.xen-burned"));
      router.push("/stake");
    },
  });
  const onBurnSubmit = () => {
    write?.();
  };

  useEffect(() => {
    if (xenBalance?.value.gt(allowance)) {
      setBurnMaximum(allowance);
    } else {
      setBurnMaximum(xenBalance?.value?.toString() ?? "0");
    }
    setDisabled(!isValid);
  }, [allowance, burnMaximum, isValid, xenBalance?.value]);

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

          <Link href="/burn/xen" className="step step-neutral">
            {t("burn.title")}
          </Link>
        </ul>

        <CardContainer>
          <form onSubmit={handleSubmit(onBurnSubmit)}>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">{t("burn.title")}</h2>
              <MaxValueField
                title={t("form-field.xen").toUpperCase()}
                description={t("form-field.xen-description")}
                decimals={0}
                value={ethers.utils.formatUnits(burnMaximum, xenBalance?.decimals ?? BigNumber.from(0))}
                errorMessage={<ErrorMessage errors={errors} name="burnXENAmount" />}
                register={register("burnXENAmount")}
                setValue={setValue}
              />

              <div className="flex stats glass w-full text-neutral">
                <NumberStatCard
                  title={t("card.new")}
                  value={burnXENAmount / 10_000}
                  decimals={4}
                  description={t("token.fenix")}
                />
                <NumberStatCard
                  title={t("card.liquid")}
                  value={Number(
                    ethers.utils.formatUnits(
                      fenixBalance?.value ?? BigNumber.from(0),
                      fenixBalance?.decimals ?? BigNumber.from(0)
                    )
                  )}
                  decimals={4}
                  description={t("token.fenix")}
                />
              </div>

              <div className="form-control w-full">
                <button
                  type="submit"
                  className={clsx("btn glass text-neutral", {
                    loading: processing,
                  })}
                  disabled={disabled}
                >
                  {t("burn.title")}
                </button>
              </div>

              <GasEstimate feeData={feeData} gasLimit={config?.request?.gasLimit} />
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

export default Burn;
