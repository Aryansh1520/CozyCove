import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFetchUserImage = () => {
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem("userName");
                if (!storedUserName) {
                    setError("No username found");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`https://physically-relaxing-baboon.ngrok-free.app/getSnap?username=${encodeURIComponent(storedUserName)}&t=${Date.now()}`);

                if (!response.ok) {
                    throw new Error("Image not found");
                }

                setImageUri(response.url);
                setError(null); // Clear error on success
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserImage();
    }, []);

    return { imageUri, loading, error };
};

export default useFetchUserImage;
