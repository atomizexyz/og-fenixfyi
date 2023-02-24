import { NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useContractRead, useNetwork } from "wagmi";

import FENIX_ABI from "~/abi/FENIX_ABI";
import { CardContainer, Container } from "~/components/containers";
import { DataCard } from "~/components/StatCards";
import { fenixContract } from "~/lib/fenix-contract";
import { truncatedAddress } from "~/lib/helpers";

const Address: NextPage = ({ address }: any) => {
  const { t } = useTranslation(["common"]);

  const { chain } = useNetwork();

  const [stakeCount, setStakeCount] = useState<any>(0);

  const { data: stakeCountData } = useContractRead({
    address: fenixContract(chain).address,
    abi: FENIX_ABI,
    functionName: "stakeCount",
    args: [address],
  });

  useEffect(() => {
    if (stakeCountData) {
      setStakeCount(stakeCountData);
    }
  }, [stakeCountData]);
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

export async function getStaticProps({ locale, params }: any) {
  const { address } = params;

  return {
    props: {
      address: address,
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

export default Address;
