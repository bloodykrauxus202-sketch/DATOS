import React from "react";
import { View, Text, Pressable, ScrollView, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { ParishDetails } from "../api/googleSheets";
import NavigationBar from "../components/NavigationBar";

type Props = NativeStackScreenProps<RootStackParamList, "ParishDetail">;

export default function ParishDetailScreen({ route, navigation }: Props) {
  const { parish } = route.params;

  // Parse parish priest data - each priest has 4 lines: Title+Name, Role, Parish, Location
  const parsePriestData = (priestText: string) => {
    if (!priestText || priestText === "N/A") return [];

    const lines = priestText.split("\n").map(line => line.trim()).filter(line => line);
    const priests = [];

    // Group every 4 lines as one priest
    for (let i = 0; i < lines.length; i += 4) {
      if (lines[i]) {
        priests.push({
          fullName: lines[i] || "", // Rev. Fr. Name
          role: lines[i + 1] || "", // Parish Priest / Parochial Vicar
          parish: lines[i + 2] || "", // Parish Name
          location: lines[i + 3] || "", // Location
        });
      }
    }

    return priests;
  };

  const priestsList = parsePriestData(parish.parishPriest || "");

  const openLocationInMaps = async () => {
    if (!parish.location || parish.location === "N/A") {
      Alert.alert("Location Not Available", "No location information is available for this parish.");
      return;
    }

    try {
      // Create destination combining parish name and location for better accuracy
      const destination = `${parish.name}, ${parish.location}`;
      const encodedDestination = encodeURIComponent(destination);

      // Use Google Maps directions URL with travelmode=driving from current location
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
      Alert.alert("Error", "Failed to open location in maps");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#F8FAFC", "#EFF6FF", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1" edges={["top"]}>
          {/* Header - Parish Icon, Label, and Name */}
          <View className="px-6 pt-4 pb-6 border-b border-gray-100">
            <View className="items-center">
              {/* Parish Icon */}
              <View className="w-20 h-20 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-3">
                <Image
                  source={require("../../assets/Parish-1764828819730.jpeg")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>

              {/* "Parish" Label */}
              <Text className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                Parish
              </Text>

              {/* Parish Name - Large and Prominent */}
              <Text className="text-2xl font-bold text-blue-700 text-center px-4">
                {parish.name}
              </Text>

              {/* Vicariate below name */}
              {parish.vicariate && parish.vicariate !== "N/A" && (
                <Text className="text-sm text-gray-500 text-center mt-2">
                  {parish.vicariate}
                </Text>
              )}
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
                {/* Parish Priest */}
                {parish.parishPriest && parish.parishPriest !== "N/A" && (
                  <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-2">
                      <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center">
                        <Ionicons name="person" size={16} color="#9333EA" />
                      </View>
                      <Text className="text-xs font-semibold text-gray-500 ml-2 uppercase tracking-wide">
                        Parish Priest
                      </Text>
                    </View>
                    <Text className="text-base font-semibold text-gray-800 leading-5">
                      {parish.parishPriest}
                    </Text>
                  </View>
                )}

                {/* Contact */}
                {parish.contact && parish.contact !== "N/A" && (
                  <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-2">
                      <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                        <Ionicons name="call" size={16} color="#10B981" />
                      </View>
                      <Text className="text-xs font-semibold text-gray-500 ml-2 uppercase tracking-wide">
                        Contact
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-700 leading-5">
                      {parish.contact}
                    </Text>
                  </View>
                )}

                {/* Email */}
                {parish.email && parish.email !== "N/A" && (
                  <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-2">
                      <View className="w-8 h-8 bg-indigo-100 rounded-full items-center justify-center">
                        <Ionicons name="mail" size={16} color="#6366F1" />
                      </View>
                      <Text className="text-xs font-semibold text-gray-500 ml-2 uppercase tracking-wide">
                        Email
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-700 leading-5">
                      {parish.email}
                    </Text>
                  </View>
                )}

                {/* Location */}
                {parish.location && (
                  parish.location !== "N/A" ? (
                    <Pressable onPress={openLocationInMaps}>
                      {({ pressed }) => (
                        <View
                          className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                          style={{ opacity: pressed ? 0.7 : 1 }}
                        >
                          <View className="flex-row items-center mb-2">
                            <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center">
                              <Ionicons name="navigate" size={16} color="#EF4444" />
                            </View>
                            <Text className="text-xs font-semibold text-gray-500 ml-2 uppercase tracking-wide flex-1">
                              Location
                            </Text>
                            <View className="flex-row items-center">
                              <Text className="text-xs text-blue-600 font-semibold mr-1">Directions</Text>
                              <Ionicons name="arrow-forward" size={14} color="#3B82F6" />
                            </View>
                          </View>
                          <Text className="text-sm text-gray-700 leading-5">
                            {parish.location}
                          </Text>
                          <Text className="text-xs text-gray-400 mt-1">
                            Tap for directions
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  ) : (
                    <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                      <View className="flex-row items-center mb-2">
                        <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center">
                          <Ionicons name="location" size={16} color="#EF4444" />
                        </View>
                        <Text className="text-xs font-semibold text-gray-500 ml-2 uppercase tracking-wide">
                          Location
                        </Text>
                      </View>
                      <Text className="text-sm text-gray-700 leading-5">
                        {parish.location}
                      </Text>
                    </View>
                  )
                )}

                {/* History */}
                {parish.history && parish.history !== "N/A" && (
                  <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-2">
                      <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center">
                        <Ionicons name="book" size={16} color="#F59E0B" />
                      </View>
                      <Text className="text-xs font-semibold text-gray-500 ml-2 uppercase tracking-wide">
                        Brief Parish History
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600 leading-6">
                      {parish.history}
                    </Text>
                  </View>
                )}

                {/* Fiesta Date */}
                {parish.fiestaDate && parish.fiestaDate !== "N/A" && (
                  <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-2">
                      <View className="w-8 h-8 bg-pink-100 rounded-full items-center justify-center">
                        <Ionicons name="calendar" size={16} color="#EC4899" />
                      </View>
                      <Text className="text-xs font-semibold text-gray-500 ml-2 uppercase tracking-wide">
                        Fiesta Date
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-700 leading-5">
                      {parish.fiestaDate}
                    </Text>
                  </View>
                )}

                {/* Empty state if no details */}
                {!parish.contact && !parish.email && !parish.location && !parish.vicariate && !parish.history && !parish.fiestaDate && (
                  <View className="bg-gray-50 rounded-3xl p-8 items-center">
                    <Ionicons name="information-circle-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-600 text-center mt-4">
                      No additional details available for this parish
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
