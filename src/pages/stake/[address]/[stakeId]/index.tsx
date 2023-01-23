import Link from "next/link";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "next-i18next";
import { CardContainer, Container } from "~/components/containers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const StakeId: NextPage = () => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);
  const { t } = useTranslation("common");
  const { address, stakeId } = router.query;

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <div className="flex flex-col space-y-4">
          {address}

          {stakeId}
          <Link href="/stake/0x0000000000000000000000000000000000000000">
            <div className="form-control w-full">
              <button type="submit" className="btn glass text-neutral" disabled={disabled}>
                {t("stake.defer")}
              </button>
            </div>
          </Link>

          <div className="form-control w-full">
            <button type="submit" className="btn glass text-neutral" disabled={disabled}>
              {t("stake.end")}
            </button>
          </div>
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
