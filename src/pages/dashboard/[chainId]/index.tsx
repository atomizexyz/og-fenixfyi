import type { NextPage } from "next";
import Container from "~/components/containers/Container";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useToken } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { ChainStatCard, DateStatCard, NumberStatCard, DataCard } from "~/components/StatCards";
import CardContainer from "~/components/containers/CardContainer";
import { fenixContract } from "~/lib/fenix-contract";
import { chainIcons } from "~/components/Constants";
import Link from "next/link";
import FENIXContext from "~/contexts/FENIXContext";
import { useTranslation } from "next-i18next";
import { chainList } from "~/lib/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEnvironmentChains } from "~/hooks/useEnvironmentChains";
import { shareRatePercent } from "~/lib/helpers";

const ChainDashbaord: NextPage = () => {
  const { t } = useTranslation("common");
  const { envChains } = useEnvironmentChains();

  const router = useRouter();
  const { chainId } = router.query as unknown as { chainId: number };
  const chainFromId = envChains.find((c) => c && c.id == chainId);

  const { data: token } = useToken({
    address: fenixContract(chainFromId).addressOrName,
    chainId: chainFromId?.id,
  });
  const { setChainOverride, startTs, shareRate, poolSupply } = useContext(FENIXContext);

  const stakeItems = [
    {
      title: t("dashboard.pool-supply"),
      value: Number(ethers.utils.formatUnits(poolSupply ?? 0, 18)),
      decimals: 0,
    },
    {
      title: t("dashboard.share-rate"),
      value: shareRatePercent(shareRate),
      decimals: 4,
      suffix: "%",
    },
  ];

  useEffect(() => {
    if (chainFromId) {
      setChainOverride(chainFromId);
    }
  }, [chainFromId, setChainOverride]);

  return (
    <div>
      <Container className="max-w-2xl">
        <div className="flex flex-col space-y-8">
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn m-1 glass text-neutral">
              {t("dashboard.select-chain")}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow rounded-box glass w-64 flex space-y-2">
              {envChains.map((c) => (
                <li key={c.id}>
                  <Link href={`/dashboard/${c.id}`}>
                    <a className="text-neutral justify-between glass">
                      {c.name}
                      {chainIcons[c.id]}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <CardContainer>
            <h2 className="card-title">{t("dashboard.general-stats")}</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              <ChainStatCard value={chainFromId?.name ?? "Ethereum"} id={chainFromId?.id ?? 1} />
              <DateStatCard title={t("card.days-since-launch")} dateTs={startTs} isPast={true} />
              {token && (
                <DataCard
                  title={t("dashboard.token-address")}
                  value={token?.symbol ?? "FENIX"}
                  description={fenixContract(chainFromId).addressOrName}
                />
              )}

              {stakeItems.map((item, index) => (
                <NumberStatCard key={index} title={item.title} value={item.value} decimals={0} suffix={item.suffix} />
              ))}
            </div>
          </CardContainer>
        </div>
      </Container>
    </div>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export const getStaticPaths = async ({ locales }: any) => {
  // generate locales paths for all chains and all locales
  const allPaths = chainList.flatMap((chain) =>
    locales.map((locale: string) => ({
      params: { chainId: chain.id.toString() },
      locale,
    }))
  );

  return {
    paths: allPaths,
    fallback: false,
  };
};

export default ChainDashbaord;
