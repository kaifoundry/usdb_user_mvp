import { useEffect, useMemo, useState } from "react";

export function useTimeAgo(dateInput?: string | number | Date |null): string {
  const [timeAgo, setTimeAgo] = useState("Pending");

  useEffect(() => {
    if (!dateInput) {
      setTimeAgo("Pending");
      return;
    }

    const date = new Date(dateInput);
    const update = () => {
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) {
        setTimeAgo("Just now");
      } else if (seconds < 3600) {
        const mins = Math.floor(seconds / 60);
        setTimeAgo(`${mins} minute${mins !== 1 ? "s" : ""} ago`);
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`${hours} hour${hours !== 1 ? "s" : ""} ago`);
      } else if (seconds < 604800) {
        const days = Math.floor(seconds / 86400);
        setTimeAgo(`${days} day${days !== 1 ? "s" : ""} ago`);
      } else {
        setTimeAgo(date.toLocaleDateString());
      }
    };

    update();

    const interval = setInterval(update, 60 * 1000); 
    return () => clearInterval(interval);
  }, [dateInput]);

  return timeAgo;
}
export function useFormattedDate(dateString?: string) {
  return useMemo(() => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };

    return date.toLocaleDateString("en-GB", options); // 👉 "13 Aug"
  }, [dateString]);
}
export function formatDate(dateStr: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, 
  };
  return new Date(dateStr).toLocaleString(undefined, options);
}

export function useAuctionTimer(startTs: string, durationMinutes = 30) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!startTs) {
      setTimeLeft("Invalid date");
      return;
    }

    const start = new Date(startTs).getTime();
    if (isNaN(start)) {
      setTimeLeft("Invalid date");
      return;
    }

    const end = start + durationMinutes * 60 * 1000;

    function updateTimer() {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${minutes} min ${seconds} sec left`);
    }

    updateTimer(); // initial
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTs, durationMinutes]);

  return timeLeft;
}

