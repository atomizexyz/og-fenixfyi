import { NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { CardContainer, Container } from "~/components/containers/";
import { InfoCard } from "~/components/StatCards";

const GetXen: NextPage = () => {
  const { t } = useTranslation("common");
  const chainNetwork = process.env.NEXT_PUBLIC_CHAIN_NETWORK as string;

  const xenFyi = () => {
    switch (chainNetwork) {
      case "mainnet":
        return "https://xen.fyi";
      case "testnet":
        return "https://testnet.xen.fyi";
      default:
        return "https://localhost:3000";
    }
  };

  const xenNetwork = () => {
    switch (chainNetwork) {
      case "mainnet":
        return "https://xen.network";
      default:
        return "https://testnet.xen.network";
    }
  };

  return (
    <Container className="max-w-2xl">
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/burn/get" className="step step-neutral">
            {t("burn.get")}
          </Link>

          <Link href="/burn/approve" className="step">
            {t("burn.approve")}
          </Link>

          <Link href="/burn/xen" className="step">
            {t("burn.title")}
          </Link>
        </ul>
        <CardContainer>
          <div className="space-y-4">
            <InfoCard title={t("burn.get-xen-title")} description={t("burn.get-xen-description")} />

            <div className="form-control w-full">
              <Link href={xenFyi()} className="btn glass text-neutral">
                {t("burn.get-xen")}
              </Link>
            </div>

            <div className="flex justify-center w-full">
              <Link href={xenNetwork()} className="link">
                XEN official website
              </Link>
            </div>
          </div>
        </CardContainer>
      </div>
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

export default GetXen;
