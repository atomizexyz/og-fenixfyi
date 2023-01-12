import type { NextPage } from "next";

export const StakeHeaderFooter: NextPage<any> = (props) => {
  return (
    <tr>
      <th className="bg-transparent hidden lg:table-cell">Start</th>
      <th className="bg-transparent hidden lg:table-cell">End</th>
      <th className="bg-transparent hidden lg:table-cell text-right">Principal</th>
      <th className="bg-transparent hidden lg:table-cell text-right">Shares</th>
      <th className="bg-transparent hidden lg:table-cell text-right">Total</th>
      <th className="bg-transparent hidden lg:table-cell text-right">Progress</th>
      <th className="bg-transparent hidden lg:table-cell"></th>
    </tr>
  );
};

export default StakeHeaderFooter;
