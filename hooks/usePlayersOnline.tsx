import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://physically-relaxing-baboon.ngrok-free.app/players";

export const usePlayersOnline = () => {
  return useQuery({
    queryKey: ["playersOnline"],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      console.log(response.data.data.playersOnline);
      return response.data.data.playersOnline;
    },
    staleTime: 10000, // Refresh every 10 seconds
  });
};
