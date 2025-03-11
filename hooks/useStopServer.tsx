import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://physically-relaxing-baboon.ngrok-free.app/stop";

export const useStopServer = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get(API_URL);
      return response.data;
    },
  });
};
