import { StakesLayout } from "@/app/components/layouts/StakesLayout";
import { StakeStatus, stakes } from "@/models/stake";

const StakeEnd = () => {
  return <StakesLayout title="Ended Stake" subtitle="Ended FENIX stakes" status={StakeStatus.END} stakes={stakes} />;
};

export default StakeEnd;
