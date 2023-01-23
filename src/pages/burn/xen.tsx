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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { useNetwork, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { fenixContract } from "~/lib/fenix-contract";
import FENIX_ABI from "~/abi/FENIX_ABI";
import { NumberStatCard } from "~/components/StatCards";

const Burn: NextPage = () => {
  const { t } = useTranslation("common");

  const { chain } = useNetwork();

  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
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

  const { config, error } = usePrepareContractWrite({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "burnXEN",
    args: [ethers.utils.parseUnits((burnXENAmount || 0).toString(), fenixBalance?.decimals ?? 0)],
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
      toast(t("toast.spend-approved"));
    },
  });
  const onBurnSubmit = () => {
    write?.();
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
                value={ethers.utils.formatUnits(
                  xenBalance?.value ?? BigNumber.from(0),
                  xenBalance?.decimals ?? BigNumber.from(0)
                )}
                disabled={disabled}
                errorMessage={<ErrorMessage errors={errors} name="burnXENAmount" />}
                register={register("burnXENAmount")}
                setValue={setValue}
              />

              <div className="flex stats glass w-full text-neutral">
                <NumberStatCard
                  title={t("card.new")}
                  value={burnXENAmount / 10_000}
                  decimals={4}
                  description={"FENIX"}
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
                  description={"FENIX"}
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
