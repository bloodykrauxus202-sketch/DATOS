import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";

interface DirectoryItem {
  id: string;
  title: string;
  image: any;
}

const directories: DirectoryItem[] = [
  {
    id: "1",
    title: "Parish",
    image: require("../../assets/Parish-1764828819730.jpeg"),
  },
  {
    id: "2",
    title: "BEC",
    image: require("../../assets/BEC-1764828792772.jpeg"),
  },
  {
    id: "3",
    title: "Priest",
    image: require("../../assets/Priest-1764828826700.jpeg"),
  },
  {
    id: "4",
    title: "Ministry",
    image: require("../../assets/Ministry-1764828817952.jpeg"),
  },
  {
    id: "5",
    title: "Lay Movement",
    image: require("../../assets/Lay Movement-1764828815995.jpeg"),
  },
  {
    id: "6",
    title: "Vicariate",
    image: require("../../assets/Vicariate-1764828832821.jpeg"),
  },
  {
    id: "7",
    title: "Schools",
    image: require("../../assets/Schools-1764828828863.jpeg"),
  },
  {
    id: "8",
    title: "Congregation",
    image: require("../../assets/Congregation-1764828803303.jpeg"),
  },
  {
    id: "9",
    title: "Corporations",
    image: require("../../assets/Corporations-1764828805565.jpeg"),
  },
  {
    id: "10",
    title: "History",
    image: require("../../assets/History-1764828807646.jpeg"),
  },
];

// Typewriter component for animated text
function TypewriterText({
  text,
  delay = 0,
  speed = 80,
  style,
}: {
  text: string;
  delay?: number;
  speed?: number;
  style?: object;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setStartTyping(true);
    }, delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [startTyping, text, speed]);

  return (
    <Text style={style}>
      {displayedText}
      {displayedText.length < text.length && startTyping && (
        <Text style={{ opacity: 0.6 }}>|</Text>
      )}
    </Text>
  );
}

export default function HomeScreen() {
  const [showDioceseName, setShowDioceseName] = useState(false);
  const dioceseOpacity = useSharedValue(0);
  const dioceseTranslateY = useSharedValue(20);

  // Show diocese name after "Welcome to the" finishes typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDioceseName(true);
      dioceseOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
      dioceseTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.back(1.5)) });
    }, 1800); // After "Welcome to the" finishes typing
    return () => clearTimeout(timer);
  }, []);

  const dioceseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: dioceseOpacity.value,
    transform: [{ translateY: dioceseTranslateY.value }],
  }));

  const handleDirectoryPress = (directory: DirectoryItem) => {
    console.log("Pressed:", directory.title);
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#F8FAFC", "#EFF6FF", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className="items-center px-6 pt-8">
              {/* Animated Header */}
              <View className="mb-6 items-center">
                {/* "Welcome to the" - Elegant cursive style with typewriter */}
                <View className="mb-3">
                  <TypewriterText
                    text="Welcome to the"
                    delay={300}
                    speed={90}
                    style={{
                      fontSize: 28,
                      fontStyle: "italic",
                      fontWeight: "300",
                      color: "#92400E",
                      letterSpacing: 2,
                      textAlign: "center",
                    }}
                  />
                </View>

                {/* "The Roman Catholic Diocese of Tagum" - Bold and prominent */}
                <Animated.View style={dioceseAnimatedStyle} className="items-center">
                  <Text
                    className="text-center font-bold text-gray-900 tracking-tight"
                    style={{
                      fontSize: 26,
                      lineHeight: 32,
                    }}
                  >
                    The Roman Catholic
                  </Text>
                  <Text
                    className="text-center font-bold tracking-tight"
                    style={{
                      fontSize: 28,
                      lineHeight: 34,
                      color: "#1E40AF",
                    }}
                  >
                    Diocese of Tagum
                  </Text>
                </Animated.View>

                {/* Decorative line */}
                <Animated.View
                  entering={FadeIn.delay(2600).duration(600)}
                  className="mt-4 mb-3"
                >
                  <View
                    style={{
                      width: 60,
                      height: 3,
                      backgroundColor: "#D4AF37",
                      borderRadius: 2,
                    }}
                  />
                </Animated.View>

                {/* Tagline with fade in */}
                <Animated.Text
                  entering={FadeInDown.delay(2800).duration(600)}
                  className="text-sm text-center text-gray-600 leading-6 px-4"
                >
                  Your all-in-one directory for everything within the Diocese —
                  Parishes, BECs, Clergy, Ministries, and more.
                </Animated.Text>
              </View>

              {/* Center Diocese Logo with animation */}
              <Animated.View
                entering={FadeIn.delay(3000).duration(800)}
                className="mb-10 mt-4"
              >
                <View className="w-44 h-44 bg-white rounded-full items-center justify-center shadow-xl overflow-hidden border-4 border-amber-100">
                  <Image
                    source={require("../../assets/Diocese of Tagum-1764828361688.jpeg")}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
              </Animated.View>

              {/* Directory Icons Grid */}
              <View className="w-full max-w-md">
                <View className="flex-row flex-wrap justify-center gap-3">
                  {directories.map((directory) => (
                    <Pressable
                      key={directory.id}
                      onPress={() => handleDirectoryPress(directory)}
                      className="items-center"
                      style={{ width: "30%" }}
                    >
                      {({ pressed }) => (
                        <View
                          style={{
                            opacity: pressed ? 0.7 : 1,
                            transform: [{ scale: pressed ? 0.96 : 1 }],
                          }}
                        >
                          <View className="w-full aspect-square bg-white rounded-3xl items-center justify-center shadow-lg mb-2 overflow-hidden border border-gray-100">
                            <Image
                              source={directory.image}
                              style={{ width: "100%", height: "100%" }}
                              contentFit="cover"
                            />
                          </View>
                          <Text className="text-xs font-semibold text-gray-800 text-center px-1 leading-tight">
                            {directory.title}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
