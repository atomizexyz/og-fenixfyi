import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "next-i18next";
import { CardContainer, Container } from "~/components/containers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Address: NextPage = () => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);
  const { t } = useTranslation("common");
  const { address } = router.query;

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <div className="flex flex-col space-y-4">{`Stakes for ${address}`}</div>
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
