import React, { useState } from "react";
import { request } from "sats-connect";
import {
  AddressPurpose,
  BitcoinNetworkType,
} from 'sats-connect';



const MintRuneForm = () => {
 const [walletAddress, setWalletAddress] = useState<string | null>(null);


  // Connect to Xverse Wallet
  const connectWallet = async () => {
    const requestParams = {
      addresses: [
        AddressPurpose.Payment,
        AddressPurpose.Ordinals,
        AddressPurpose.Stacks,
      ],
      message: "Connect your Xverse wallet to mint Rune",
      network: BitcoinNetworkType.Mainnet,
    };

    try {
      const response = await request("wallet_connect", requestParams);
      if (response.status === "success") {
        const paymentAddr = response.result.addresses.find(
          (a) => a.purpose === AddressPurpose.Payment
        );
        setWalletAddress(paymentAddr?.address ?? null);
      } else {
        console.error("Connect failed:", response.error);
      }
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 text-gray-900 font-sans">

      <div className="w-full max-w-3xl flex justify-between items-center mb-12">
        <div className="text-sm font-medium bg-gray-200 rounded-full px-4 py-2 shadow">
          BTC Stablecoin
        </div>
        {!walletAddress ? (
          <button
            onClick={connectWallet}
            className="text-sm font-medium bg-gray-200 rounded-full px-4 py-2 hover:bg-gray-300 transition"
          >
            Connect Xverse
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium truncate max-w-[200px]">
              {walletAddress}
            </span>
            <button
              onClick={disconnectWallet}
              className="text-sm font-medium bg-red-100 text-red-800 rounded-full px-3 py-1 hover:bg-red-200 transition"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

  
      <div className="w-full max-w-xl rounded-2xl border border-gray-300 p-6 bg-white shadow-md backdrop-blur-md">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="text-lg">←</span> Mint Rune
        </h2>

        <form className="space-y-5">
      
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-gray-600 mb-1 block">
              Amount
            </label>
            <input
              type="text"
              placeholder="Enter Amount"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

        
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-gray-600 mb-1 block">
              Collateral Required
            </label>
            <input
              type="text"
              placeholder="Collateral required"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

  
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-gray-600 mb-1 block">
              Fee Amount
            </label>
            <input
              type="text"
              placeholder="Fee Amount"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

   
          <div>
            <button
              type="submit"
              className="w-full py-3 rounded-md bg-gray-900 text-white hover:bg-black transition"
            >
              Agree and Mint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MintRuneForm;
