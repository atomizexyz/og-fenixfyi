import { clsx } from "clsx";
import { useNetwork, useContractRead, useContractWrite, useWaitForTransaction, usePrepareContractWrite } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { DayPicker } from "react-day-picker";
import { useState, useContext, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { MaxValueField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NumberStatCard, BonusShareCard } from "~/components/StatCards";
import "react-day-picker/dist/style.css";
import { Container, CardContainer } from "~/components/containers/";
import FENIXContext from "~/contexts/FENIXContext";
import GasEstimate from "~/components/GasEstimate";
import { isSameMonth, addDays, differenceInDays } from "date-fns";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FENIX_ABI from "~/abi/FENIX_ABI";
import { fenixContract } from "~/lib/fenix-contract";
import toast from "react-hot-toast";
import { ErrorMessage } from "@hookform/error-message";
import { FENIX_MAX_STAKE_LENGTH } from "~/lib/helpers";
import { shareRatePercent, currentYear, maxEndStakeYear } from "~/lib/helpers";
import { useEffect } from "react";

const Stake = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const maxStakeLengthDay = addDays(today, FENIX_MAX_STAKE_LENGTH);

  const [month, setMonth] = useState<Date>(today);
  const [isLockMonth, setIsLockMonth] = useState<boolean>(true);
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { feeData, fenixBalance, shareRate } = useContext(FENIXContext);

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
    args: [startStakeAmount ?? 0, startStakeDays ?? 0],
    enabled: !disabled,
  });

  const { data: stakeData, write: writeStake } = useContractWrite({
    ...config,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: stakeData?.hash,
    onSuccess(data) {
      toast(t("toast.stake-successful"));
    },
  });
  const handleStartStakeSubmit = (data: any) => {
    writeStake?.();
  };

  const { data: sizeBonus } = useContractRead({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "calculateSizeBonus",
    args: [startStakeAmount ?? 0],
    enabled: !disabled,
  }) as unknown as { data: number };

  const { data: timeBonus } = useContractRead({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "calculateTimeBonus",
    args: [startStakeAmount ?? 0, startStakeDays ?? 0],
    enabled: !disabled,
  }) as unknown as { data: number };

  const { data: bonus } = useContractRead({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "calculateBonus",
    args: [startStakeAmount ?? 0, startStakeDays ?? 0],
    enabled: !disabled,
  }) as unknown as { data: number };

  const shares = () => {
    return (bonus ?? 0) / shareRatePercent(shareRate);
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
    if (isLockMonth && !isSameMonth(selectedFromDay(), month)) {
      setMonth(selectedFromDay());
    }
  }, [selectedFromDay, month, isLockMonth]);

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <form onSubmit={handleSubmit(handleStartStakeSubmit)}>
          <div className="flex flex-col space-y-4">
            <h2 className="card-title text-neutral">Stake</h2>
            <MaxValueField
              title={t("form-field.fenix").toUpperCase()}
              description={t("form-field.fenix-description")}
              decimals={4}
              value={ethers.utils.formatUnits(
                fenixBalance?.value ?? BigNumber.from(0),
                fenixBalance?.decimals ?? BigNumber.from(0)
              )}
              disabled={disabled}
              errorMessage={<ErrorMessage errors={errors} name="startStakeAmount" />}
              register={register("startStakeAmount")}
              setValue={setValue}
            />
            <MaxValueField
              title={t("form-field.days").toUpperCase()}
              description={t("form-field.days-description")}
              decimals={0}
              value={FENIX_MAX_STAKE_LENGTH}
              disabled={disabled}
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
                timeBonus={timeBonus ?? 0}
                sizeBonus={sizeBonus ?? 0}
                subtotal={bonus ?? 0}
                shareRate={shareRatePercent(shareRate)}
                shares={shares()}
              />
              <NumberStatCard title={t("card.shares")} value={shares()} decimals={4} />
            </div>
            <div className="alert shadow-lg glass">
              <div>
                <div>
                  <InformationCircleIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold">{t("stake.start")}</h3>
                  <div className="text-xs">{t("stake.start-details")}</div>
                </div>
              </div>
            </div>
            <div className="form-control w-full">
              <button
                type="submit"
                className={clsx("btn glass text-neutral", {
                  loading: processing,
                })}
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
