import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { fetchAllSchoolDetails, SchoolDetails } from "../api/googleSheets";
import NavigationBar from "../components/NavigationBar";

type Props = NativeStackScreenProps<RootStackParamList, "Schools">;

export default function SchoolsScreen({ navigation }: Props) {
  const [schools, setSchools] = useState<SchoolDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      const schoolData = await fetchAllSchoolDetails();
      setSchools(schoolData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load schools");
      console.error("Error loading schools:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolPress = (school: SchoolDetails) => {
    navigation.navigate("SchoolDetail", { school });
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
                  source={require("../../assets/Schools-1764828828863.jpeg")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  Schools
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Catholic schools within the Diocese of Tagum
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
                  <Text className="text-gray-600 mt-4">Loading schools...</Text>
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
                    onPress={loadSchools}
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
                    Loading schools from Google Sheets. Check your internet connection.
                  </Text>
                </View>
              )}

              {!loading && !error && schools.length === 0 && (
                <View className="bg-gray-50 rounded-3xl p-6 items-center">
                  <Ionicons name="search" size={48} color="#9CA3AF" />
                  <Text className="text-gray-600 text-center mt-4">
                    No schools found
                  </Text>
                </View>
              )}

              {!loading && !error && schools.length > 0 && (
                <View>
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    {schools.length} {schools.length === 1 ? "School" : "Schools"}
                  </Text>
                  {schools.map((school, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSchoolPress(school)}
                      className="mb-3"
                    >
                      {({ pressed }) => (
                        <View
                          className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                          style={{
                            opacity: pressed ? 0.7 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                          }}
                        >
                          <View className="flex-row items-center justify-between">
                            <View className="flex-1 flex-row items-center">
                              <Ionicons name="school" size={20} color="#6366F1" />
                              <View className="flex-1 ml-3">
                                <Text className="text-base font-semibold text-gray-900">
                                  {school.name}
                                </Text>
                                {school.location !== "N/A" && (
                                  <Text className="text-xs text-gray-500 mt-1">
                                    {school.location}
                                  </Text>
                                )}
                              </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                          </View>
                        </View>
                      )}
                    </Pressable>
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
