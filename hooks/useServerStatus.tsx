import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://physically-relaxing-baboon.ngrok-free.app/status";

export const useServerStatus = () => {
  return useQuery({
    queryKey: ["serverStatus"],
    queryFn: async () => {
      const response = await axios.get(API_URL);
    //   console.log(response.data.status);
      return response.data.status; // "online" or "offline"
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });
};
