import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTheme } from "next-themes";

import { Container } from "~/components/containers/";

const Custom404: NextPage = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Container className="max-w-4xl">
      <div className="hero min-h-1/2">
        <div className="hero-content flex-col space-x-4 space-y-4 lg:flex-row">
          <Image
            src={`/images/${resolvedTheme}/404.png`}
            alt="404"
            width={500}
            height={500}
            className="max-w-sm rounded-3xl shadow-2xl"
          />
          <div>
            <h1 className="text-8xl font-bold">404</h1>
            <h1 className="text-5xl font-bold">file not found</h1>
            <p className="py-6 ">
              Sorry, it seems this Fenix is permanently grounded and unable to rise from the ashes.
            </p>
            <Link href="/" className="btn glass text-neutral">
              Go Home
            </Link>
          </div>
        </div>
      </div>
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

export default Custom404;
