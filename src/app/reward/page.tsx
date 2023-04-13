import Link from "next/link";
import { CardContainer, Container } from "@/app/components/containers";
import { GasEstimate, PageHeader, DescriptionDatum } from "@/app/components/ui";

export default function Reward() {
  const setValue = () => {};
  const register = (s: string) => {};

  return (
    <Container className="max-w-xl">
      <PageHeader title="Reward" subtitle="Any user can claim the the reward once the cooldown has elapses." />

      <CardContainer>
        <form className="space-y-6" action="#" method="POST">
          <div className="mt-5">
            <dl className="sm:divide-y sm:secondary-divider">
              <DescriptionDatum title="Matures In" datum="1 day" />
              <DescriptionDatum title="Stake Pool Supply" datum="123" />
              <DescriptionDatum title="Reward Pool Supply" datum="123" />
            </dl>
          </div>

          <div>
            <Link href="https://xen.fyi" className="flex w-full justify-center primary-button">
              Claim Reward
            </Link>
          </div>
          <GasEstimate />
        </form>
      </CardContainer>
    </Container>
  );
}
