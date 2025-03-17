import { useRef } from 'react';
import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const useReactionHandler = () => {
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserName = async () => {
            const storedUserName = await AsyncStorage.getItem("userName");
            setUserName(storedUserName);
        };
        fetchUserName();
    }, []);

    const reactionCounters = useRef({});
    const lastTapTimes = useRef({});
    const timers = useRef({}); // Store timeout references

    const sendReactionToServer = async (reactionType, count) => {
        if (!userName) return; // Ensure userName is available before sending
        try {
            await fetch("https://172.235.28.116/send-reaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: userName,
                    reactionType,
                    reactionCount: count,
                }),
            });
        } catch (error) {
            console.error("Error sending reaction:", error);
        }
    };

    return (reactionType) => {
        const now = Date.now();
        
        if (!reactionCounters.current[reactionType]) {
            reactionCounters.current[reactionType] = 0;
        }

        reactionCounters.current[reactionType] += 1;
        lastTapTimes.current[reactionType] = now;

        // Clear any existing timeout for this reaction
        if (timers.current[reactionType]) {
            clearTimeout(timers.current[reactionType]);
        }

        // Set a timeout to send data after 300ms if no new tap occurs
        timers.current[reactionType] = setTimeout(() => {
            const count = reactionCounters.current[reactionType];
            reactionCounters.current[reactionType] = 0; // Reset counter immediately
            
            sendReactionToServer(reactionType, count); // Send data asynchronously
        }, 400);
    };
};

export default useReactionHandler;
