import { useState } from "react";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import MainContainer from "./MainContainer";

interface MintUSDBProps {
  onBack: () => void;
}

function MintUSDB({ onBack }: MintUSDBProps) {
  const [amount, setAmount] = useState("");
  const [collateral, setCollateral] = useState("");
  const [feeAmount, setFeeAmount] = useState("");

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
                Mint USDB
              </h2>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto bg-[#F799260A] border border-[#F7992629] backdrop-blur-sm rounded-[32px] p-8 gap-[70px] opacity-100">
              <div className="space-y-8">
                {/* Amount Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                    AMOUNT{" "}
                    <span className="text-gray-500 normal-case">
                      (Amount should be in batches of 100)
                    </span>
                  </label>
                  <div className="rounded-[16px] border border-[#F7992633] px-2 py-3 backdrop-blur-[7px] bg-[linear-gradient(108.21deg,rgba(247,153,38,0.0512)_0%,rgba(247,153,38,0.0256)_100%)]">
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter Amount"
                      className="w-full bg-transparent text-[#B8B8B8] placeholder-[#B8B8B8] text-xl focus:outline-none"
                    />
                  </div>
                </div>

                {/* Collateral Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                    COLLATERAL REQUIRED
                  </label>
                  {/* px-4 py-5 */}
                  <div className="rounded-[16px] border border-[#F7992633] px-2 py-3 backdrop-blur-[7px] bg-[linear-gradient(108.21deg,rgba(247,153,38,0.0512)_0%,rgba(247,153,38,0.0256)_100%)]">
                    <input
                      type="text"
                      value={collateral}
                      onChange={(e) => setCollateral(e.target.value)}
                      placeholder="Collateral required"
                      className="w-full bg-transparent text-[#B8B8B8] placeholder-[#B8B8B8] text-xl focus:outline-none"
                    />
                  </div>
                </div>

                {/* Fee Amount Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2 uppercase tracking-wide">
                    FEE AMOUNT
                  </label>
                  <div className="rounded-[16px] border border-[#F7992633] px-2 py-3 backdrop-blur-[7px] bg-[linear-gradient(108.21deg,rgba(247,153,38,0.0512)_0%,rgba(247,153,38,0.0256)_100%)]">
                    <input
                      type="text"
                      value={feeAmount}
                      onChange={(e) => setFeeAmount(e.target.value)}
                      placeholder="Fee amount"
                      className="w-full bg-transparent text-[#B8B8B8] placeholder-[#B8B8B8] text-xl focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mint Button */}
                <div className="pt-6">
                  <button className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                    Mint USDB
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </MainContainer>
    </>
  );
}

export default MintUSDB;
