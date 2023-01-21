import type { NextPage } from "next";
import { Container, CardContainer } from "~/components/containers/";
import { StakeHeaderFooter, StakeRow } from "~/components/stakes";
import PortfolioNav from "~/components/nav/PortfolioNav";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useNetwork, useContractRead, useAccount } from "wagmi";
import { fenixContract } from "~/lib/fenix-contract";
import FENIX_ABI from "~/abi/FENIX_ABI";
import FENIXContext from "~/contexts/FENIXContext";
import { useContext } from "react";

const ActivePortfolio: NextPage = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { data: stakeCount } = useContractRead({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "stakeCount",
    args: [address],
  }) as unknown as { data: number };

  const { poolSupply } = useContext(FENIXContext);

  return (
    <Container className="max-w-5xl">
      <PortfolioNav />
      <CardContainer className="rounded-none rounded-r-2xl rounded-bl-2xl">
        <div className="space-y-4 w-full">
          <h2 className="card-title">{t("portfolio.active-stakes")}</h2>

          <div className="overflow-x-auto">
            <table className="table table-compact table-zebra w-full">
              <thead>
                <StakeHeaderFooter />
              </thead>
              <tbody>
                {Array.from(Array(Number(stakeCount ?? 0)).keys()).map((_stake: any) => (
                  <tr key={_stake}>
                    <StakeRow
                      contractAddressOrName={fenixContract(chain).addressOrName}
                      stakerAddress={address}
                      index={_stake}
                    />
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <StakeHeaderFooter />
              </tfoot>
            </table>
          </div>
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

export default ActivePortfolio;
