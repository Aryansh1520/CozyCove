import React, { useState, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from "react-native-calendars";
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';

const { height } = Dimensions.get('screen');
const { width } = Dimensions.get("window");

// Animation component for the couple
const CoupleAnimation = ({ daysLeft }) => {
  // Animation values
  const leftPersonX = useSharedValue(-80);
  const rightPersonX = useSharedValue(80);
  const heartScale = useSharedValue(1);
  const heartOpacity = useSharedValue(0);

  // Calculate progress based on days left
  const progress = Math.max(0, Math.min(1, 1 - (daysLeft / 100)));

  useEffect(() => {
    // Animate positions
    leftPersonX.value = withTiming(-80+ (70 * progress), { duration: 1000 });
    rightPersonX.value = withTiming(80 - (70 * progress), { duration: 1000 });

    // Heart animation
    if (progress > 0.7) {
      heartOpacity.value = withTiming(1, { duration: 500 });
      heartScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      heartOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [daysLeft]);

  // Animated styles
  const leftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftPersonX.value }]
  }));

  const rightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightPersonX.value }]
  }));

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.value,
    transform: [{ scale: heartScale.value }]
  }));

  // Label based on days left
  const getLabel = () => {
    if (daysLeft === 0) return "🔥 It's Today! 🔥";
    if (daysLeft === 1) return "⏳ Tomorrow’s the Day!";
    if (daysLeft < 7) return "📆 This Week, Finally!";
    if (daysLeft < 14) return "⏳ Just a Few More Days!";
    if (daysLeft < 30) return "✨ Almost There!";
    if (daysLeft < 50) return "👀 The Excitement Builds!";
    if (daysLeft < 75) return "💖 Counting the Days!";
    return "🚀 Countdown Mode!";
  };


  return (
    <View className="flex-row justify-center items-center h-full w-full">
      <View className="relative flex-row items-center justify-center">
        <Animated.View style={leftStyle}>
          <MaterialCommunityIcons name="human-female" size={24} color="#ff69b4" />
        </Animated.View>

        <Animated.View style={heartStyle} className="absolute">
          <MaterialCommunityIcons name="heart" size={20} color="#ff0000" />
        </Animated.View>

        <Animated.View style={rightStyle}>
          <MaterialCommunityIcons name="human-male" size={24} color="#1e90ff" />
        </Animated.View>
      </View>
      <Text className="text-white text-xs absolute bottom-0">{getLabel()}</Text>
    </View>
  );
};

// Main component
const DaysLeft = () => {
  // State
  const today = new Date().toISOString().split('T')[0];
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

  // Handle date selection
  const onDateSelect = (day) => {
    // Calculate days left
    const selected = day.dateString;
    const currentDate = new Date();
    const targetDate = new Date(selected);
    const timeDiff = targetDate.getTime() - currentDate.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Close calendar
    setShowCalendar(false);

    // Update state after a short delay
    setTimeout(() => {
      setSelectedDate(selected);
      setDaysLeft(days);
    }, 100);
  };

  // Close calendar on outside click
  const closeCalendar = () => {
    setShowCalendar(false);
  };

  // Render
  return (
    <>
      <View
        className="bg-[#141417] items-center p-4"
        style={{
          width: width * 0.96,
          borderRadius: 45,
          height: height * 0.15,
          marginTop: height * 0.02,
        }}
      >
        {/* Main content row */}
        <View className="flex-row items-center justify-between w-full h-full">
          {/* Date selector */}
          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            className="flex-row items-center bg-[#1e1e24] px-3 py-2 rounded-2xl"
          >
            <MaterialIcons name="date-range" size={24} color="#1e90ff" />
          </TouchableOpacity>

          {/* Middle section */}
          <View className="flex-1 mx-2 h-full flex-row justify-center items-center">
            {daysLeft !== null ? (
              <CoupleAnimation daysLeft={daysLeft} />
            ) : (
              <Text className="text-blue-400 text-xs">Choose a date to start countdown</Text>
            )}
          </View>

          {/* Days counter */}
          <View className="flex-row items-center pt-4">
            {daysLeft !== null ? (
              <View className="items-center px-5">
                <View className="w-16 h-16 justify-center items-center">
                  <Svg width="75" height="75" viewBox="0 0 100 100">
                    <Circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#2a2a30"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <Circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#1e90ff"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * Math.min(1, Math.max(0, 1 - (daysLeft / 100))))}
                      strokeLinecap="round"
                    />
                  </Svg>
                  <Text className="text-white text-lg font-bold absolute">
                    {daysLeft}
                  </Text>
                </View>
                <Text className="text-blue-400 text-s mt-5">days left</Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <MaterialIcons name="hourglass-empty" size={24} color="#1e90ff" />
                <Text className="text-white text-sm ml-2">
                  Select date
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Calendar overlay - NO MODAL COMPONENT! */}
      {showCalendar && (
        <TouchableWithoutFeedback onPress={closeCalendar}>
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-10 justify-center items-center">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="bg-[#141417] p-4 rounded-2xl w-11/12">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white text-lg">Pick a Date</Text>
                  <TouchableOpacity onPress={closeCalendar}>
                    <MaterialIcons name="close" size={24} color="#ff4757" />
                  </TouchableOpacity>
                </View>
                <Calendar
                  current={today}
                  minDate={today}
                  onDayPress={onDateSelect}
                  markedDates={
                    selectedDate ? { [selectedDate]: { selected: true, selectedColor: "#1e90ff" } } : {}
                  }
                  theme={{
                    backgroundColor: "#141417",
                    calendarBackground: "#141417",
                    textSectionTitleColor: "#ffffff",
                    selectedDayBackgroundColor: "#1e90ff",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#1e90ff",
                    dayTextColor: "#ffffff",
                    textDisabledColor: "#555555",
                    arrowColor: "#1e90ff",
                    monthTextColor: "#ffffff",
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default DaysLeft;
