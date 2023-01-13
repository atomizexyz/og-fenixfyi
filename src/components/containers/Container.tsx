import { clsx } from "clsx";
import Breadcrumbs from "~/components/Breadcrumbs";

const Container = ({ children, className, ...props }: any) => {
  return (
    <div className={clsx("mx-auto py-4 px-4 sm:px-6 lg:px-8 text-neutral", className)} {...props}>
      <Breadcrumbs />
      {children}
    </div>
  );
};

export default Container;
