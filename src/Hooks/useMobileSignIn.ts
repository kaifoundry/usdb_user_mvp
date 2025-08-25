import { useCallback } from "react";

export function ensureXverseContext() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile && !("xverse" in window)) {
    const encodedUrl = encodeURIComponent(window.location.href);
    const xverseLink = `https://connect.xverse.app/browser?url=${encodedUrl}`;
    window.location.href = xverseLink;
    throw new Error("Redirecting to Xverse app…");
  }
}

export const useEnsureXverseContext = () => {
  const ensure = useCallback(() => {
    ensureXverseContext();
  }, []);

  return ensure;
};
