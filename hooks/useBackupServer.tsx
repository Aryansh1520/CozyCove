import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://physically-relaxing-baboon.ngrok-free.app/backup";

export const useBackupServer = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get(API_URL);
      return response.data;
    },
  });
};
