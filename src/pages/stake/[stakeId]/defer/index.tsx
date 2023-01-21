import { clsx } from "clsx";
import { useState, useContext } from "react";
import { BigNumber } from "ethers";
import { useTranslation } from "next-i18next";
import { Container, CardContainer } from "~/components/containers/";
import FENIXContext from "~/contexts/FENIXContext";
import GasEstimate from "~/components/GasEstimate";

import { WalletAddressField } from "~/components/FormFields";
import { ErrorMessage } from "@hookform/error-message";

import { useRouter } from "next/router";

import { WALLET_ADDRESS_REGEX } from "~/lib/helpers";
import { useNetwork, useContractRead, useContractWrite, useWaitForTransaction, usePrepareContractWrite } from "wagmi";
import FENIX_ABI from "~/abi/FENIX_ABI";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fenixContract } from "~/lib/fenix-contract";
import toast from "react-hot-toast";

const Defer = () => {
  const { t } = useTranslation("common");
  const { chain } = useNetwork();
  const router = useRouter();
  const { stakeId } = router.query as unknown as { stakeId: number };

  const { feeData } = useContext(FENIXContext);
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);

  const schema = yup
    .object()
    .shape({
      deferAddress: yup
        .string()
        .required(t("form-field.wallet-address-required"))
        .matches(WALLET_ADDRESS_REGEX, {
          message: t("form-field.wallet-address-invalid"),
          excludeEmptyString: true,
        }),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { deferAddress } = watch();

  const { config } = usePrepareContractWrite({
    addressOrName: fenixContract(chain).addressOrName,
    contractInterface: FENIX_ABI,
    functionName: "deferStake",
    args: [deferAddress, stakeId],
    enabled: !disabled,
  });

  const { data, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });

  const {} = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      toast(t("toast.defer-stake-successful"));
    },
  });

  const handleDeferSubmit = (data: any) => {
    write?.();
  };

  return (
    <Container className="max-w-2xl">
      <CardContainer>
        <form onSubmit={handleSubmit(handleDeferSubmit)}>
          <div className="flex flex-col space-y-4">
            <h2 className="card-title text-neutral">Defer</h2>

            <WalletAddressField
              disabled={disabled}
              errorMessage={<ErrorMessage errors={errors} name="deferAddress" />}
              register={register("deferAddress")}
            />

            <div className="form-control w-full">
              <button
                type="submit"
                className={clsx("btn glass text-neutral", {
                  loading: processing,
                })}
              >
                {t("stake.defer")}
              </button>
            </div>

            <GasEstimate feeData={feeData} gasLimit={config?.request?.gasLimit} />
          </div>
        </form>
      </CardContainer>
    </Container>
  );
};

export default Defer;
