import { linkItems, textLinkItems } from "~/components/Constants";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer footer-center text-base-content py-8">
      <div>
        <div className="grid grid-cols-4 lg:grid-flow-col gap-10 lg:gap-6 text-neutral">
          {linkItems.map((item, index) => (
            <div key={index} className="tooltip tooltip-info text-white" data-tip={item.name}>
              <Link href={item.href}>
                <a target="_blank">{item.icon}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-flow-col gap-4">
        {textLinkItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <a target="_blank" className="link link-hover text-white">
              {item.name}
            </a>
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
