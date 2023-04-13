import { GasEstimate, PageHeader, Or, DescriptionDatum } from "@/app/components/ui";
import { CardContainer, Container } from "@/app/components/containers";
import Link from "next/link";
import { MaxValueField } from "@/app/components/forms";

const BurnApprove = () => {
  const setValue = () => {};
  const register = (s: string) => {};
  return (
    <Container className="max-w-xl">
      <PageHeader title="Approve Limited Burn" subtitle="Approve the FENIX contract to burn an limited amount of XEN" />

      <CardContainer>
        <form className="space-y-6" action="#" method="POST">
          <MaxValueField
            title="XEN"
            description="XEN"
            decimals={0}
            value={1000}
            // errorMessage={<ErrorMessage errors={errors} name="burnXENAmount" />}
            register={register("burnXENAmount")}
            setValue={setValue}
          />

          <dl className="sm:divide-y sm:secondary-divider">
            <DescriptionDatum title="Spend Allowance" datum="1000 XEN" />
          </dl>

          <div>
            <Link href="https://xen.fyi" className="flex w-full justify-center primary-button">
              Approve Limited Burn
            </Link>
          </div>
          <GasEstimate />
        </form>
      </CardContainer>

      <Or />

      <PageHeader
        title="Approve Unlimited Burn"
        subtitle="Approve FENIX contract to burn an unlimited amount of XEN."
      />

      <CardContainer>
        <form className="space-y-6" action="#" method="POST">
          <div>
            <Link href="https://xen.fyi" className="flex w-full justify-center primary-button">
              Approved Unlimited Burn
            </Link>
          </div>
          <GasEstimate />
        </form>
      </CardContainer>
    </Container>
  );
};

export default BurnApprove;
