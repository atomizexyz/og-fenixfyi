import { BigNumber } from "ethers";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { Address, useContractRead, useNetwork } from "wagmi";

import { CardContainer, Container } from "~/components/containers";
import { DataCard, StakeStatusCard } from "~/components/StatCards";
import { fenixContract } from "~/lib/fenix-contract";
import { truncatedAddress } from "~/lib/helpers";

const StakeId: NextPage = ({ address, stakeIndex }: any) => {
  const { chain } = useNetwork();
  const [stake, setStake] = useState<any>(null);

  const { t } = useTranslation("common");

  const { data: stakeData } = useContractRead({
    ...fenixContract(chain),
    functionName: "stakeFor",
    args: [address, stakeIndex],
  });

  useEffect(() => {
    if (stakeData) {
      setStake(stakeData);
    }
  }, [stakeData]);

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <div className="flex flex-col space-y-4">
          <h2 className="card-title">{t("stake.title")}</h2>
          <DataCard title={t("stake.address")} value={truncatedAddress(address)} description={address} />
          <DataCard title={t("stake.index")} value={String(stakeIndex)} />
          <StakeStatusCard status={stake?.status} />
        </div>
      </CardContainer>
    </Container>
  );
};

export async function getStaticProps({ locale, params }: any) {
  const { address, stakeIndex } = params;

  return {
    props: {
      address: address as Address,
      stakeIndex: stakeIndex as BigNumber,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default StakeId;
