import { create } from "zustand";

const SERVER_URL = "https://physically-relaxing-baboon.ngrok-free.app";

interface ImageStore {
  images: any[];
  loading: boolean;
  fetchImages: () => Promise<void>;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  loading: true,
  fetchImages: async () => {
    if (get().images.length > 0) {
      console.log("✅ Using cached images from store.");
      return;
    }

    console.log("🌍 Fetching images from server...");
    set({ loading: true });

    try {
      const res = await fetch(`${SERVER_URL}/images`);
      const data = await res.json();
      console.log("📥 Images fetched successfully from server:", data.length, "images.");
      
      set({ images: data, loading: false });
    } catch (error) {
      console.error("❌ Error fetching images from server:", error);
      set({ loading: false });
    }
  },
}));
