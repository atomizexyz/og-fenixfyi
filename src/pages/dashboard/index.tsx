import { NextPage } from "next";
import { Container, CardContainer } from "~/components/containers/";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Chains: NextPage = () => {
  return (
    <Container className="max-w-5xl">
      <CardContainer>
        <div className="space-y-4 w-full">Coming Soon</div>
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

export default Chains;
