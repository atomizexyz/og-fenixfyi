import Link from "next/link";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { CardContainer, Container } from "~/components/containers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DataCard } from "~/components/StatCards";
import { truncatedAddress } from "~/lib/helpers";
import { useNetwork, useContractRead } from "wagmi";
import { fenixContract } from "~/lib/fenix-contract";
import FENIX_ABI from "~/abi/FENIX_ABI";

const Address: NextPage = () => {
  const router = useRouter();
  const { chain } = useNetwork();

  const [disabled, setDisabled] = useState(false);
  const { t } = useTranslation("common");
  const { address } = router.query as unknown as { address: string };

  const { data: stakeCount } = useContractRead({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "stakeCount",
    args: [address],
  }) as unknown as { data: number };

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <h2 className="card-title">{t("stake.stakes")}</h2>

        <DataCard title={t("stake.address")} value={truncatedAddress(address)} description={address} />
        <div className="grid grid-cols-4 gap-4">
          {Array.from(Array(Number(stakeCount ?? 0)).keys()).map((_stake: any) => (
            <Link href={`/stake/${address}/${_stake}`} key={_stake}>
              <div className="btn glass text-neutral w-full"> {_stake}</div>
            </Link>
          ))}
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
export default Address;
