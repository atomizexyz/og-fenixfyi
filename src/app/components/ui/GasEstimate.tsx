import { NextPage } from "next";

interface GasEstimateProps {
  feeData?: number;
  gasLimit?: number;
}

const GasEstimate: NextPage<GasEstimateProps> = ({ feeData, gasLimit }) => {
  return (
    <table className="w-full">
      <tbody>
        <tr className="text-sm ">
          <td className="capitalized primary-text">Gas:</td>
          <td className="font-mono text-right secondary-text">123</td>
        </tr>
        <tr className="text-sm">
          <td className="capitalized primary-text">Transaction:</td>
          <td className="font-mono text-right secondary-text">123</td>
        </tr>
        <tr className="text-sm">
          <td className="capitalized primary-text">Total:</td>
          <td className="font-mono text-right secondary-text">123</td>
        </tr>
      </tbody>
    </table>
  );
};

export default GasEstimate;
