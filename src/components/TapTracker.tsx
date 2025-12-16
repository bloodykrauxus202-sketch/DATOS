import React, { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSponsorStore } from "../state/sponsorStore";
import { fetchAllSponsorImages, fetchAllVideoUrls, SponsorDetails, VideoDetails } from "../api/googleSheets";
import SponsorModal from "./SponsorModal";
import VideoModal from "./VideoModal";

interface TapTrackerProps {
  children: React.ReactNode;
}

export default function TapTracker({ children }: TapTrackerProps) {
  const [sponsors, setSponsors] = useState<SponsorDetails[]>([]);
  const [videos, setVideos] = useState<VideoDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastShownSponsorIndex = useRef<number>(-1);
  const lastShownVideoIndex = useRef<number>(-1);

  const tapCount = useSponsorStore((s) => s.tapCount);
  const targetTaps = useSponsorStore((s) => s.targetTaps);
  const incrementTap = useSponsorStore((s) => s.incrementTap);
  const showModal = useSponsorStore((s) => s.showModal);
  const showVideo = useSponsorStore((s) => s.showVideo);
  const updateTargetTaps = useSponsorStore((s) => s.updateTargetTaps);

  // Fetch sponsor images and videos on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sponsorData, videoData] = await Promise.all([
          fetchAllSponsorImages().catch(() => []),
          fetchAllVideoUrls().catch(() => []),
        ]);

        console.log(`Loaded ${sponsorData.length} sponsor images`);
        console.log(`Loaded ${videoData.length} video URLs`);

        setSponsors(sponsorData);
        setVideos(videoData);
      } catch (error) {
        console.error("Failed to load sponsor/video data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Check if we should show video (every 15 taps)
  useEffect(() => {
    if (!isLoading && videos.length > 0 && tapCount > 0 && tapCount % 15 === 0) {
      console.log(`Tap count is ${tapCount}. Showing video (every 15 taps).`);

      // Pick random video, avoiding the last shown one if possible
      let randomIndex: number;
      if (videos.length === 1) {
        randomIndex = 0;
      } else {
        // Generate random index different from last shown
        do {
          randomIndex = Math.floor(Math.random() * videos.length);
        } while (randomIndex === lastShownVideoIndex.current && videos.length > 1);
      }

      lastShownVideoIndex.current = randomIndex;
      const randomVideo = videos[randomIndex];

      console.log(`Selected video index: ${randomIndex}, video: ${randomVideo.videoUrl}`);

      // Show video modal
      showVideo(randomVideo.videoUrl);
    }
  }, [tapCount, videos, isLoading, showVideo]);

  // Check if we should show sponsor ad (every 5-10 taps, but not on multiples of 15)
  useEffect(() => {
    if (!isLoading && sponsors.length > 0 && tapCount >= targetTaps && tapCount % 15 !== 0) {
      console.log(`Tap count reached ${tapCount}/${targetTaps}. Showing sponsor ad.`);

      // Pick random sponsor, avoiding the last shown one if possible
      let randomIndex: number;
      if (sponsors.length === 1) {
        randomIndex = 0;
      } else {
        // Generate random index different from last shown
        do {
          randomIndex = Math.floor(Math.random() * sponsors.length);
        } while (randomIndex === lastShownSponsorIndex.current && sponsors.length > 1);
      }

      lastShownSponsorIndex.current = randomIndex;
      const randomSponsor = sponsors[randomIndex];

      console.log(`Selected sponsor index: ${randomIndex}, image: ${randomSponsor.imageUrl}`);

      // Show modal with random sponsor image
      showModal(randomSponsor.imageUrl);

      // Update target to next sponsor showing (keep counting towards 15)
      const newTarget = tapCount + Math.floor(Math.random() * 6) + 5;
      console.log(`Next sponsor ad at tap: ${newTarget}`);
      updateTargetTaps(newTarget);
    }
  }, [tapCount, targetTaps, sponsors, isLoading, showModal, updateTargetTaps]);

  // Create a tap gesture that doesn't interfere with child components
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      incrementTap();
      console.log(`Tap detected. Count: ${tapCount + 1}`);
    })
    .shouldCancelWhenOutside(false)
    .runOnJS(true);

  return (
    <>
      <GestureDetector gesture={tapGesture}>
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </GestureDetector>
      <SponsorModal />
      <VideoModal />
    </>
  );
}
