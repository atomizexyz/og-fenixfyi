import Container from "~/components/containers/Container";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Stake = () => {
  return (
    <Container className="max-w-5xl">
      <div className="space-y-4 w-full">Coming Soon</div>
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

export default Stake;
