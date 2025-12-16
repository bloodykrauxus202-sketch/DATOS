import React, { useState, useCallback, useEffect } from "react";
import { View, Modal, Pressable, ActivityIndicator, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useSponsorStore } from "../state/sponsorStore";

/**
 * Extract Google Drive file ID from various URL formats
 */
function extractGoogleDriveFileId(url: string): string | null {
  // Match patterns like:
  // https://drive.google.com/file/d/FILE_ID/view
  // https://drive.google.com/file/d/FILE_ID/preview
  // https://www.googleapis.com/drive/v3/files/FILE_ID?alt=media
  const patterns = [
    /drive\.google\.com\/file\/d\/([^/]+)/,
    /googleapis\.com\/drive\/v3\/files\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeVideoId(url: string): string | null {
  // Match patterns like:
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/shorts/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Get the proper embed URL for video playback
 */
function getEmbedUrl(url: string): string {
  // Check if it's a YouTube URL
  const youtubeId = extractYouTubeVideoId(url);
  if (youtubeId) {
    // Use YouTube embed URL with autoplay
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1&controls=1`;
  }

  // Check if it's a Google Drive URL
  const driveFileId = extractGoogleDriveFileId(url);
  if (driveFileId) {
    // Use Google Drive preview URL with autoplay
    return `https://drive.google.com/file/d/${driveFileId}/preview?autoplay=1`;
  }

  // Return original URL with autoplay parameter appended
  return url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;
}

/**
 * Check if the URL is a Google Drive or YouTube URL
 */
function isEmbedableUrl(url: string): boolean {
  return url.includes("drive.google.com") ||
         url.includes("googleapis.com/drive") ||
         url.includes("youtube.com") ||
         url.includes("youtu.be");
}

export default function VideoModal() {
  const showVideoModal = useSponsorStore((s) => s.showVideoModal);
  const currentVideoUrl = useSponsorStore((s) => s.currentVideoUrl);
  const hideVideoModal = useSponsorStore((s) => s.hideVideoModal);
  const [isLoading, setIsLoading] = useState(true);
  const [canSkip, setCanSkip] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [hasError, setHasError] = useState(false);

  // Get the proper URL for playback
  const videoUrl = currentVideoUrl ? getEmbedUrl(currentVideoUrl) : "";

  // Countdown timer for skip button
  useEffect(() => {
    if (showVideoModal) {
      setCountdown(10);
      setCanSkip(false);
      setHasError(false);
      setIsLoading(true);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showVideoModal]);

  const handleClose = useCallback(() => {
    setIsLoading(true);
    setCanSkip(false);
    setCountdown(10);
    setHasError(false);
    hideVideoModal();
  }, [hideVideoModal]);

  const handleWebViewLoad = useCallback(() => {
    console.log("Video WebView loaded successfully");
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleWebViewError = useCallback(() => {
    console.log("Video WebView failed to load");
    setIsLoading(false);
    setHasError(true);
  }, []);

  if (!showVideoModal || !currentVideoUrl) {
    return null;
  }

  // HTML wrapper for better video display with autoplay
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          width: 100%;
          height: 100%;
          background: #000;
          overflow: hidden;
        }
        iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
    </head>
    <body>
      <iframe
        src="${videoUrl}"
        allow="autoplay; fullscreen; encrypted-media; accelerometer; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        frameborder="0"
        playsinline
      ></iframe>
    </body>
    </html>
  `;

  return (
    <Modal visible={showVideoModal} transparent={false} animationType="fade">
      <View className="flex-1 bg-black">
        {/* Skip button - appears after 10 seconds */}
        <Pressable
          onPress={handleClose}
          disabled={!canSkip}
          className="absolute top-12 right-6 z-50 rounded-full p-3 shadow-lg active:scale-95"
          style={{
            elevation: 10,
            backgroundColor: canSkip ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.3)"
          }}
        >
          {canSkip ? (
            <View className="flex-row items-center gap-2">
              <Text className="text-black font-semibold text-base">Skip</Text>
              <Ionicons name="close" size={24} color="#000" />
            </View>
          ) : (
            <View className="flex-row items-center gap-2">
              <Text className="text-white font-semibold text-base">{countdown}s</Text>
              <Ionicons name="time-outline" size={24} color="#fff" />
            </View>
          )}
        </Pressable>

        {/* Loading indicator */}
        {isLoading && !hasError && (
          <View className="absolute inset-0 items-center justify-center z-10">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white mt-4">Loading video...</Text>
          </View>
        )}

        {/* Error message */}
        {hasError && (
          <View className="absolute inset-0 items-center justify-center z-10">
            <Ionicons name="alert-circle" size={64} color="#ff6b6b" />
            <Text className="text-white mt-4 text-center px-8">
              Unable to play video. Please check your internet connection.
            </Text>
            <Text className="text-gray-400 mt-2 text-center px-8 text-sm">
              Please wait for the skip button to close.
            </Text>
          </View>
        )}

        {/* Video WebView */}
        <View className="flex-1">
          <WebView
            source={{ html: htmlContent }}
            style={{ flex: 1, backgroundColor: "#000" }}
            onLoad={handleWebViewLoad}
            onError={handleWebViewError}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            scrollEnabled={false}
            bounces={false}
            allowsFullscreenVideo={true}
          />
        </View>
      </View>
    </Modal>
  );
}
