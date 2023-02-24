import { ethers } from "ethers";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect, useState } from "react";
import { useToken } from "wagmi";

import { chainIcons } from "~/components/Constants";
import CardContainer from "~/components/containers/CardContainer";
import Container from "~/components/containers/Container";
import { ChainStatCard, DataCard, DateStatCard, NumberStatCard } from "~/components/StatCards";
import { Token } from "~/contexts/FENIXContext";
import FENIXContext from "~/contexts/FENIXContext";
import { useEnvironmentChains } from "~/hooks/useEnvironmentChains";
import { chainList } from "~/lib/client";
import { fenixContract } from "~/lib/fenix-contract";

const ChainDashboard: NextPage = () => {
  const { t } = useTranslation("common");
  const { envChains } = useEnvironmentChains();

  const router = useRouter();
  const [token, setToken] = useState<Token | null>(null);
  const { chainId } = router.query as unknown as { chainId: number };
  const chainFromId = envChains.find((c) => c && c.id == chainId);

  const { data: tokenData } = useToken({
    address: fenixContract(chainFromId).address,
    chainId: chainFromId?.id,
  });
  const { setChainOverride, genesisTs, shareRate, stakePoolSupply } = useContext(FENIXContext);

  const stakeItems = [
    {
      title: t("dashboard.pool-supply"),
      value: Number(ethers.utils.formatUnits(stakePoolSupply)),
      decimals: 0,
    },
    {
      title: t("dashboard.share-rate"),
      value: Number(ethers.utils.formatUnits(shareRate)),
      decimals: 4,
      suffix: "%",
    },
  ];

  useEffect(() => {
    if (chainFromId) {
      setChainOverride(chainFromId);
    }
    if (tokenData) {
      setToken(tokenData);
    }
  }, [chainFromId, setChainOverride, tokenData]);

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
                  <Link href={`/dashboard/${c.id}`} className="text-neutral justify-between glass">
                    {c.name}
                    {chainIcons[c.id]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <CardContainer>
            <h2 className="card-title">{t("dashboard.general-stats")}</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              <ChainStatCard value={chainFromId?.name ?? "Ethereum"} id={chainFromId?.id ?? 1} />
              <DateStatCard title={t("card.days-since-launch")} dateTs={genesisTs} isPast={true} />
              {token && (
                <DataCard
                  title={t("dashboard.token-address")}
                  value={token?.symbol ?? "FENIX"}
                  description={fenixContract(chainFromId).address}
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
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
}

export function getStaticPaths({ locales }: any) {
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
}

export default ChainDashboard;
