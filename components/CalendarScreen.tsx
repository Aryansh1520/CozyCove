import React from "react";
import { View, Image, Dimensions, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const CalendarScreen = () => {
  return (
    <View className="flex-1 bg-black items-center pt-10">
      {/* Profile & Notification Icons */}


      {/* Calendar with Gradient Background */}
      <LinearGradient
        colors={["#FFFFFF", "#4169E1", "#1E3A8A", "#121212", "#000000"]}
        locations={[0, 0.1, 0.2, 0.55, 1]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={{
          width: width * 0.96,
          height: height * 0.45, // Reduced Height
          borderRadius: 45, // Border Radius
          overflow: "hidden",
          padding: 10,
        }}
      >
        <Calendar
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: "#fff",
            selectedDayBackgroundColor: "#6A0DAD",
            selectedDayTextColor: "#fff",
            todayTextColor: "#FFA500",
            dayTextColor: "#fff",
            monthTextColor: "#fff",
            arrowColor: "#fff",
            textDisabledColor: "#777",
          }}
          hideExtraDays={true}
          firstDay={1}
          style={{ borderRadius: 30, overflow: "hidden" }} // Rounded Calendar
        />
      </LinearGradient>
    </View>
  );
};

export default CalendarScreen;
