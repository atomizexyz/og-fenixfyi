import { PageHeader, GasEstimate, DescriptionDatum, Breadcrumbs } from "@/app/components/ui";
import { CardContainer, Container } from "@/app/components/containers";
import Link from "next/link";
import { MaxValueField } from "@/app/components/forms";

const BurnXEN = () => {
  const setValue = () => {};
  const register = (s: string) => {};

  return (
    <Container className="max-w-xl">
      <PageHeader title="Burn XEN" subtitle="Burn you XEN and mint brand new FENIX" />

      <CardContainer>
        <form className="space-y-6" action="#" method="POST">
          <MaxValueField
            title="XEN"
            description="Number of XEN to burn"
            decimals={0}
            value={1000}
            // errorMessage={<ErrorMessage errors={errors} name="burnXENAmount" />}
            register={register("burnXENAmount")}
            setValue={setValue}
          />
          <dl className="sm:divide-y sm:secondary-divider">
            <DescriptionDatum title="New" datum="1000 XEN" />
            <DescriptionDatum title="Liquid" datum="1000 XEN" />
          </dl>

          <div>
            <Link href="https://xen.fyi" className="flex w-full justify-center primary-button">
              Burn XEN
            </Link>
          </div>
          <GasEstimate />
        </form>
      </CardContainer>
    </Container>
  );
};

export default BurnXEN;
