import { clsx } from "clsx";
import { BigNumber } from "ethers";
import { useState, useContext } from "react";
import { useTranslation } from "next-i18next";
import { MaxValueField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NumberStatCard } from "~/components/StatCards";
import { Container, CardContainer } from "~/components/containers/";

import FENIXContext from "~/contexts/FENIXContext";
import GasEstimate from "~/components/GasEstimate";

const Mint = () => {
  const { t } = useTranslation("common");

  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { feeData } = useContext(FENIXContext);
  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <div className="flex flex-col space-y-4">
          <h2 className="card-title text-neutral">{t("mint.title")}</h2>

          <MaxValueField
            title={t("form-field.xen").toUpperCase()}
            description={t("form-field.xen-details")}
            decimals={0}
            value={100000}
            disabled={disabled}
          />

          <div className="flex stats glass w-full text-neutral">
            <NumberStatCard title={"FENIX"} value={0} decimals={0} />
          </div>

          <div className="alert shadow-lg glass">
            <div>
              <div>
                <InformationCircleIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold">{t("mint.approve")}</h3>
                <div className="text-xs">{t("mint.approve-details")}</div>
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
              {t("mint.approve")}
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

export default Mint;
