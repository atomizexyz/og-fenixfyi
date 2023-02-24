import { DuplicateIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { BigNumber, ethers } from "ethers";
import { NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "usehooks-ts";
import { Chain, useContractReads, useToken } from "wagmi";

import { chainIcons } from "~/components/Constants";
import { CardContainer, Container } from "~/components/containers/";
import { Token } from "~/contexts/FENIXContext";
import { useEnvironmentChains } from "~/hooks/useEnvironmentChains";
import { fenixContract } from "~/lib/fenix-contract";
import { truncatedAddress } from "~/lib/helpers";

const Dashboard: NextPage = () => {
  const { t } = useTranslation("common");
  const { envChains } = useEnvironmentChains();

  const AddressLinks: NextPage<{ chain: Chain }> = ({ chain }) => {
    const [_, copy] = useCopyToClipboard();

    return (
      <div className="flex flex-row-reverse lg:flex-row space-x-8 lg:space-x-2 lg:justify-end">
        <pre className="pl-8 lg:pl-0">{truncatedAddress(fenixContract(chain).address)}</pre>
        <button
          className="btn btn-square btn-xs glass text-neutral"
          onClick={() => {
            copy(fenixContract(chain).address);
            toast.success(
              <div>
                <pre>{truncatedAddress(fenixContract(chain).address)}</pre>
                {"Copied to clipboard"}
              </div>
            );
          }}
        >
          <DuplicateIcon className="w-5 h-5" />
        </button>
        <Link
          href={`${chain?.blockExplorers?.default.url}/address/${fenixContract(chain).address}`}
          target="_blank"
          className="btn btn-square btn-xs glass text-neutral"
        >
          <ExternalLinkIcon className="w-5 h-5" />
        </Link>
      </div>
    );
  };

  const ChainRow: NextPage<{ chain: Chain }> = ({ chain }) => {
    const [token, setToken] = useState<Token | null>(null);
    const [shareRate, setShareRate] = useState<BigNumber>(BigNumber.from(0));
    const [poolSupply, setPoolSupply] = useState<BigNumber>(BigNumber.from(0));

    const { data: tokenData } = useToken({
      address: fenixContract(chain).address,
      chainId: chain?.id,
    });

    useContractReads({
      contracts: [
        {
          ...fenixContract(chain),
          functionName: "shareRate",
        },
        {
          ...fenixContract(chain),
          functionName: "stakePoolSupply",
        },
      ],
      onSuccess(data) {
        setShareRate(BigNumber.from(data?.[0] ?? 0));
        setPoolSupply(BigNumber.from(data?.[1] ?? 0));
      },
      watch: true,
    });

    useEffect(() => {
      if (tokenData) {
        setToken(tokenData);
      }
    }, [tokenData]);

    return (
      <tr>
        <td>
          <Link href={`/dashboard/${chain.id}`}>
            <div className="p-2 flex">
              <div className="relative w-full lg:w-max">
                <div className="btn btn-md glass gap-2 text-neutral w-full lg:w-max">
                  {chainIcons[chain?.id ?? 1]}
                  {chain.name}
                </div>
                {token ? (
                  <>
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full badge-success animate-ping"></div>
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full badge-success"></div>
                  </>
                ) : (
                  <>
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full badge-warning animate-ping"></div>
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full badge-warning"></div>
                  </>
                )}
              </div>
            </div>
          </Link>
          {/* <div className="pt-4 lg:hidden flex flex-col space-y-4">
            <pre className="text-right">
              <CountUp end={Number(ethers.utils.formatUnits(shareRate))} preserveValue={true} separator="," suffix="%" decimals={4} />
            </pre>
            {tokenData && <AddressLinks chain={chain} />}
          </div> */}
        </td>

        <td>
          <pre className="text-right">
            <CountUp
              end={Number(ethers.utils.formatUnits(poolSupply))}
              preserveValue={true}
              separator=","
              decimals={4}
            />
          </pre>
        </td>

        <td className="hidden lg:table-cell text-right">
          <pre>
            <CountUp
              end={Number(ethers.utils.formatUnits(shareRate))}
              preserveValue={true}
              separator=","
              suffix="%"
              decimals={4}
            />
          </pre>
        </td>
        <td className="hidden lg:table-cell">{token && <AddressLinks chain={chain} />}</td>
      </tr>
    );
  };

  const TableHeaderFooter = () => {
    return (
      <tr>
        <th className="hidden lg:table-cell"></th>
        <th className="hidden lg:table-cell text-right">{t("dashboard.pool-supply")}</th>
        <th className="hidden lg:table-cell text-right">{t("dashboard.share-rate")}</th>
        <th className="hidden lg:table-cell text-right">{t("address")}</th>
      </tr>
    );
  };

  return (
    <Container className="max-w-5xl">
      <CardContainer>
        <h2 className="card-title">{t("address")}</h2>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <TableHeaderFooter />
            </thead>
            <tbody>
              {envChains.map((item, index) => (
                <ChainRow chain={item} key={index} />
              ))}
            </tbody>
            <tfoot>
              <TableHeaderFooter />
            </tfoot>
          </table>
        </div>
      </CardContainer>
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

export default Dashboard;
