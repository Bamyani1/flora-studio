export const easings = {
  smooth: "power3.out",
  smoothInOut: "power2.inOut",
  sharp: "expo.out",
  sharpCirc: "circ.out",
  entrance: "power3.out",
  exit: "power2.in",
  stateChange: "power2.inOut",
} as const;

export type EasingToken = keyof typeof easings;
