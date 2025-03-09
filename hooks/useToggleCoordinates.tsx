import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://physically-relaxing-baboon.ngrok-free.app/coordinates";

export const useToggleCoordinates = () => {
  return useMutation({
    mutationFn: async (show: boolean) => {
      const response = await axios.post(API_URL, { show });
      return response.data;
    },
  });
};
