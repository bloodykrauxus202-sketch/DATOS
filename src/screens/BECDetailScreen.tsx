import React from "react";
import { View, Text, Pressable, ScrollView, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { BECDetails } from "../api/googleSheets";
import NavigationBar from "../components/NavigationBar";

type Props = NativeStackScreenProps<RootStackParamList, "BECDetail">;

export default function BECDetailScreen({ route, navigation }: Props) {
  const { bec } = route.params;

  const openLocationInMaps = async () => {
    if (!bec.location || bec.location === "N/A") {
      Alert.alert("Location Not Available", "No location information is available for this BEC.");
      return;
    }

    try {
      // Create destination combining BEC name and location for better accuracy
      const destination = `${bec.name}, ${bec.location}`;
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
          {/* Header */}
          <View className="px-6 pt-4 pb-6 border-b border-gray-100">
            {/* GKK Name - Centered */}
            <View className="items-center">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="home" size={32} color="#10B981" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 text-center">
                {bec.name}
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
                {/* Parish */}
                {bec.parish && bec.parish !== "N/A" && (
                  <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                        <Ionicons name="business" size={20} color="#3B82F6" />
                      </View>
                      <Text className="text-sm font-semibold text-gray-500 ml-3 uppercase tracking-wide">
                        Parish
                      </Text>
                    </View>
                    <Text className="text-lg font-semibold text-gray-900 leading-6">
                      {bec.parish}
                    </Text>
                  </View>
                )}

                {/* Location */}
                {bec.location && (
                  bec.location !== "N/A" ? (
                    <Pressable onPress={openLocationInMaps}>
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
                              Location
                            </Text>
                            <View className="flex-row items-center">
                              <Text className="text-xs text-blue-600 font-semibold mr-1">Get Directions</Text>
                              <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
                            </View>
                          </View>
                          <Text className="text-lg font-semibold text-gray-900 leading-6">
                            {bec.location}
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
                          Location
                        </Text>
                      </View>
                      <Text className="text-lg font-semibold text-gray-900 leading-6">
                        {bec.location}
                      </Text>
                    </View>
                  )
                )}

                {/* BEC President */}
                {bec.president && bec.president !== "N/A" && (
                  <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                        <Ionicons name="person" size={20} color="#9333EA" />
                      </View>
                      <Text className="text-sm font-semibold text-gray-500 ml-3 uppercase tracking-wide">
                        BEC President
                      </Text>
                    </View>
                    <Text className="text-lg font-semibold text-gray-900 leading-6">
                      {bec.president}
                    </Text>
                  </View>
                )}

                {/* Contact */}
                {bec.contact && bec.contact !== "N/A" && (
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
                      {bec.contact}
                    </Text>
                  </View>
                )}

                {/* History */}
                {bec.history && bec.history !== "N/A" && (
                  <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center">
                        <Ionicons name="book" size={20} color="#F59E0B" />
                      </View>
                      <Text className="text-sm font-semibold text-gray-500 ml-3 uppercase tracking-wide">
                        Brief History
                      </Text>
                    </View>
                    <Text className="text-base text-gray-700 leading-7">
                      {bec.history}
                    </Text>
                  </View>
                )}

                {/* Fiesta Date */}
                {bec.fiestaDate && bec.fiestaDate !== "N/A" && (
                  <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center">
                        <Ionicons name="calendar" size={20} color="#EC4899" />
                      </View>
                      <Text className="text-sm font-semibold text-gray-500 ml-3 uppercase tracking-wide">
                        Fiesta Date
                      </Text>
                    </View>
                    <Text className="text-lg font-semibold text-gray-900 leading-6">
                      {bec.fiestaDate}
                    </Text>
                  </View>
                )}

                {/* Empty state if no details */}
                {!bec.parish && !bec.location && !bec.president && !bec.contact && !bec.history && !bec.fiestaDate && (
                  <View className="bg-gray-50 rounded-3xl p-8 items-center">
                    <Ionicons name="information-circle-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-600 text-center mt-4">
                      No additional details available for this BEC
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
