import "./App.css";
import { DollarSign,  TrendingUp,  } from "lucide-react";
import blockBG from "./assets/welcome.png";
import {
  request,
  AddressPurpose,
  BitcoinNetworkType,
  getAddress,
} from 'sats-connect';
import { useState } from "react";
const stats = [
  { label: "Market Cap", value: "$75.64M", change: "0.75%", isPositive: true },
  { label: "Volume", value: "$1.2M", change: "1.25%", isPositive: true },
  { label: "Current Price", value: "$2.50", change: "0.50%", isPositive: true },
  { label: "24h High", value: "$2.65", change: "1.00%", isPositive: true },
];
function App() {
     const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [disconnected, setDisconnected] = useState<boolean>(false);
  const connectWallet = async () => {
    try {
      console.log('Provider check:', window.BitcoinProvider);

      await getAddress({
        payload: {
          purposes: [
            AddressPurpose.Payment,  
            AddressPurpose.Ordinals 
          ],
          message: "Connect to my local app on Mainnet",
          network: {
            type: BitcoinNetworkType.Mainnet 
          }
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

          console.log(' Payment Address:', paymentAddressItem?.address);
          console.log('Ordinals Address:', ordinalsAddressItem?.address);
          console.log('Stacks Address:', stacksAddressItem?.address);
  setWalletAddress(paymentAddressItem?.address || null);
        },
        onCancel: () => {
          alert('User cancelled the request.');
        },
      });

    } catch (err) {
      console.error(' Wallet error:', err);
      alert('An unknown error occurred. Check console.');
    }
  };
  const disconnectWallet = () => {
    setWalletAddress(null);
    setDisconnected(true);
  };

  return (
    <>
      <div
        className="min-h-screen w-full  relative overflow-hidden"
        style={{
          backgroundImage: `url(${blockBG})`,
          width: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
     

   
        {/* <div className="absolute inset-0 opacity-30"></div> */}

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-400 p-2 rounded-full">
                <DollarSign className="w-6 h-6 text-black font-bold" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                USDB Stablecoin
              </h1>
            </div>

           
               {!walletAddress ? (
           <button   onClick={connectWallet} className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200 px-6 py-3 rounded-lg font-medium text-gray-800 shadow-lg hover:shadow-xl">
              Connect Wallet
            </button>
        ) : (
          <div className="flex items-center  gap-2">
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium truncate max-w-[200px]">
              {walletAddress}
            </span>
            <button   onClick={disconnectWallet} className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all duration-200 px-6 py-3 rounded-lg font-medium text-gray-800 shadow-lg hover:shadow-xl">
              Disconnect
            </button>
          </div>
        )}
          </header>

          {/* Main Content */}
          <main className="px-8 py-12">
         
            <div className="mb-12">
           
              <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
          
                <div className="mb-8 pb-8 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-400 p-3 rounded-full">
                        <DollarSign className="w-8 h-8 text-black font-bold" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold text-[#141414]">
                          USDB
                        </h2>
                        <span className="text-gray-500 text-lg">USDB</span>
                      </div>
                    </div>

                 
                    <div className="text-right">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-4xl font-bold text-[#141414]">
                          0.9963
                        </span>
                        <span className="text-3xl text-gray-500">USD</span>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="text-green-500 font-medium">
                          1.82% ↑
                        </span>
                        <span className="text-gray-500">(1d)</span>
                      </div>
                    </div>
                  </div>
                </div>

             
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-md hover:shadow-lg hover:bg-white/25 transition-all duration-200"
                    >
                      <div className="text-gray-700 text-sm mb-2 font-medium">
                        {stat.label}
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-2">
                        {stat.value}
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">
                          {stat.change} ↑
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/*  Buttons */}
            <div className="max-w-4xl w-full mx-auto px-0 flex flex-col sm:flex-row gap-4">
              <button className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                Mint USDB
              </button>
              <button className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                Repay USDB
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
