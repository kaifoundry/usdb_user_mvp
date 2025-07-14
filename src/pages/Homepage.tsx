
import blockBG from "../assets/blockBG.png";
import shadowleft from "../assets/bg_grad-left.png";
import shadowright from "../assets/rightshadow.png";
import logo from "../assets/btclogo.svg";
import {
  request,
  AddressPurpose,
  BitcoinNetworkType,
  getAddress,
} from "sats-connect";
import { useState } from "react";
import Button from "../components/button";
const stats = [
  { label: "Market Cap", value: "$75.64M", change: "0.75%", isPositive: true },
  { label: "Volume", value: "$1.2M", change: "1.25%", isPositive: true },
  { label: "Current Price", value: "$2.50", change: "0.50%", isPositive: true },
  { label: "24h High", value: "$2.65", change: "1.00%", isPositive: true },
];
function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [disconnected, setDisconnected] = useState<boolean>(false);
  const connectWallet = async () => {
    try {
      console.log("Provider check:", window.BitcoinProvider);

      await getAddress({
        payload: {
          purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
          message: "Connect to my local app on Mainnet",
          network: {
            type: BitcoinNetworkType.Mainnet,
          },
        },
        onFinish: (response) => {
          console.log("Full response:", response);

          const paymentAddressItem = response.addresses.find(
            (address) => address.purpose === AddressPurpose.Payment
          );
          const ordinalsAddressItem = response.addresses.find(
            (address) => address.purpose === AddressPurpose.Ordinals
          );
          const stacksAddressItem = response.addresses.find(
            (address) => address.purpose === AddressPurpose.Stacks
          );

          console.log(" Payment Address:", paymentAddressItem?.address);
          console.log("Ordinals Address:", ordinalsAddressItem?.address);
          console.log("Stacks Address:", stacksAddressItem?.address);
          setWalletAddress(paymentAddressItem?.address || null);
        },
        onCancel: () => {
          alert("User cancelled the request.");
        },
      });
    } catch (err) {
      console.error(" Wallet error:", err);
      alert("An unknown error occurred. Check console.");
    }
  };
  const disconnectWallet = () => {
    setWalletAddress(null);
    setDisconnected(true);
  };


  const getPartialAddress = (address: string | null): string => {
  if (!address) return "";

  const visibleLength = Math.floor(address.length * 0.3);
  return `${address.slice(0, visibleLength)}...`;
};
  return (
    <>
      <div className="min-h-screen w-full  relative overflow-hidden">
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${blockBG})`,
          }}
        ></div>
        <img
          src={shadowleft}
          alt="Orb Left"
          className="absolute top-1/2 -left-1/2 -translate-y-1/2  pointer-events-none"
        />

        {/* Right Image */}
        <img
          src={shadowright}
          alt="Orb Right"
          className="absolute -top-8/12 -right-5/12 pointer-events-none"
        />
        {/* <div className="absolute inset-0 opacity-30"></div> */}

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className=" w-11 h-11 rounded-full">
                {/* <DollarSign className="w-6 h-6 text-black font-bold" /> */}
                <img
                  src={logo}
                  alt=""
                  className="object-cover w-full h-full object-center"
                />
              </div>
              <h1 className="text-xl font-medium text-[#414141]">
                USDB Stablecoin
              </h1>
            </div>

            {!walletAddress ? (
              <button
                onClick={connectWallet}
                className="relative text-xl text-[#141414] font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-[34px] px-9 py-3 border"
                style={{
                  background:
                    "linear-gradient(108.21deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.08) 100%)",
                  border: "1px solid #F7931A14",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  gap: "12px",
                  opacity: 1,
                }}
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center  gap-2">
                {/* <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium truncate max-w-[200px]">
                  {walletAddress}
                </span> */}
                <span
                  className="relative text-xl text-[#333333] font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-[34px] px-9 py-3 border"
                  style={{
                    background:
                      "linear-gradient(108.21deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.08) 100%)",
                    border: "1px solid #F7931A14",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    gap: "12px",
                    opacity: 1,
                  }}
                >
                 {getPartialAddress(walletAddress)}
                </span>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="px-8 py-12">
            <div className="mb-12">
              <div className="max-w-4xl mx-auto bg-[#F799260A] border border-[#F7992629] backdrop-blur-sm rounded-[32px] p-8 gap-[70px] opacity-100">
                <div className="mb-8 pb-8 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className=" w-10 h-10 rounded-full">
                        {/* <DollarSign className="w-6 h-6 text-black font-bold" /> */}
                        <img
                          src={logo}
                          alt=""
                          className="object-cover w-full h-full object-center"
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <h2 className="text-[32px] font-medium text-[#141414]">
                          USDB
                        </h2>
                        <span className="text-[#A3A3A3] text-base font-medium">
                          USDB
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-4xl font-bold text-[#141414]">
                          0.9963
                        </span>
                        <span className="text-xl font-normal text-[#A3A3A3]">
                          USD
                        </span>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        {/* <TrendingUp className="w-5 h-5 text-green-500" /> */}
                        <span className="text-[#FF3A0D] text-base font-medium">
                          1.82% ↓
                        </span>
                        <span className="text-gray-500">(1d)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    // <div
                    //   key={index}
                    //   className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-md hover:shadow-lg hover:bg-white/25 transition-all duration-200"
                    // >
                    <div
                      className=" p-[20px] px-[16px] bg-[linear-gradient(108.21deg,rgba(247,153,38,0.08)_0%,rgba(247,153,38,0.04)_100%)] border border-transparent rounded-[16px] backdrop-blur-[7px] shadow-md hover:shadow-lg transition-all duration-200"
                      style={{
                        borderImage:
                          "linear-gradient(108.21deg, rgba(247,153,38,0.08) 0%, rgba(247,153,38,0.08) 100%) 1",
                        borderStyle: "solid",
                      }}
                    >
                      <div className="text-[#A3A3A3] text-base mb-2 font-medium">
                        {stat.label}
                      </div>
                      <div className="text-2xl font-medium text-[#3D3D3D] mb-2">
                        {stat.value}
                      </div>
                      <div className="flex items-center space-x-1">
                        {/* <TrendingUp className="w-4 h-4 text-green-500" /> */}
                        <span className="text-base font-medium text-[#0A9D05]">
                          {stat.change} ↑
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/*  Buttons */}
            <div className="max-w-4xl w-full mx-auto px-0 flex flex-col sm:flex-row gap-8">
              <Button
                label="Mint USDB"
                onClick={connectWallet}
                className="my-4"
                style={{
                  background:
                    "linear-gradient(108.21deg, rgba(247, 153, 38, 0.64) 0%, rgba(247, 153, 38, 0.64) 100%)",
                  border: "1px solid",
                  borderImageSource:
                    "linear-gradient(108.21deg, rgba(247, 153, 38, 0.08) 0%, rgba(247, 153, 38, 0.08) 100%)",
                }}
              />
              <Button
                label="Repay USDB"
                onClick={connectWallet}
                className="my-4"
                style={{
                  background:
                    "linear-gradient(108.21deg, rgba(247, 153, 38, 0.64) 0%, rgba(247, 153, 38, 0.64) 100%)",
                  border: "1px solid",
                  borderImageSource:
                    "linear-gradient(108.21deg, rgba(247, 153, 38, 0.08) 0%, rgba(247, 153, 38, 0.08) 100%)",
                }}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Home;