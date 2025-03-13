import { useState, useEffect } from "react";
import { 
  View, TextInput, TouchableOpacity, Text, Dimensions, Alert, BackHandler , StatusBar
} from "react-native";
import CozyCoveAnimated from '../components/CozyCoveAnimated';
import useAuth from "../hooks/useLogin";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { height } = Dimensions.get("screen");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);

  useEffect(() => {
    const onBackPress = () => {
      return true; // Prevents going back
    };

    // Add event listener
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    // Cleanup when component unmounts
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    const result = await login(username, password);

    if (!result.success) {
      Alert.alert("Error", error || "Invalid credentials");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar backgroundColor="#000" />
      
      <View className="flex-1 bg-black items-center justify-center">
        {/* Animated Logo */}
        <View style={{ height: height * 0.08, width: "100%", justifyContent: "flex-end" }}>
          <CozyCoveAnimated />
        </View>

        {/* Login Form */}
        <View className="w-[90%] bg-[#141417] py-10 px-3 rounded-[40] mt-4">
          <TextInput
            className="w-full h-[55] bg-white/10 p-3 rounded-[46] text-white mb-4"
            placeholder="Username"
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
            style={{ fontFamily: "Inter_600SemiBold", paddingHorizontal: 30 }}
          />

          <View className="w-full h-[55] bg-white/10 flex-row items-center rounded-[46] mb-4 px-3">
            <TextInput
              className="flex-1 text-white"
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
              style={{ fontFamily: "Inter_600SemiBold", paddingHorizontal: 20 }}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Icon 
                name={secureText ? "eye-off" : "eye"} 
                size={24} 
                color="#ccc" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            className="w-full h-[55] bg-blue-900 p-3 rounded-[45] items-center" 
            onPress={handleLogin} 
            disabled={loading}
          >
            <Text className="text-white font-bold py-2" style={{ fontFamily: "Inter_300Light" }}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
