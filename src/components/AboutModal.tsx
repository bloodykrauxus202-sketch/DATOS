import React from "react";
import { View, Text, Pressable, ScrollView, Modal } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AboutModal({ visible, onClose }: AboutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        {/* Blurred background */}
        <BlurView intensity={50} tint="dark" style={{ flex: 1 }}>
          <Pressable
            className="flex-1 items-center justify-center px-6 py-12"
            onPress={onClose}
          >
            {/* Content Card */}
            <Pressable
              className="bg-white rounded-3xl max-w-2xl w-full"
              onPress={(e) => e.stopPropagation()}
            >
              <LinearGradient
                colors={["#1E40AF", "#3B82F6", "#60A5FA"]}
                style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
              >
                <View className="p-6 items-center">
                  <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4">
                    <Ionicons name="information-circle" size={48} color="#3B82F6" />
                  </View>
                  <Text className="text-2xl font-bold text-white text-center mb-2">
                    Roman Catholic Diocese of Tagum
                  </Text>
                  <Text className="text-sm font-semibold text-blue-100 text-center uppercase tracking-wide">
                    About
                  </Text>
                </View>
              </LinearGradient>

              <ScrollView
                className="max-h-96"
                showsVerticalScrollIndicator={false}
              >
                <View className="p-6">
                  {/* Description */}
                  <Text className="text-base text-gray-700 leading-7 mb-6">
                    The Diocese of Tagum is a vibrant Catholic community located in Davao del Norte and Davao de Oro, Philippines. Established on January 31, 1980, the diocese continues its mission of evangelization and service through 13 vicariates, 57 parishes, and more than 2,400 Basic Ecclesial Communities (BECs). Guided by its clergy, religious, and lay faithful, the diocese promotes unity, compassion, and faith through pastoral care, education, and social action.
                  </Text>

                  {/* Bishops Section */}
                  <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">
                      Bishops of the Diocese of Tagum
                    </Text>

                    {/* Current Bishop */}
                    <View className="bg-blue-50 rounded-2xl p-4 mb-3 border border-blue-100">
                      <Text className="text-sm font-semibold text-blue-600 mb-1">
                        2018 – Present
                      </Text>
                      <Text className="text-base font-bold text-gray-900">
                        Most Rev. Medil Aseo, D.D.
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        4th Bishop of Tagum
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        Appointed April 7, 2018; Installed June 20, 2018
                      </Text>
                    </View>

                    {/* Previous Bishops */}
                    <View className="bg-gray-50 rounded-2xl p-4 mb-3">
                      <Text className="text-sm font-semibold text-gray-600 mb-1">
                        1986 – 2018
                      </Text>
                      <Text className="text-base font-bold text-gray-900">
                        Most Rev. Wilfredo D. Manlapaz, D.D.
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        3rd Bishop of Tagum; retired in 2018
                      </Text>
                    </View>

                    <View className="bg-gray-50 rounded-2xl p-4 mb-3">
                      <Text className="text-sm font-semibold text-gray-600 mb-1">
                        1980 – 1985
                      </Text>
                      <Text className="text-base font-bold text-gray-900">
                        Most Rev. Pedro R. Dean, D.D.
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        2nd Bishop of Tagum; later appointed Archbishop of Palo
                      </Text>
                    </View>

                    <View className="bg-gray-50 rounded-2xl p-4">
                      <Text className="text-sm font-semibold text-gray-600 mb-1">
                        1962 – 1980
                      </Text>
                      <Text className="text-base font-bold text-gray-900">
                        Most Rev. Joseph W. Regan, M.M., D.D.
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        1st Prelate of Tagum; American Maryknoll missionary bishop
                      </Text>
                    </View>
                  </View>

                  {/* Chancery Section */}
                  <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                    <Text className="text-lg font-bold text-gray-900 mb-4">
                      Chancery / Obispado
                    </Text>
                    <Text className="text-sm text-gray-600 mb-3">
                      (Bishop&apos;s Residence)
                    </Text>

                    <View className="space-y-3">
                      {/* Address */}
                      <View className="flex-row">
                        <Ionicons name="location" size={20} color="#3B82F6" />
                        <View className="flex-1 ml-3">
                          <Text className="text-sm font-semibold text-gray-700">
                            Address
                          </Text>
                          <Text className="text-sm text-gray-600 leading-6">
                            Clergy Development Center{"\n"}
                            Seminary Drive, Tagum City{"\n"}
                            Davao del Norte, 8100{"\n"}
                            Philippines
                          </Text>
                        </View>
                      </View>

                      {/* Phone */}
                      <View className="flex-row items-start">
                        <Ionicons name="call" size={20} color="#10B981" />
                        <View className="flex-1 ml-3">
                          <Text className="text-sm font-semibold text-gray-700">
                            Telephone
                          </Text>
                          <Text className="text-sm text-gray-600">
                            📞 (084) 308-0648 / 655-6499{"\n"}
                            📠 Fax: (084) 655-6498
                          </Text>
                        </View>
                      </View>

                      {/* Email */}
                      <View className="flex-row items-start">
                        <Ionicons name="mail" size={20} color="#6366F1" />
                        <View className="flex-1 ml-3">
                          <Text className="text-sm font-semibold text-gray-700">
                            Email
                          </Text>
                          <Text className="text-sm text-gray-600">
                            ✉️ dioceseoftagum@yahoo.com
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Close Button */}
              <View className="p-6 border-t border-gray-200">
                <Pressable
                  onPress={onClose}
                  className="bg-blue-600 py-4 rounded-xl"
                >
                  {({ pressed }) => (
                    <Text
                      className="text-white font-semibold text-center text-base"
                      style={{ opacity: pressed ? 0.8 : 1 }}
                    >
                      Close
                    </Text>
                  )}
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </BlurView>
      </View>
    </Modal>
  );
}
