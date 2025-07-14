import logo from "../assets/btclogo.svg";
import {
  AddressPurpose,
  BitcoinNetworkType,
  getAddress,
} from "sats-connect";
import { useState } from "react";
export default function Header() {
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
    <header className="flex justify-between items-center px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className=" w-11 h-11 rounded-full">
                {/* <DollarSign className="w-6 h-6 text-black font-bold" /> */}
                <img
                  src={logo}
                  alt=""
                  className="object-cover w-full h-full object-center background: #FF9500;
background-blend-mode: multiply;
"
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
   </>
  )
}
