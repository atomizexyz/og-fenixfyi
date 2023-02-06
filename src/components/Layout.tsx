import { CheckIcon } from "@heroicons/react/outline";
import { useTranslation } from "next-i18next";
// import { useEffect, useState } from "react";
import { resolveValue, Toaster } from "react-hot-toast";

import Meta from "~/components/Meta";
import { BottomNav } from "~/components/nav/BottomNav";
import { Navbar } from "~/components/nav/Navbar";
import { FENIXProvider } from "~/contexts/FENIXContext";

import Footer from "./nav/Footer";

const Layout = ({ children }: any) => {
  const { t } = useTranslation("common");
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   return null;
  // }

  return (
    <FENIXProvider>
      <div className="pb-24 lg:pb-0">
        <Meta />
        <Navbar />
        {children}
        <Toaster position="top-right">
          {(toast) => (
            <div className="alert shadow-lg glass max-w-fit text-neutral">
              <div>
                <div>
                  <CheckIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral">🎉 {t("toast.success")}</h3>
                  <div className="text-xs text-neutral">{resolveValue(toast.message, toast)}</div>
                </div>
              </div>
            </div>
          )}
        </Toaster>
        <Footer />
        <BottomNav />
      </div>
    </FENIXProvider>
  );
};

export default Layout;
