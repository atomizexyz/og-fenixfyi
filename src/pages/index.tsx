import type { NextPage } from "next";
import Meta from "~/components/Meta";
import Image from "next/image";
import Footer from "~/components/nav/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Meta />
      <div className="hero min-h-screen bg-gradient-to-br from-accent to-accent-focus">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <Image src="/images/white-logo-fenix-v-lockup.svg" alt="logo" width={256} height={256} />
            <p className="py-10 text-white text-4xl font-extrabold">
              <span className="text-black">FENIX</span> will rise from the ashes of burned XEN
            </p>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
