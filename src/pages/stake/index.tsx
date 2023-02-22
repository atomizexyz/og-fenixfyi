import "react-day-picker/dist/style.css";

import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { clsx } from "clsx";
import { addDays, differenceInDays, isSameMonth } from "date-fns";
import { BigNumber, ethers } from "ethers";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import * as yup from "yup";

import FENIX_ABI from "~/abi/FENIX_ABI";
import { CardContainer, Container } from "~/components/containers/";
import { MaxValueField } from "~/components/FormFields";
import GasEstimate from "~/components/GasEstimate";
import PortfolioNav from "~/components/nav/PortfolioNav";
import { BonusShareCard, NumberStatCard } from "~/components/StatCards";
import { InfoCard } from "~/components/StatCards";
import FENIXContext from "~/contexts/FENIXContext";
import { fenixContract } from "~/lib/fenix-contract";
import {
  calcSizeBonus,
  calcSubtotalBonus,
  calcTimeBonus,
  currentYear,
  FENIX_MAX_STAKE_LENGTH,
  maxEndStakeYear,
} from "~/lib/helpers";

const Stake = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();
  const router = useRouter();

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const maxStakeLengthDay = addDays(today, FENIX_MAX_STAKE_LENGTH);

  const [month, setMonth] = useState<Date>(today);
  const [isLockMonth, setIsLockMonth] = useState<boolean>(true);
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { feeData, fenixBalance, shareRate } = useContext(FENIXContext);

  const [sizeBonus, setSizeBonus] = useState<number>(0);
  const [timeBonus, setTimeBonus] = useState<number>(0);
  const [subtotalBonus, setSubtotalBonus] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);

  /*** FORM SETUP ***/

  const schema = yup
    .object()
    .shape({
      startStakeAmount: yup
        .number()
        .required(t("form-field.amount-required"))
        .max(
          Number(ethers.utils.formatUnits(fenixBalance?.value ?? BigNumber.from(0))),
          t("form-field.amount-maximum", {
            maximumAmount: fenixBalance?.formatted,
          })
        )
        .positive(t("form-field.amount-positive"))
        .typeError(t("form-field.amount-required")),
      startStakeDays: yup
        .number()
        .required(t("form-field.days-required"))
        .max(FENIX_MAX_STAKE_LENGTH, t("form-field.days-maximum", { numberOfDays: FENIX_MAX_STAKE_LENGTH }))
        .positive(t("form-field.days-positive"))
        .typeError(t("form-field.days-required")),
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
  const { startStakeAmount, startStakeDays } = watch();

  /*** CONTRACT WRITE SETUP ***/

  const { config } = usePrepareContractWrite({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "startStake",
    args: [
      ethers.utils.parseUnits(Number(startStakeAmount ?? 0).toString(), fenixBalance?.decimals),
      startStakeDays ?? 0,
    ],
    enabled: !disabled,
  });

  const { data: stakeData, write: writeStake } = useContractWrite({
    ...config,
    onSuccess(_data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: stakeData?.hash,
    onSuccess(_data) {
      toast(t("toast.stake-successful"));
      router.push("/stake/active");
    },
  });
  const handleStartStakeSubmit = (_data: any) => {
    writeStake?.();
  };

  const footer = (
    <div className="grid grid-flow-col gap-8 items-center">
      <button
        disabled={isSameMonth(today, month)}
        onClick={() => setMonth(addDays(today, 1))}
        className="btn btn-xs glass text-neutral ml-2"
      >
        {t("form-field.go-to-today")}
      </button>
      <label className="label cursor-pointer">
        <span className="label-text text-neutral">{t("form-field.lock-month")}</span>
        <input
          onChange={(event) => setIsLockMonth(event.currentTarget.checked)}
          type="checkbox"
          className="checkbox ml-2"
          checked={isLockMonth}
        />
      </label>
    </div>
  );

  // useCallback hook for memoizing the function
  const selectedFromDay = useCallback(() => {
    return addDays(new Date(), startStakeDays ?? 0);
  }, [startStakeDays]);

  const selectedToDay = (date: any) => {
    setValue("startStakeDays", differenceInDays(date, today) + 1);
  };

  useEffect(() => {
    setTimeBonus(calcTimeBonus(startStakeDays) * 100);
    setSizeBonus(calcSizeBonus(startStakeAmount) * 100);
    setSubtotalBonus(startStakeAmount * calcSubtotalBonus(sizeBonus / 100, timeBonus / 100));
    setShares(subtotalBonus / Number(ethers.utils.formatUnits(shareRate)));

    if (isLockMonth && !isSameMonth(selectedFromDay(), month)) {
      setMonth(selectedFromDay());
    }

    setDisabled(!isValid);
  }, [
    selectedFromDay,
    month,
    isLockMonth,
    startStakeAmount,
    startStakeDays,
    sizeBonus,
    timeBonus,
    subtotalBonus,
    shareRate,
    isValid,
  ]);

  return (
    <Container className="max-w-2xl">
      <PortfolioNav />
      <CardContainer className="rounded-none rounded-r-2xl rounded-bl-2xl">
        <form onSubmit={handleSubmit(handleStartStakeSubmit)}>
          <div className="flex flex-col space-y-4">
            <h2 className="card-title text-neutral">Stake</h2>
            <MaxValueField
              title={t("form-field.fenix").toUpperCase()}
              description={t("form-field.fenix-description")}
              decimals={4}
              value={ethers.utils.formatUnits(fenixBalance?.value ?? BigNumber.from(0))}
              errorMessage={<ErrorMessage errors={errors} name="startStakeAmount" />}
              register={register("startStakeAmount")}
              setValue={setValue}
            />
            <MaxValueField
              title={t("form-field.days").toUpperCase()}
              description={t("form-field.days-description")}
              decimals={0}
              value={FENIX_MAX_STAKE_LENGTH}
              errorMessage={<ErrorMessage errors={errors} name="startStakeDays" />}
              register={register("startStakeDays")}
              setValue={setValue}
            />
            <div className="stats stats-vertical glass w-full text-neutral">
              <div className="flex justify-center">
                <DayPicker
                  mode="single"
                  modifiersClassNames={{
                    selected: "day-selected",
                    outside: "day-outside",
                  }}
                  disabled={[{ before: tomorrow, after: maxStakeLengthDay }]}
                  selected={selectedFromDay()}
                  onSelect={selectedToDay}
                  month={month}
                  onMonthChange={setMonth}
                  footer={footer}
                  fromYear={currentYear()}
                  toYear={maxEndStakeYear()}
                  captionLayout="dropdown"
                  fixedWeeks
                />
              </div>
            </div>

            <div className="stats stats-vertical glass w-full text-neutral">
              <BonusShareCard
                sizeBonus={sizeBonus}
                sizeBonusWeighted={sizeBonus * 0.1}
                timeBonus={timeBonus}
                timeBonusWeighted={timeBonus * 0.9}
                amplifyBonus={sizeBonus * 0.1 + timeBonus * 0.9}
                base={startStakeAmount}
                subtotal={subtotalBonus}
                shareRate={Number(ethers.utils.formatUnits(shareRate))}
                shares={shares}
              />
              <NumberStatCard title={t("card.shares")} value={Number(shares)} decimals={4} />
            </div>

            <InfoCard title={t("stake.start")} description={t("stake.start-details")} />

            <div className="form-control w-full">
              <button
                type="submit"
                className={clsx("btn glass text-neutral", {
                  loading: processing,
                })}
                disabled={disabled}
              >
                {t("stake.start")}
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

export default Stake;
