import { Wrench } from "lucide-react";

interface NetworkBannerProps {
  networkName?: string;
}

const NetworkBanner: React.FC<NetworkBannerProps> = ({ networkName }) => {
  return (
    <div className="test-net-text border md:border-[1.2px] border-dashed bg-[rgba(255,149,0,0.2)] border-[rgba(255,149,0,0.32)] rounded-xl md:rounded-2xl py-2.5 md:px-4 md:py-2 w-full max-w-lg mx-auto mb-4 flex items-center justify-center gap-2">
      <Wrench size={19} />
      <span>You are in {networkName ?? "Testnet"} mode</span>
    </div>
  );
};

export default NetworkBanner;
