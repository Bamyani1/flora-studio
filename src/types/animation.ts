export interface AnimationPreset {
  from?: Record<string, unknown>;
  to?: Record<string, unknown>;
  scrollTrigger?: ScrollTriggerConfig;
}

export interface ScrollTriggerConfig {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  toggleActions?: string;
  markers?: boolean;
}
