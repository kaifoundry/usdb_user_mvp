import { useEffect, useState } from "react";

export function useTimeAgo(dateInput?: string | number | Date): string {
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
