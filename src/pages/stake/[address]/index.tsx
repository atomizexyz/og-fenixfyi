import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Address, useContractRead, useNetwork } from "wagmi";

import FENIX_ABI from "~/abi/FENIX_ABI";
import { CardContainer, Container } from "~/components/containers";
import { DataCard } from "~/components/StatCards";
import { fenixContract } from "~/lib/fenix-contract";
import { truncatedAddress } from "~/lib/helpers";

const Address: NextPage = () => {
  const router = useRouter();
  const { chain } = useNetwork();

  const { t } = useTranslation("common");
  const { address } = router.query as unknown as { address: Address };

  const { data: stakeCount } = useContractRead({
    address: fenixContract(chain).address,
    abi: FENIX_ABI,
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
      ...(await serverSideTranslations(locale, ["common"], null, ["en"])),
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default Address;
