import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect, useState } from "react";
import { Address, useAccount, useContractRead, useNetwork } from "wagmi";

import FENIX_ABI from "~/abi/FENIX_ABI";
import { CardContainer, Container } from "~/components/containers/";
import PortfolioNav from "~/components/nav/PortfolioNav";
import { StakeHeaderFooter, StakeRow, StakeStatus } from "~/components/stakes";
import FENIXContext from "~/contexts/FENIXContext";
import { fenixContract } from "~/lib/fenix-contract";

const ActivePortfolio: NextPage = () => {
  const { t } = useTranslation("common");
  const { equityPoolSupply, equityPoolTotalShares } = useContext(FENIXContext);

  const { chain } = useNetwork();
  const { address } = useAccount() as unknown as { address: Address };
  const [stakeCount, setStakeCount] = useState(0);

  const { data } = useContractRead({
    address: fenixContract(chain).address,
    abi: FENIX_ABI,
    functionName: "stakeCount",
    args: [address],
  }) as unknown as { data: number };

  useEffect(() => {
    if (data) {
      setStakeCount(data);
    }
  }, [data]);

  return (
    <Container className="max-w-5xl">
      <PortfolioNav />
      <CardContainer>
        <div className="space-y-4 w-full">
          <h2 className="card-title">{t("stake.active-stakes")}</h2>

          <div className="overflow-x-auto">
            <table className="table table-compact table-zebra w-full">
              <thead>
                <StakeHeaderFooter status={StakeStatus.ACTIVE} />
              </thead>
              <tbody>
                {Array.from(Array(Number(stakeCount ?? 0)).keys()).map((_stake: any) => (
                  <tr key={_stake}>
                    <StakeRow
                      contractAddress={fenixContract(chain).address}
                      stakerAddress={address}
                      index={_stake}
                      status={StakeStatus.ACTIVE}
                      equityPoolSupply={equityPoolSupply}
                      equityPoolTotalShares={equityPoolTotalShares}
                    />
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <StakeHeaderFooter status={StakeStatus.ACTIVE} />
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
