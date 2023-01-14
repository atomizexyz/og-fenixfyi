import type { NextPage } from "next";
import { Container, CardContainer } from "~/components/containers/";
import { StakeHeaderFooter, StakeRow } from "~/components/stakes";
import PortfolioNav from "~/components/nav/PortfolioNav";
import { stakes } from "~/components/Constants";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Manage: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <Container className="max-w-5xl">
      <PortfolioNav />
      <CardContainer>
        <div className="space-y-4 w-full">
          <h2 className="card-title">{t("portfolio.ended-stakes")}</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <StakeHeaderFooter />
              </thead>
              <tbody>
                {stakes.map((stake, index) => (
                  <tr key={index}>
                    <StakeRow stake={stake} />
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <StakeHeaderFooter />
              </tfoot>
            </table>
          </div>

          <div className="flex justify-center w-full">
            <div className="btn-group">
              <button className="btn glass">1</button>
              <button className="btn glass">2</button>
              <button className="btn btn-disabled">...</button>
              <button className="btn glass">99</button>
              <button className="btn glass">100</button>
            </div>
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

export default Manage;
