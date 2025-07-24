
import { useState } from "react";
import type { Theme } from "../types/theme";

// Define types for the output data
type OutputData = {
  Address1: string;
  Amount1: string;
  Address2: string;
  Amount2: string;
};

type MintModalProps = {
  show: boolean;
  onClose: () => void;
  outputs?: OutputData; 
};

const MintModal = ({ show, onClose, outputs }: MintModalProps) => {
  const [theme, setTheme] = useState<Theme>(
    localStorage.getItem("theme") === "light" ||
      localStorage.getItem("theme") === "dark"
      ? (localStorage.getItem("theme") as Theme)
      : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark"
  );

  if (!show) return null;

  return (
    <div
      className="fixed top-0 inset-0 w-full h-screen z-50 flex items-center justify-center transition-colors duration-300  modal-background "
    >
      <div
        className="p-8 modal-card rounded-xl text-center shadow-lg w-full max-w-2xl h-auto mx-4 flex flex-col items-center justify-center"
        // style={{ backgroundColor: 'var(--bg-color)' }}
      >
        <div>
          <h2 className="text-2xl font-medium mb-4">
            Minting transaction submitted!
          </h2>
          
          {outputs ? (
            <div className="text-lg font-medium mb-6">
              <div className="mb-3 text left">
                <div className="mb-1">
                  <span className="text-muted">Address 1:</span> 
                  <span className="ml-2 font-mono text-sm">{outputs.Address1}</span>
                </div>
                <div className="mb-3">
                  <span className="text-muted">Amount:</span> 
                  <span className="ml-2 font-bold">{outputs.Amount1}</span>
                </div>
              </div>
              <hr className="my-4 border-t  w-full" />
              <div className="mb-3">
                <div className="mb-1">
                  <span className="text-muted">Address 2:</span> 
                  <span className="ml-2 font-mono text-sm">{outputs.Address2}</span>
                </div>
                <div>
                  <span className="text-muted">Amount:</span> 
                  <span className="ml-2 font-bold">{outputs.Amount2}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-lg font-medium mb-6 text-muted">
              Loading transaction details...
            </div>
          )}
          
          <button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow"
            onClick={onClose}
          >
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintModal;