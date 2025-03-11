import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://physically-relaxing-baboon.ngrok-free.app/gamemode";

export const useChangeGamemode = () => {
  return useMutation({
    mutationFn: async (mode: "survival" | "creative" | "adventure" | "spectator") => {
      const response = await axios.post(API_URL, { mode });
      return response.data;
    },
  });
};
