import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { clsx } from "clsx";

const PortfolioNav: NextPage = () => {
  const router = useRouter();
  const { pathname } = router;
  return (
    <div className="tabs">
      <Link href="/portfolio/active">
        <a
          className={clsx("tab tab-lg tab-lifted text-neutral", {
            "tab-active glass": pathname == "/portfolio/active",
          })}
        >
          Active
        </a>
      </Link>
      <Link href="/portfolio/defer">
        <a
          className={clsx("tab tab-lg tab-lifted text-neutral", {
            "tab-active glass": pathname == "/portfolio/defer",
          })}
        >
          Deferred
        </a>
      </Link>
      <Link href="/portfolio/end">
        <a
          className={clsx("tab tab-lg tab-lifted text-neutral", {
            "tab-active glass": pathname == "/portfolio/end",
          })}
        >
          Ended
        </a>
      </Link>
    </div>
  );
};

export default PortfolioNav;
