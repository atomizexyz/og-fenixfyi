import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Address, useAccount, useContractRead, useNetwork } from "wagmi";

import FENIX_ABI from "~/abi/FENIX_ABI";
import { CardContainer, Container } from "~/components/containers/";
import PortfolioNav from "~/components/nav/PortfolioNav";
import { StakeHeaderFooter, StakeRow, StakeStatus } from "~/components/stakes";
import { fenixContract } from "~/lib/fenix-contract";

const EndPortfolio: NextPage = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();
  const { address } = useAccount() as unknown as { address: Address };

  const { data: stakeCount } = useContractRead({
    address: fenixContract(chain).address,
    abi: FENIX_ABI,
    functionName: "stakeCount",
    args: [address],
  }) as unknown as { data: number };

  return (
    <Container className="max-w-5xl">
      <PortfolioNav />
      <CardContainer>
        <div className="space-y-4 w-full">
          <h2 className="card-title">{t("stake.ended-stakes")}</h2>

          <div className="overflow-x-auto">
            <table className="table table-compact table-zebra w-full">
              <thead>
                <StakeHeaderFooter status={StakeStatus.END} />
              </thead>
              <tbody>
                {Array.from(Array(Number(stakeCount ?? 0)).keys()).map((_stake: any) => (
                  <tr key={_stake}>
                    <StakeRow
                      contractAddress={fenixContract(chain).address}
                      stakerAddress={address}
                      index={_stake}
                      status={StakeStatus.END}
                    />
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <StakeHeaderFooter status={StakeStatus.END} />
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

export default EndPortfolio;
