import React from "react";
import { View, Modal, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSponsorStore } from "../state/sponsorStore";

export default function SponsorModal() {
  const showSponsorModal = useSponsorStore((s) => s.showSponsorModal);
  const currentSponsorImage = useSponsorStore((s) => s.currentSponsorImage);
  const hideModal = useSponsorStore((s) => s.hideModal);

  if (!showSponsorModal || !currentSponsorImage) {
    return null;
  }

  return (
    <Modal visible={showSponsorModal} transparent={false} animationType="fade">
      <View className="flex-1 bg-black">
        {/* Close button - positioned at top right */}
        <Pressable
          onPress={hideModal}
          className="absolute top-12 right-6 z-50 bg-white/90 rounded-full p-3 shadow-lg active:scale-95"
          style={{ elevation: 10 }}
        >
          <Ionicons name="close" size={28} color="#000" />
        </Pressable>

        {/* Fullscreen sponsor image */}
        <View className="flex-1">
          <Image
            source={{ uri: currentSponsorImage }}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
            transition={300}
          />
        </View>
      </View>
    </Modal>
  );
}
