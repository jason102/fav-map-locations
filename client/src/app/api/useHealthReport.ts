import { useEffect } from "react";

export const useHealthReport = () => {
  useEffect(() => {
    const callHealthApi = async () => {
      await fetch("/api/health");
    };

    callHealthApi();
  }, []);
};
