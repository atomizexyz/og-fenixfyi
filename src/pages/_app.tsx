import "~/styles/main.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Analytics } from "@vercel/analytics/react";
import { appWithTranslation } from "next-i18next";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
      <Analytics />
    </ThemeProvider>
  );
};

export default appWithTranslation(MyApp);
