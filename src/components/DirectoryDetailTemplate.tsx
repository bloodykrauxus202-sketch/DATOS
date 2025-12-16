import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import NavigationBar from "./NavigationBar";

interface DirectoryDetailTemplateProps {
  title: string;
  iconImage: any;
  description: string;
  children?: React.ReactNode;
}

export default function DirectoryDetailTemplate({
  title,
  iconImage,
  description,
  children,
}: DirectoryDetailTemplateProps) {
  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#F8FAFC", "#EFF6FF", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1" edges={["top"]}>
          {/* Header */}
          <View className="px-6 pt-4 pb-6 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-20 h-20 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mr-4">
                <Image
                  source={iconImage}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  {title}
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  {description}
                </Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className="px-6 py-6">
              {children || (
                <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                  <Text className="text-base text-gray-700 leading-6 text-center">
                    Content for {title} will be displayed here.
                  </Text>
                  <Text className="text-sm text-gray-500 mt-4 text-center leading-5">
                    This section is ready for you to add information about{" "}
                    {title.toLowerCase()}.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Navigation Bar */}
          <NavigationBar />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
