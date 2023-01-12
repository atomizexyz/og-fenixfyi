import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import FENIXContext from "~/contexts/FENIXContext";

const Portfolio: NextPage = () => {
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

export default Portfolio;
