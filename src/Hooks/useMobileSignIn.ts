import { useCallback } from "react";

export function ensureXverseContext() {
  if (typeof window === "undefined") return; // SSR safety

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  console.log("window.location.href:", window.location.href);

  // Detect if already in Xverse in-app browser
  const isInXverse = !!(window as any).xverse || !!(window as any).BitcoinProvider;

  if (isMobile && !isInXverse) {
    const xverseLink = `https://connect.xverse.app/browser?url=${window.location.href}`;

    console.log("🔗 Redirecting to Xverse app:", xverseLink);
    window.location.replace(xverseLink); // replace to avoid back navigation loop
  }
}

export const useEnsureXverseContext = () => {
  return useCallback(() => {
    ensureXverseContext();
  }, []);
};
