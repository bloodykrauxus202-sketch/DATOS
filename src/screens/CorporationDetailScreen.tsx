import React from "react";
import { View, Text, Pressable, ScrollView, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { CorporationDetails } from "../api/googleSheets";
import NavigationBar from "../components/NavigationBar";

type Props = NativeStackScreenProps<RootStackParamList, "CorporationDetail">;

export default function CorporationDetailScreen({ route, navigation }: Props) {
  const { corporation } = route.params;

  const openDirectionsInMaps = async () => {
    if (!corporation.address || corporation.address === "N/A") {
      Alert.alert("Address Not Available", "No address information is available for this corporation.");
      return;
    }

    try {
      // Create search query for the destination
      const destination = `${corporation.name}, ${corporation.address}`;
      const encodedDestination = encodeURIComponent(destination);

      // Use Google Maps URL with directions mode (from current location to destination)
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;

      console.log("Opening directions in maps:", destination);

      const canOpen = await Linking.canOpenURL(googleMapsUrl);
      if (canOpen) {
        await Linking.openURL(googleMapsUrl);
      } else {
        Alert.alert("Error", "Unable to open maps application");
      }
    } catch (error) {
      console.error("Error opening maps:", error);
      Alert.alert("Error", "Failed to open directions in maps");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#F8FAFC", "#EFF6FF", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1" edges={["top"]}>
          {/* Header */}
          <View className="px-6 pt-4 pb-6 border-b border-gray-100">
            {/* Corporation Name - Centered */}
            <View className="items-center">
              <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="business" size={32} color="#F97316" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 text-center">
                {corporation.name}
              </Text>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className="px-6 py-6">
              {/* Details Section */}
              <View className="space-y-4">
                {/* Address with Directions */}
                {corporation.address && (
                  corporation.address !== "N/A" ? (
                    <Pressable onPress={openDirectionsInMaps}>
                      {({ pressed }) => (
                        <View
                          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
                          style={{ opacity: pressed ? 0.7 : 1 }}
                        >
                          <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
                              <Ionicons name="navigate" size={20} color="#EF4444" />
                            </View>
                            <Text className="text-sm font-semibold text-gray-500 ml-3 uppercase tracking-wide flex-1">
                              Address
                            </Text>
                            <View className="flex-row items-center">
                              <Text className="text-xs text-blue-600 font-semibold mr-1">Get Directions</Text>
                              <Ionicons name="navigate-circle" size={20} color="#3B82F6" />
                            </View>
                          </View>
                          <Text className="text-lg font-semibold text-gray-900 leading-6">
                            {corporation.address}
                          </Text>
                          <Text className="text-xs text-gray-500 mt-2">
                            Tap to get directions from your current location
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  ) : (
                    <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                      <View className="flex-row items-center mb-3">
                        <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
                          <Ionicons name="location" size={20} color="#EF4444" />
                        </View>
                        <Text className="text-sm font-semibold text-gray-500 ml-3 uppercase tracking-wide">
                          Address
                        </Text>
                      </View>
                      <Text className="text-lg font-semibold text-gray-900 leading-6">
                        {corporation.address}
                      </Text>
                    </View>
                  )
                )}

                {/* Contact */}
                {corporation.contact && corporation.contact !== "N/A" && (
                  <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                        <Ionicons name="call" size={20} color="#10B981" />
                      </View>
                      <Text className="text-sm font-semibold text-gray-500 ml-3 uppercase tracking-wide">
                        Contact
                      </Text>
                    </View>
                    <Text className="text-lg font-semibold text-gray-900 leading-6">
                      {corporation.contact}
                    </Text>
                  </View>
                )}

                {/* Email */}
                {corporation.email && corporation.email !== "N/A" && (
                  <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                        <Ionicons name="mail" size={20} color="#3B82F6" />
                      </View>
                      <Text className="text-sm font-semibold text-gray-500 ml-3 uppercase tracking-wide">
                        Email
                      </Text>
                    </View>
                    <Text className="text-lg font-semibold text-gray-900 leading-6">
                      {corporation.email}
                    </Text>
                  </View>
                )}

                {/* Description */}
                {corporation.description && corporation.description !== "N/A" && (
                  <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                        <Ionicons name="information-circle" size={20} color="#9333EA" />
                      </View>
                      <Text className="text-sm font-semibold text-gray-500 ml-3 uppercase tracking-wide">
                        Description
                      </Text>
                    </View>
                    <Text className="text-base text-gray-700 leading-7">
                      {corporation.description}
                    </Text>
                  </View>
                )}

                {/* Empty state if no details */}
                {corporation.address === "N/A" && corporation.contact === "N/A" && corporation.email === "N/A" && corporation.description === "N/A" && (
                  <View className="bg-gray-50 rounded-3xl p-8 items-center">
                    <Ionicons name="information-circle-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-600 text-center mt-4">
                      No additional details available for this corporation
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          {/* Navigation Bar */}
          <NavigationBar />

        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
