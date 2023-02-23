import { NextPage } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useContractRead, useNetwork } from "wagmi";

import { CardContainer, Container } from "~/components/containers";
import { DataCard, StakeStatusCard } from "~/components/StatCards";
import { fenixContract } from "~/lib/fenix-contract";
import { truncatedAddress } from "~/lib/helpers";

const StakeId: NextPage = () => {
  const router = useRouter();
  const { chain } = useNetwork();
  const [stake, setStake] = useState<any>(null);

  const { t } = useTranslation("common");
  const { address, stakeIndex } = router.query as unknown as { address: string; stakeIndex: number };

  const { data } = useContractRead({
    ...fenixContract(chain),
    functionName: "stakeFor",
    args: [address, stakeIndex],
  });

  useEffect(() => {
    if (data) {
      setStake(data);
    }
  }, [data]);

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

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default StakeId;
