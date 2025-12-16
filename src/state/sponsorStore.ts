import { create } from "zustand";

interface SponsorState {
  tapCount: number;
  targetTaps: number;
  showSponsorModal: boolean;
  currentSponsorImage: string | null;
  showVideoModal: boolean;
  currentVideoUrl: string | null;
  incrementTap: () => void;
  showModal: (imageUrl: string) => void;
  hideModal: () => void;
  showVideo: (videoUrl: string) => void;
  hideVideoModal: () => void;
  resetTapCount: () => void;
  updateTargetTaps: (newTarget: number) => void;
}

// Generate random number between 5 and 10
const getRandomTargetTaps = () => Math.floor(Math.random() * 6) + 5;

export const useSponsorStore = create<SponsorState>((set) => ({
  tapCount: 0,
  targetTaps: getRandomTargetTaps(),
  showSponsorModal: false,
  currentSponsorImage: null,
  showVideoModal: false,
  currentVideoUrl: null,

  incrementTap: () =>
    set((state) => ({
      tapCount: state.tapCount + 1,
    })),

  showModal: (imageUrl: string) =>
    set({
      showSponsorModal: true,
      currentSponsorImage: imageUrl,
    }),

  hideModal: () =>
    set({
      showSponsorModal: false,
      currentSponsorImage: null,
    }),

  showVideo: (videoUrl: string) =>
    set({
      showVideoModal: true,
      currentVideoUrl: videoUrl,
    }),

  hideVideoModal: () =>
    set({
      showVideoModal: false,
      currentVideoUrl: null,
    }),

  resetTapCount: () =>
    set({
      tapCount: 0,
      targetTaps: getRandomTargetTaps(),
    }),

  updateTargetTaps: (newTarget: number) =>
    set({
      targetTaps: newTarget,
    }),
}));
