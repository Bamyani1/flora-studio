import { easings } from "./easings";

// --------------------------------------------------
// fadeUp — Default entrance for general elements
// --------------------------------------------------
export const fadeUp = {
  from: { y: 30, autoAlpha: 0 },
  to: { y: 0, autoAlpha: 1, duration: 0.8, ease: easings.smooth },
  scrollTrigger: { start: "top 85%", end: "top 20%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// textRevealLines — Masked line-by-line reveal via SplitText
// --------------------------------------------------
export const textRevealLines = {
  splitConfig: { type: "lines", mask: "lines", autoSplit: true },
  from: { yPercent: 100 },
  to: { yPercent: 0, duration: 1.0, ease: easings.smooth, stagger: 0.12 },
  scrollTrigger: { start: "top 85%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// textRevealWords — Word-by-word opacity scrub (for scroll-driven narrative)
// --------------------------------------------------
export const textRevealWords = {
  splitConfig: { type: "words" },
  from: { opacity: 0.15 },
  to: { opacity: 1, stagger: 0.05 },
  scrollTrigger: { start: "top 80%", end: "bottom 20%", scrub: 1 },
};

// --------------------------------------------------
// clipRevealUp — Clip-path wipe from bottom
// --------------------------------------------------
export const clipRevealUp = {
  from: { clipPath: "inset(100% 0% 0% 0%)" },
  to: { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: easings.smooth },
  scrollTrigger: { start: "top 85%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// clipRevealLeft — Clip-path wipe from left
// --------------------------------------------------
export const clipRevealLeft = {
  from: { clipPath: "inset(0% 100% 0% 0%)" },
  to: { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: easings.smooth },
  scrollTrigger: { start: "top 85%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// imageReveal — Two-part: colored overlay slides away, image scales down
// --------------------------------------------------
export const imageReveal = {
  overlay: {
    from: { scaleX: 1, transformOrigin: "left center" },
    to: { scaleX: 0, transformOrigin: "right center", duration: 0.8, ease: easings.smoothInOut },
  },
  image: {
    from: { scale: 1.3 },
    to: { scale: 1, duration: 1.2, ease: easings.smooth },
  },
  overlayColor: "#7B93B0",
  scrollTrigger: { start: "top 80%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// imageLoadReveal — Blur-up lazy load entrance
// --------------------------------------------------
export const imageLoadReveal = {
  cssTransition: "filter 0.6s var(--ease-out), transform 0.6s var(--ease-out)",
  loadedStyle: { filter: "blur(0)", transform: "scale(1)" },
  placeholderStyle: { filter: "blur(20px)", transform: "scale(1.1)" },
};

// --------------------------------------------------
// parallaxLayer — Scroll-linked Y translation
// --------------------------------------------------
export const parallaxLayer = (speed: number = 0.15) => ({
  to: { yPercent: speed * 100, ease: "none" },
  scrollTrigger: { start: "top bottom", end: "bottom top", scrub: true },
});

// --------------------------------------------------
// magneticPull — Cursor proximity detection for buttons
// --------------------------------------------------
export const magneticPull = {
  proximityRadius: 100,
  strength: 0.3,
  ease: "power3.out",
  returnDuration: 0.5,
  returnEase: "elastic.out(1, 0.3)",
};

// --------------------------------------------------
// staggerGrid — Staggered entrance for card grids
// --------------------------------------------------
export const staggerGrid = {
  from: { y: 40, autoAlpha: 0 },
  to: { y: 0, autoAlpha: 1, duration: 0.8, ease: easings.smooth, stagger: 0.1 },
  scrollTrigger: { start: "top 85%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// marqueeLoop — Infinite horizontal scroll
// --------------------------------------------------
export const marqueeLoop = {
  duration: 20,
  ease: "none",
  repeat: -1,
};

// --------------------------------------------------
// navOverlayOpen — Full-screen navigation entrance
// --------------------------------------------------
export const navOverlayOpen = {
  backdrop: { from: { autoAlpha: 0 }, to: { autoAlpha: 1, duration: 0.4, ease: easings.smooth } },
  menuItems: {
    splitConfig: { type: "lines", mask: "lines" },
    from: { yPercent: 100 },
    to: { yPercent: 0, duration: 0.8, ease: easings.smooth, stagger: 0.08 },
    delay: 0.2,
  },
};

// --------------------------------------------------
// navOverlayClose — Reverse of open
// --------------------------------------------------
export const navOverlayClose = {
  menuItems: {
    to: { yPercent: -100, duration: 0.5, ease: easings.smoothInOut, stagger: 0.04 },
  },
  backdrop: { to: { autoAlpha: 0, duration: 0.3, ease: easings.smoothInOut, delay: 0.2 } },
};

// --------------------------------------------------
// scrollIndicatorPulse — Vertical "Scroll" text with animated line
// --------------------------------------------------
export const scrollIndicatorPulse = {
  line: {
    from: { scaleY: 0, transformOrigin: "top center" },
    to: {
      scaleY: 1,
      duration: 0.8,
      ease: easings.smoothInOut,
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.5,
    },
  },
  text: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.6, ease: easings.smooth, delay: 0.5 },
  },
};

// --------------------------------------------------
// pageTransitionLeave — Overlay wipe exit
// --------------------------------------------------
export const pageTransitionLeave = {
  overlay: {
    from: { scaleX: 0, transformOrigin: "left center" },
    to: { scaleX: 1, duration: 0.5, ease: easings.smoothInOut },
  },
  content: {
    to: { autoAlpha: 0, y: -20, duration: 0.3, ease: easings.smooth },
  },
  totalDuration: 0.5,
};

// --------------------------------------------------
// pageTransitionEnter — Overlay wipe reveal + content entrance
// --------------------------------------------------
export const pageTransitionEnter = {
  overlay: {
    from: { scaleX: 1, transformOrigin: "right center" },
    to: { scaleX: 0, duration: 0.5, ease: easings.smoothInOut, delay: 0.1 },
  },
  totalDuration: 0.6,
};

// --------------------------------------------------
// sharedElementMorph — GSAP Flip for Work → Album transition
// --------------------------------------------------
export const sharedElementMorph = {
  flipDuration: 0.9,
  flipEase: easings.smoothInOut,
};

// --------------------------------------------------
// heroSequence — Homepage hero load-in choreography (~3.5s)
// --------------------------------------------------
export const heroSequence = {
  steps: [
    {
      target: ".grain-overlay",
      from: { autoAlpha: 0 },
      to: { autoAlpha: 1, duration: 0.3 },
      position: 0,
    },
    {
      target: ".hero-rule",
      from: { scaleX: 0 },
      to: { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
      position: 0.2,
    },
    {
      target: ".hero-title",
      animation: "textRevealLines" as const,
      stagger: 0.12,
      position: 0.5,
    },
    {
      target: ".hero-subtitle-brand",
      from: { autoAlpha: 0, letterSpacing: "0.3em" },
      to: { autoAlpha: 1, letterSpacing: "0.08em", duration: 0.8, ease: "power3.out" },
      position: 1.2,
    },
    {
      target: ".hero-image",
      from: { autoAlpha: 0, scale: 1.15 },
      to: { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power2.out" },
      position: 1.4,
    },
    {
      target: ".hero-tagline",
      from: { autoAlpha: 0, y: 20 },
      to: { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
      position: 2.2,
    },
    {
      target: ".scroll-indicator",
      animation: "scrollIndicatorPulse" as const,
      position: 2.8,
    },
  ],
  totalDuration: 3.5,
};

// --------------------------------------------------
// reducedMotionFallbacks — prefers-reduced-motion: reduce behavior
// --------------------------------------------------
export const reducedMotionFallbacks = {
  fadeUp: "instant autoAlpha: 1, no Y translation",
  textRevealLines: "instant autoAlpha: 1, no SplitText, no mask animation",
  textRevealWords: "all words at full opacity, no scrub",
  clipRevealUp: "instant clip-path: inset(0%), no animation",
  clipRevealLeft: "instant clip-path: inset(0%), no animation",
  imageReveal: "no overlay animation, image visible immediately at scale 1",
  imageLoadReveal: "no blur transition, image appears immediately",
  parallaxLayer: "disabled — no Y translation",
  magneticPull: "disabled — no cursor following",
  staggerGrid: "instant autoAlpha: 1, no stagger delay",
  marqueeLoop: "static, no scroll — content visible in place",
  navOverlayOpen: "instant visibility toggle, no stagger",
  navOverlayClose: "instant visibility toggle",
  scrollIndicatorPulse: "visible but static, no pulse animation",
  pageTransitionLeave: "instant opacity 0, no overlay wipe",
  pageTransitionEnter: "instant opacity 1, no overlay reveal",
  sharedElementMorph: "disabled — standard instant transition",
  heroSequence: "all elements visible immediately, no choreography",
  horizontalScrollGallery: "converted to vertical flowing gallery, no pin",
} as const;
