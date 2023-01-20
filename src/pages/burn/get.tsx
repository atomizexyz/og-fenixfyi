import Link from "next/link";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Container, CardContainer } from "~/components/containers/";

const GetXen: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <Container className="max-w-2xl">
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/burn/get">
            <a className="step step-neutral">{t("burn.get")}</a>
          </Link>

          <Link href="/burn/approve">
            <a className="step">{t("burn.approve")}</a>
          </Link>

          <Link href="/burn/xen">
            <a className="step">{t("burn.title")}</a>
          </Link>
        </ul>
        <CardContainer>
          <div className="alert shadow-lg glass">
            <div>
              <div>
                <InformationCircleIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold">{t("burn.get-xen-title")}</h3>
                <div className="text-xs">{t("burn.get-xen-description")}</div>
              </div>
            </div>
          </div>

          <div className="form-control w-full">
            <Link href="https://xen.fyi">
              <a className="btn glass text-neutral">{t("burn.get-xen")}</a>
            </Link>
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
