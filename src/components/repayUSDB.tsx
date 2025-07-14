import { ArrowLeft, ChevronLeft } from "lucide-react";
import MainContainer from "./MainContainer";
const vaults = [
  {
    id: 1,
    collateralRatio: 12,
    btcLocked: 40,
    transactionId: "rtaes56.90",
  },
  {
    id: 2,
    collateralRatio: 12,
    btcLocked: 40,
    transactionId: "rtaes56.90",
  },
  {
    id: 3,
    collateralRatio: 12,
    btcLocked: 40,
    transactionId: "rtaes56.90",
  },
  {
    id: 4,
    collateralRatio: 12,
    btcLocked: 40,
    transactionId: "rtaes56.90",
  },
  {
    id: 5,
    collateralRatio: 12,
    btcLocked: 40,
    transactionId: "rtaes56.90",
  },
  {
    id: 6,
    collateralRatio: 12,
    btcLocked: 40,
    transactionId: "rtaes56.90",
  },
];
interface RepayUSDBProps {
  onBack: () => void;
}
function RepayUSDB({ onBack }: RepayUSDBProps) {
  return (
    <>
      <MainContainer>
        {/* Main Content */}
        <main className="px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button and Title */}
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={onBack}
                className="p-[12px] bg-[linear-gradient(108.21deg,rgba(247,153,38,0.08)_0%,rgba(247,153,38,0.04)_100%)] border border-[rgba(247,153,38,0.08)] rounded-[16px] backdrop-blur-[7px] shadow-md hover:shadow-lg transition-all duration-200"
              >
                <ChevronLeft  size={32} className=" text-[#4F4F4F]" />
              </button>
              <h2 className="text-[32px] font-medium text-[#2B2B2B]">
                Repay USDB
              </h2>
            </div>

            {/* Vaults Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {vaults.map((vault) => (
                <div
                  key={vault.id}
                  className="p-[20px] px-[16px] bg-[linear-gradient(108.21deg,rgba(247,153,38,0.08)_0%,rgba(247,153,38,0.04)_100%)] border border-[rgba(247,153,38,0.08)] rounded-[16px] backdrop-blur-[7px] shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <div className="mb-4">
                    <h3 className="text-base text-center font-medium text-[#A3A3A3] mb-4">
                      Vault #{vault.id}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#8F8F8F] text-lg font-normal">
                          Collateral Ratio
                        </span>
                        <span className="text-[#3D3D3D] font-medium text-lg">
                          {vault.collateralRatio}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#8F8F8F] text-lg font-normal">
                          BTC Locked
                        </span>
                        <span className="text-[#3D3D3D] font-medium text-lg">
                          {vault.btcLocked}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#8F8F8F] text-lg font-normal">
                          Transaction ID
                        </span>
                        <span className="text-[#3D3D3D] font-medium text-lg">
                          {vault.transactionId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full text-xl text-[#F79926] rounded-[16px] px-4 py-3 font-medium  backdrop-blur-[7px] transition-all duration-200 hover:-translate-y-0.5 border border-[rgba(247,153,38,0.64)] bg-[linear-gradient(108.21deg,rgba(247,153,38,0.08)_0%,rgba(247,153,38,0.0512)_100%)] border-image-source-[linear-gradient(108.21deg,#F79926_0%,rgba(247,153,38,0.64)_100%)] opacity-100">
                    Repay
                  </button>
                </div>
              ))}
            </div>

            {/* Repay All Button */}
            <div className="w-full flex justify-center">
              <button className="w-full text-white text-xl font-medium px-4 py-3 rounded-[16px] bg-[#FF9500] border border-[#F7992633] backdrop-blur-[7px] shadow-[0px_6px_8px_0px_#00000014] transition-all duration-200 transform hover:-translate-y-1">
                Repay ALL
              </button>
            </div>
          </div>
        </main>
      </MainContainer>
    </>
  );
}

export default RepayUSDB;
