import { clsx } from "clsx";
import { BigNumber } from "ethers";
import { DayPicker } from "react-day-picker";
import { useState, useContext } from "react";
import { useTranslation } from "next-i18next";
import { MaxValueField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NumberStatCard, BonusShareCard } from "~/components/StatCards";
import "react-day-picker/dist/style.css";
import { Container, CardContainer } from "~/components/containers/";
import FENIXContext from "~/contexts/FENIXContext";
import GasEstimate from "~/components/GasEstimate";
import { addMonths, isSameMonth } from "date-fns";

const Stake = () => {
  const { t } = useTranslation("common");

  const today = new Date();
  const nextMonth = addMonths(new Date(), 1);
  const [month, setMonth] = useState<Date>(nextMonth);
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { feeData } = useContext(FENIXContext);

  const [selected, setSelected] = useState<Date>();

  const footer = (
    <button
      disabled={isSameMonth(today, month)}
      onClick={() => setMonth(today)}
      className="btn btn-xs glass text-neutral ml-2"
    >
      Go to Today
    </button>
  );

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <div className="flex flex-col space-y-4">
          <h2 className="card-title text-neutral">Stake</h2>

          <MaxValueField
            title={t("form-field.fenix").toUpperCase()}
            description={t("form-field.fenix-description")}
            decimals={0}
            value={1}
            disabled={disabled}
          />

          <MaxValueField
            title={t("form-field.days").toUpperCase()}
            description={t("form-field.days-description")}
            decimals={0}
            value={18250}
            disabled={disabled}
          />

          <div className="stats stats-vertical glass w-full text-neutral">
            <div className="flex justify-center">
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
                month={month}
                onMonthChange={setMonth}
                footer={footer}
                fixedWeeks
              />
            </div>
          </div>

          <div className="stats stats-vertical glass w-full text-neutral">
            <BonusShareCard timeBonus={0} sizeBonus={0} subtotal={0} shareRate={0} shares={0} />
            <NumberStatCard title={t("card.shares")} value={0} decimals={0} />
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

          <GasEstimate feeData={feeData} gasLimit={BigNumber.from(100)} />
        </div>
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
