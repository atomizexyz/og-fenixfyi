import { clsx } from "clsx";
import { BigNumber } from "ethers";
import { useState, useContext } from "react";
import { MaxValueField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NumberStatCard } from "~/components/StatCards";

import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import FENIXContext from "~/contexts/FENIXContext";
import GasEstimate from "~/components/GasEstimate";

const Mint = () => {
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { feeData } = useContext(FENIXContext);
  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <div className="flex flex-col space-y-4">
          <h2 className="card-title text-neutral">Mint</h2>

          <MaxValueField
            title={"Burn".toUpperCase()}
            description={"XEN to burn"}
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
                <h3 className="font-bold">{"Approve"}</h3>
                <div className="text-xs">
                  {"In order to burn your XEN, you need to give the FENIX contract permission."}
                </div>
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
              Approve
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
