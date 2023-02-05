import { NextPage } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { CardContainer, Container } from "~/components/containers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { StakeStatusCard, DataCard } from "~/components/StatCards";
import { useContractRead, useNetwork } from "wagmi";
import { fenixContract } from "~/lib/fenix-contract";
import { truncatedAddress } from "~/lib/helpers";

const StakeId: NextPage = () => {
  const router = useRouter();
  const { chain } = useNetwork();

  const { t } = useTranslation("common");
  const { address, stakeIndex } = router.query as unknown as { address: string; stakeIndex: number };

  const { data: stake } = useContractRead({
    ...fenixContract(chain),
    functionName: "stakeFor",
    args: [address, stakeIndex],
  });

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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
export default StakeId;
