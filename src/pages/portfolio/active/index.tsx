import type { NextPage } from "next";
import { Container, CardContainer } from "~/components/containers/";
import { StakeHeaderFooter, StakeRow } from "~/components/stakes";
import PortfolioNav from "~/components/nav/PortfolioNav";
import { stakes } from "~/components/Constants";

const Manage: NextPage = () => {
  return (
    <Container className="max-w-5xl">
      <PortfolioNav />
      <CardContainer className="rounded-none rounded-r-2xl rounded-bl-2xl">
        <div className="space-y-4 w-full">
          <h2 className="card-title">Active Stakes</h2>

          <div className="overflow-x-auto">
            <table className="table  w-full">
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

export default Manage;
