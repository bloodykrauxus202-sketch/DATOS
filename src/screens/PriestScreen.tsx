import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { fetchAllPriestDetails, PriestDetails, fetchSheetData } from "../api/googleSheets";
import NavigationBar from "../components/NavigationBar";

// Debug function to log raw Priests sheet data
async function debugPriestsSheet() {
  try {
    const data = await fetchSheetData("Priests!A:D");
    console.log("=== RAW PRIESTS SHEET DATA ===");
    console.log("Total rows:", data.length);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const colA = row[0] || "";
      const colB = row[1] || "";
      const colC = row[2] || "";
      const colD = row[3] || "";

      // Detect category rows
      const isCategory = colA && !colB && !colC && !colD;

      if (isCategory) {
        console.log(`\n=== ROW ${i + 1}: CATEGORY === "${colA}"`);
      } else {
        console.log(`ROW ${i + 1}: A="${colA.substring(0, 30)}" | B="${colB.substring(0, 30)}" | C="${colC.substring(0, 30)}" | D="${colD.substring(0, 50)}"`);
      }
    }
    console.log("=== END RAW DATA ===");
  } catch (error) {
    console.error("Debug error:", error);
  }
}

type Props = NativeStackScreenProps<RootStackParamList, "Priest">;

// Group priests by category
interface GroupedPriests {
  [category: string]: PriestDetails[];
}

export default function PriestScreen({ navigation }: Props) {
  const [priests, setPriests] = useState<PriestDetails[]>([]);
  const [groupedPriests, setGroupedPriests] = useState<GroupedPriests>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    debugPriestsSheet(); // Debug: log raw data
    loadPriests();
  }, []);

  const loadPriests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllPriestDetails();
      setPriests(data);

      // Group priests by category
      const grouped: GroupedPriests = {};
      data.forEach(priest => {
        const category = priest.category || "Other";
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(priest);
      });
      setGroupedPriests(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load priests");
      console.error("Error loading priests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriestPress = (priest: PriestDetails) => {
    console.log("Selected priest:", priest);
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
            <View className="flex-row items-center">
              <View className="w-20 h-20 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mr-4">
                <Image
                  source={require("../../assets/Priest-1764828826700.jpeg")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  Clergy
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Clergy directory within the Diocese of Tagum
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
              {loading && (
                <View className="items-center justify-center py-20">
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text className="text-gray-600 mt-4">Loading clergy...</Text>
                </View>
              )}

              {error && (
                <View className="bg-red-50 rounded-3xl p-6 border border-red-200">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="alert-circle" size={24} color="#EF4444" />
                    <Text className="text-lg font-bold text-red-900 ml-2">
                      Error
                    </Text>
                  </View>
                  <Text className="text-red-800 mb-4 leading-6">{error}</Text>
                  <Pressable
                    onPress={loadPriests}
                    className="bg-red-600 py-3 px-6 rounded-xl"
                  >
                    {({ pressed }) => (
                      <Text
                        className="text-white font-semibold text-center"
                        style={{ opacity: pressed ? 0.8 : 1 }}
                      >
                        Try Again
                      </Text>
                    )}
                  </Pressable>
                  <Text className="text-xs text-gray-500 mt-4 text-center">
                    Make sure you have added your Google Sheets API key in the ENV tab
                  </Text>
                </View>
              )}

              {!loading && !error && priests.length === 0 && (
                <View className="bg-gray-50 rounded-3xl p-6 items-center">
                  <Ionicons name="search" size={48} color="#9CA3AF" />
                  <Text className="text-gray-600 text-center mt-4">
                    No clergy found
                  </Text>
                </View>
              )}

              {!loading && !error && priests.length > 0 && (
                <View>
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    {priests.length} {priests.length === 1 ? "Clergy Member" : "Clergy Members"}
                  </Text>

                  {/* Render priests grouped by category */}
                  {Object.keys(groupedPriests).map((category) => (
                    <View key={category} className="mb-6">
                      {/* Category Header */}
                      <View className="bg-blue-50 rounded-xl px-4 py-3 mb-3 border-l-4 border-blue-500">
                        <Text className="text-base font-bold text-blue-900">
                          {category}
                        </Text>
                        <Text className="text-xs text-blue-700 mt-1">
                          {groupedPriests[category].length} {groupedPriests[category].length === 1 ? "member" : "members"}
                        </Text>
                      </View>

                      {/* Priests in this category */}
                      {groupedPriests[category].map((priest, index) => (
                        <Pressable
                          key={`${category}-${index}`}
                          onPress={() => handlePriestPress(priest)}
                          className="mb-3"
                        >
                          {({ pressed }) => (
                            <View
                              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
                              style={{
                                opacity: pressed ? 0.7 : 1,
                                transform: [{ scale: pressed ? 0.98 : 1 }],
                              }}
                            >
                              {/* PRIEST NAME - Large and Prominent */}
                              <Text className="text-xl font-bold text-gray-900 mb-3">
                                {priest.name}
                              </Text>

                              {/* Details below the name */}
                              <View className="space-y-2">
                                {/* Role */}
                                {priest.role !== "N/A" && priest.role && (
                                  <View className="flex-row items-center">
                                    <Ionicons name="briefcase-outline" size={16} color="#3B82F6" />
                                    <Text className="text-sm text-gray-700 ml-2 font-medium">
                                      {priest.role}
                                    </Text>
                                  </View>
                                )}

                                {/* Assignment */}
                                {priest.assignment !== "N/A" && priest.assignment && (
                                  <View className="flex-row items-center mt-2">
                                    <Ionicons name="business-outline" size={16} color="#6B7280" />
                                    <Text className="text-sm text-gray-600 ml-2 flex-1">
                                      {priest.assignment}
                                    </Text>
                                  </View>
                                )}

                                {/* Location */}
                                {priest.location !== "N/A" && priest.location && (
                                  <View className="flex-row items-center mt-2">
                                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                                    <Text className="text-sm text-gray-600 ml-2 flex-1">
                                      {priest.location}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          )}
                        </Pressable>
                      ))}
                    </View>
                  ))}
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
