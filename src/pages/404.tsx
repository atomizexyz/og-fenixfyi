/* eslint-disable @next/next/no-img-element */
import { Container } from "~/components/containers/";
import { useTheme } from "next-themes";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

const Custom404: NextPage = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Container className="max-w-4xl">
      <div className="hero min-h-1/2">
        <div className="hero-content flex-col space-x-4 space-y-4 lg:flex-row">
          <img src={`/images/${resolvedTheme}/404.png`} alt="404" className="max-w-sm rounded-2xl shadow-2xl" />
          <div>
            <h1 className="text-8xl font-bold">404</h1>
            <h1 className="text-5xl font-bold">file not found</h1>
            <p className="py-6 ">Please try again, the page you are trying to reach could not be found.</p>
            <Link href="/">
              <button className="btn glass text-neutral">Go Home</button>
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
