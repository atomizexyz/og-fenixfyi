import { clsx } from "clsx";
import { useState, useContext } from "react";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { Container, CardContainer } from "~/components/containers/";
import FENIXContext from "~/contexts/FENIXContext";
import GasEstimate from "~/components/GasEstimate";

const Defer = () => {
  const { t } = useTranslation("common");

  const { feeData } = useContext(FENIXContext);
  const [processing, setProcessing] = useState(false);

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <div className="flex flex-col space-y-4">
          <h2 className="card-title text-neutral">Defer</h2>

          <div className="form-control w-full">
            <button
              type="submit"
              className={clsx("btn glass text-neutral", {
                loading: processing,
              })}
            >
              {t("stake.defer")}
            </button>
          </div>

          <GasEstimate feeData={feeData} gasLimit={BigNumber.from(100)} />
        </div>
      </CardContainer>
    </Container>
  );
};

export default Defer;
