import { titleCase } from "lib/helpers";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Meta: NextPage = () => {
  const router = useRouter();
  const { asPath } = router;
  const path = asPath.split("/").filter((item) => item !== "");

  const title = `FENIX.fyi - ${titleCase(path.join(" - "))}`;
  const description =
    "FENIX.fyi is the official an open-source project to help users understand the FENIX protocol and its ecosystem.";
  const url = "https://fenix.fyi";
  const image = "https://fenix.fyi/images/og-logo-slogan.png";

  return (
    <Head>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />

      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta name="author" content="https://atomize.xyz" />
      <meta
        name="keywords"
        content="fenix.fyi, fenix, xen crypto, xencrypto, xen, crypto, token, ethereum, avalanche, polygon, binance, moonbeam, evmos, fantom, dogechain"
      />

      {/* Apple */}
      <link rel="apple-touch-icon" href="touch-icon.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="touch-icon-152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="touch-icon-180.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="touch-icon-167.png" />
      <meta name="apple-mobile-web-app-title" content="FENIX" />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      {/* PWA */}
      <link rel="manifest" href="/manifest.json" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@atomizexyz" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Open Graph */}
      <meta property="og:url" content={url} key="ogurl" />
      <meta property="og:image" content={image} key="ogimage" />
      <meta property="og:site_name" content="" key="ogsitename" />
      <meta property="og:title" content={title} key="ogtitle" />
      <meta property="og:description" content={description} key="ogdesc" />

      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <title>{title}</title>
    </Head>
  );
};

export default Meta;
