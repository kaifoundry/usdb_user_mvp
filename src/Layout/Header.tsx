import { useLocation } from "react-router-dom";
import { useWallet } from "../api/connectWallet";
import { Copy } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
type HeaderProps = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme?: () => void;
  MOCK_WALLET: {
    usdbBalance: number;
    btcBalance: number;
    address: string;
  };
  logo: string;
};

export default function Header({
  theme,
  toggleTheme,
  MOCK_WALLET,
  logo,
}: HeaderProps) {
  const { wallet, connectWallet, loading, disconnectWallet } =
    useWallet();
  const location = useLocation();
  const isAppPage = location.pathname === "/usdb";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const address = wallet?.paymentAddress?.address?.toString?.() ?? "";
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied!"); 
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <>
      <Toaster position="top-center" /> {/* <-- add this */}
      <header className="header fixed w-full backdrop-blur-lg z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center gap-3 px-4 py-3 rounded-[34px] border border-white/10 backdrop-blur-sm bg-[linear-gradient(108.21deg,_rgba(82,82,82,0.24)_0%,_rgba(82,82,82,0.08)_100%)]">
              <div className="w-7 h-6 md:w-11 md:h-11 rounded-full overflow-hidden">
                <img
                  src={logo}
                  alt=""
                  className="object-cover w-full h-full object-center bg-[#FF9500] [background-blend-mode:multiply]"
                />
              </div>
              <span className="logo-text text-sm md:text-xl font-medium tracking-tight">
                BTC Stablecoin
              </span>
            </div>
          </div>

          {!isAppPage ? (
            <div className="flex items-center space-x-4 md:space-x-8">
              <nav className="hidden md:flex space-x-8 items-center text-muted">
                <a
                  href="#how-it-works"
                  className="hover:text-amber-400 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#features"
                  className="hover:text-amber-400 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#faq"
                  className="hover:text-amber-400 transition-colors"
                >
                  FAQ
                </a>
                <a
                  href="#"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 hidden md:block"
                >
                  Read Whitepaper
                </a>
                {toggleTheme && (
                  <button
                    id="theme-toggle"
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-muted hover:text-amber-400 transition-colors focus:outline-none"
                  >
                    {theme === "light" ? (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        ></path>
                      </svg>
                    )}
                  </button>
                )}
              </nav>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-end space-x-4 text-sm">
                <span className="px-4 py-3 rounded-[34px] border border-white/10 backdrop-blur-sm bg-[linear-gradient(108.21deg,_rgba(82,82,82,0.24)_0%,_rgba(82,82,82,0.08)_100%)]">
                  {MOCK_WALLET.usdbBalance.toLocaleString()} USDB
                </span>
                <span className="px-4 py-3 rounded-[34px] border  border-white/10 backdrop-blur-sm bg-[linear-gradient(108.21deg,_rgba(82,82,82,0.24)_0%,_rgba(82,82,82,0.08)_100%)]">
                  {MOCK_WALLET.btcBalance} BTC
                </span>
                {(wallet?.paymentAddress?.address?.toString?.() ) ? (
                  <span className="px-4 py-3  w-1/3 rounded-[34px] border border-white/10 backdrop-blur-sm bg-[linear-gradient(108.21deg,_rgba(82,82,82,0.24)_0%,_rgba(82,82,82,0.08)_100%)]  flex items-center">
                    <span className="truncate">
                      {(wallet?.paymentAddress?.address?.toString?.() || MOCK_WALLET.address)}
                    </span>
                    <button
                      onClick={() => {
                        const address = wallet?.paymentAddress?.address?.toString?.() || MOCK_WALLET.address;
                        if (address) {
                          navigator.clipboard.writeText(address);
                          setCopied(true);
                          toast.success("Address copied!");
                          setTimeout(() => setCopied(false), 1200);
                        }
                      }}
                      className="ml-2 p-1 rounded hover:bg-white/10 transition"
                      title={copied ? "Copied!" : "Copy to clipboard"}
                      type="button"
                    >
                      <Copy size={18} className={copied ? "text-amber-400" : ""} />
                    </button>
                  </span>
                ) : null}
              </div>
              {wallet?.paymentAddress ? (
                <button
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 hidden md:block"
                  onClick={disconnectWallet}
                  disabled={loading}
                >
                  Disconnect
                </button>
              ) : (
                <button
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 hidden md:block"
                  onClick={connectWallet}
                  disabled={loading}
                >
                  {loading
                    ? "Connecting..."
                    : wallet
                    ? "Wallet Connected"
                    : "Connect wallet"}
                </button>
              )}
              {toggleTheme && (
                <button
                  id="theme-toggle"
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-muted hover:text-amber-400 transition-colors focus:outline-none"
                >
                  {theme === "light" ? (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      ></path>
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
