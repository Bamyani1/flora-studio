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
  splitConfig: { type: "lines", mask: "lines", autoSplit: true } as const,
  from: { yPercent: 100 },
  to: { yPercent: 0, duration: 1.0, ease: easings.smooth, stagger: 0.12 },
  scrollTrigger: { start: "top 85%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// textRevealWords — Word-by-word opacity scrub (for scroll-driven narrative)
// --------------------------------------------------
export const textRevealWords = {
  splitConfig: { type: "words" } as const,
  from: { opacity: 0.15 },
  to: { opacity: 1, stagger: 0.05 },
  scrollTrigger: { start: "top 80%", end: "bottom 20%", scrub: true },
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
// branchReveal — Clip-path bloom from center outward
// --------------------------------------------------
export const branchReveal = {
  from: { clipPath: "inset(0% 50% 0% 50%)", autoAlpha: 0.3 },
  to: { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 },
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
  overlayColor: "#ff4d00",
  scrollTrigger: { start: "top 80%", toggleActions: "play none none none" },
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
  ease: "back.out(1.4)",
  returnDuration: 0.4,
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
// collectionCardReveal — Orange overlay wipe + clip-path reveal + label fade
// --------------------------------------------------
export const collectionCardReveal = {
  overlay: {
    from: { scaleX: 1, transformOrigin: "left center" },
    to: { scaleX: 0, transformOrigin: "right center", duration: 0.8, ease: easings.smoothInOut },
  },
  image: {
    from: { clipPath: "inset(0% 100% 0% 0%)" },
    to: { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: easings.smooth },
  },
  label: {
    from: { y: 15, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 0.6, ease: easings.smooth },
  },
  stagger: 0.15,
  labelDelay: 0.6,
  overlayColor: "#ff4d00",
  scrollTrigger: { start: "top 85%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// exhibitionParallax — Scroll-driven image scale for exhibition section
// --------------------------------------------------
export const exhibitionParallax = {
  from: { scale: 1.1 },
  to: { scale: 1, ease: "none" },
  scrollTrigger: { start: "top bottom", end: "bottom top", scrub: true },
};

// --------------------------------------------------
// timelinePhaseReveal — Process page timeline phase entrance
// --------------------------------------------------
export const timelinePhaseReveal = {
  // Individual text children fade+rise (replaces whole-block x-slide)
  textChild: {
    from: { autoAlpha: 0, y: 20 },
    to: { autoAlpha: 1, y: 0, duration: 0.6, ease: easings.smooth },
  },
  textStagger: 0.1,
  // Badge: spring-like elastic entrance
  badge: {
    from: { scale: 0, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1, duration: 0.45, ease: "elastic.out(1, 0.5)" },
  },
  // Image: opacity + x-slide from the side (not clip-path)
  image: {
    from: { autoAlpha: 0, x: 50 },
    to: { autoAlpha: 1, x: 0, duration: 0.8, ease: easings.smooth },
  },
  imageReverse: {
    from: { autoAlpha: 0, x: -50 },
    to: { autoAlpha: 1, x: 0, duration: 0.8, ease: easings.smooth },
  },
  scrollTrigger: { start: "top 80%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// fadeLeft — Entrance from the left (horizontal reveal)
// --------------------------------------------------
export const fadeLeft = {
  from: { x: -30, autoAlpha: 0 },
  to: { x: 0, autoAlpha: 1, duration: 0.8, ease: easings.smooth },
  scrollTrigger: { start: "top 85%", end: "top 20%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// fadeRight — Entrance from the right (horizontal reveal)
// --------------------------------------------------
export const fadeRight = {
  from: { x: 30, autoAlpha: 0 },
  to: { x: 0, autoAlpha: 1, duration: 0.8, ease: easings.smooth },
  scrollTrigger: { start: "top 85%", end: "top 20%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// blurReveal — Fade in with blur dissolve
// --------------------------------------------------
export const blurReveal = {
  from: { autoAlpha: 0, filter: "blur(10px)" },
  to: { autoAlpha: 1, filter: "blur(0px)", duration: 1.0, ease: easings.smooth },
};

// --------------------------------------------------
// withWillChange — Managed will-change via GSAP callbacks
// Sets will-change on animation start, resets to "auto" on complete.
// --------------------------------------------------
export function withWillChange(props = "transform, opacity") {
  return {
    onStart(this: gsap.core.Tween | gsap.core.Timeline) {
      if (typeof (this as gsap.core.Tween).targets === "function") {
        for (const el of (this as gsap.core.Tween).targets() as HTMLElement[]) {
          el.style.willChange = props;
        }
      }
    },
    onComplete(this: gsap.core.Tween | gsap.core.Timeline) {
      if (typeof (this as gsap.core.Tween).targets === "function") {
        for (const el of (this as gsap.core.Tween).targets() as HTMLElement[]) {
          el.style.willChange = "auto";
        }
      }
    },
  };
}

// --------------------------------------------------
// folioReveal — Folio gallery page entrance animations
// --------------------------------------------------
export const folioReveal = {
  image: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.6, ease: easings.smooth },
  },
  label: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.4, ease: easings.smooth },
    delay: 0.2,
  },
  titleClip: {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0 0 0)", duration: 0.8, ease: easings.sharp },
  },
  pageNumber: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 0.06, duration: 0.6, ease: easings.smooth },
    delay: 0.3,
  },
  scrollTrigger: { start: "top 80%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// cinematicHeroReveal — Gallery hero: blur/brightness/scale entrance + parallax
// --------------------------------------------------
export const cinematicHeroReveal = {
  /** Image only uses scale — filter work moves to overlay layers */
  image: {
    from: { scale: 1.08 },
    to: { scale: 1, duration: 1.8, ease: "power3.out" },
  },
  /** Dark overlay: simulates brightness(0.1) → brightness(1) */
  darkOverlay: {
    from: { autoAlpha: 0.85 },
    to: { autoAlpha: 0, duration: 1.8, ease: "power3.out" },
  },
  nav: {
    from: { y: -20, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: easings.smooth },
  },
  chapterLabel: {
    from: { y: 20, autoAlpha: 0 },
    to: { autoAlpha: 1, y: 0, duration: 0.8, ease: easings.smooth },
  },
  titleLine: {
    from: { y: 60, autoAlpha: 0, rotationX: -15 },
    to: { y: 0, autoAlpha: 1, rotationX: 0, duration: 1, ease: easings.smooth, stagger: 0.15 },
  },
  description: {
    from: { y: 15, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 0.8, ease: easings.smooth },
  },
  scrollCue: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.8, ease: easings.smooth },
  },
  parallax: {
    to: { yPercent: 20, ease: "none" },
    scrollTrigger: { start: "top top", end: "bottom top", scrub: true },
  },
};

// --------------------------------------------------
// bentoSplitReveal — Gallery bento: grayscale→color crossfade + parallax + text
// Two-layer approach: static grayscale base + GPU-compositable opacity reveal.
// --------------------------------------------------
// --------------------------------------------------
// contactFormReveal — Contact form entrance (~2s)
// --------------------------------------------------
export const contactFormReveal = {
  label: {
    from: { autoAlpha: 0, y: 10 },
    to: { autoAlpha: 1, y: 0, duration: 0.6, ease: easings.smooth },
  },
  heading: {
    from: { autoAlpha: 0, y: 20 },
    to: { autoAlpha: 1, y: 0, duration: 0.8, ease: easings.smooth },
  },
  field: {
    from: { autoAlpha: 0, y: 20 },
    to: { autoAlpha: 1, y: 0, duration: 0.6, ease: easings.smooth },
  },
  fieldStagger: 0.1,
  submit: {
    from: { autoAlpha: 0, y: 20 },
    to: { autoAlpha: 1, y: 0, duration: 0.6, ease: easings.smooth },
  },
  positions: {
    label: 0.1,
    heading: 0.2,
    fields: 0.5,
    submit: 0.9,
  },
  totalDuration: 1.6,
};

export const bentoSplitReveal = {
  /** Wrapper: GPU-compositable scale + parallax */
  imageWrapper: {
    from: { scale: 1.1, yPercent: -10 },
    to: { scale: 1, yPercent: 10, ease: "none" },
  },
  /** Color layer fades in over static grayscale base */
  colorReveal: {
    from: { opacity: 0 },
    to: { opacity: 1, ease: "none" },
  },
  /** Static filter applied once via CSS — never animated */
  grayFilter: "grayscale(100%) brightness(0.5)",
  /** Shared ScrollTrigger config for the timeline */
  scrollTrigger: { start: "top 80%", end: "bottom top", scrub: true },
  text: {
    from: { y: 40, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, stagger: 0.15, duration: 1.2, ease: easings.smooth },
    scrollTrigger: { start: "top 60%", toggleActions: "play none none none" },
  },
};

// --------------------------------------------------
// fullBleedShowcase — Gallery full-bleed: centered image parallax + text
// --------------------------------------------------
export const fullBleedShowcase = {
  image: {
    from: { scale: 1.1, yPercent: -10 },
    to: { scale: 1, yPercent: 10, ease: "none" },
    scrollTrigger: { start: "top bottom", end: "bottom top", scrub: true },
  },
  text: {
    from: { y: 50, autoAlpha: 0, scale: 0.9 },
    to: { y: 0, autoAlpha: 1, scale: 1, duration: 1.5, ease: easings.smooth },
    scrollTrigger: { start: "top 50%", toggleActions: "play none none none" },
  },
};

// --------------------------------------------------
// textureCardReveal — Gallery texture cards: entrance + inner parallax
// --------------------------------------------------
export const textureCardReveal = {
  card: {
    from: { y: 100, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 1.5, ease: easings.smooth },
    scrollTrigger: { start: "top 85%", toggleActions: "play none none none" },
  },
  image: {
    from: { scale: 1.15, yPercent: -5 },
    to: { scale: 1, yPercent: 5, ease: "none" },
    scrollTrigger: { start: "top bottom", end: "bottom top", scrub: true },
  },
};

// --------------------------------------------------
// landingHeaderEntrance — Floating header slide-down entrance
// --------------------------------------------------
export const landingHeaderEntrance = {
  from: { y: -100, autoAlpha: 0 },
  to: { y: 0, autoAlpha: 1, duration: 1.5, ease: easings.smooth },
};

// --------------------------------------------------
// headerShrink — Scroll-scrub header morphing (continuous interpolation)
// --------------------------------------------------
export const headerShrink = {
  scrollTrigger: {
    start: 0,
    end: 150,
    scrub: true,
  },
  from: {
    height: "5rem",
    paddingTop: "1.25rem",
    paddingBottom: "1.25rem",
    backgroundColor: "#161a12",
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: "0px",
    backdropFilter: "blur(0px)",
  },
  to: {
    height: "3.5rem",
    paddingTop: "0.625rem",
    paddingBottom: "0.625rem",
    backgroundColor: "rgba(17,18,16,0.55)",
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: "2px",
    backdropFilter: "blur(16px)",
  },
  /** Shadow is now on overlay element — animate its opacity instead */
  shadow: { from: { opacity: 0 }, to: { opacity: 1 } },
  logo: {
    from: { scale: 1, transformOrigin: "center center" },
    to: { scale: 0.778, transformOrigin: "center center" },
  },
};

// --------------------------------------------------
// landingHeroParallax — Ambient Ken Burns zoom + scroll-driven parallax fade
// --------------------------------------------------
export const landingHeroParallax = {
  kenBurns: {
    from: { scale: 1 },
    to: { scale: 1.06, duration: 10, ease: "none" },
    delay: 2.1,
  },
  scroll: {
    to: { yPercent: 30, ease: "none" },
    scrollTrigger: { start: "top top", end: "bottom top", scrub: true },
  },
};

// --------------------------------------------------
// landingWordReveal — Per-word reveal with rotation (SplitText)
// --------------------------------------------------
export const landingWordReveal = {
  splitConfig: { type: "words", mask: "words", autoSplit: true } as const,
  from: { yPercent: 120, rotation: 4, autoAlpha: 0 },
  to: {
    yPercent: 0,
    rotation: 0,
    autoAlpha: 1,
    duration: 1.2,
    ease: easings.smooth,
    stagger: 0.04,
  },
  scrollTrigger: { start: "top 90%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// cinematicImageReveal — Clip-path reveal + scrub parallax
// --------------------------------------------------
export const cinematicImageReveal = {
  reveal: {
    from: { clipPath: "inset(100% 0 0 0)" },
    to: { clipPath: "inset(0% 0 0 0)", duration: 1.8, ease: easings.smooth },
    scrollTrigger: { start: "top 85%", toggleActions: "play none none none" },
  },
  parallax: {
    from: { yPercent: -15, scale: 1.1 },
    to: { yPercent: 15, scale: 1, ease: "none" },
    scrollTrigger: { start: "top bottom", end: "bottom top", scrub: true },
  },
};

// --------------------------------------------------
// landingHeroGridSequence — Landing hero 2-column grid choreography (~2.8s)
// --------------------------------------------------
export const landingHeroGridSequence = {
  steps: [
    {
      target: "divider",
      from: { autoAlpha: 0 },
      to: { autoAlpha: 1, duration: 0.8, ease: easings.smooth },
      position: 0.3,
    },
    {
      target: "bgImage",
      from: { autoAlpha: 0 },
      to: { autoAlpha: 1, duration: 1.5, ease: easings.smooth },
      position: 0.3,
    },
    {
      target: "eyebrow",
      from: { autoAlpha: 0, y: 15 },
      to: { autoAlpha: 1, y: 0, duration: 0.8, ease: easings.smooth },
      position: 0.6,
    },
    {
      target: "headline",
      from: { autoAlpha: 0, y: 15 },
      to: { autoAlpha: 1, y: 0, duration: 1.0, ease: "back.out(1.4)" },
      position: 0.8,
    },
    {
      target: "description",
      from: { autoAlpha: 0, y: 15 },
      to: { autoAlpha: 1, y: 0, duration: 0.8, ease: easings.smooth },
      position: 1.2,
    },
  ],
  totalDuration: 2.4,
};

// --------------------------------------------------
// landingHeroEditorialSequence — Full-bleed editorial hero choreography (~2.8s)
// --------------------------------------------------
export const landingHeroEditorialSequence = {
  steps: [
    {
      target: "bgImage",
      from: { scale: 1.12, autoAlpha: 0 },
      to: { scale: 1, autoAlpha: 1, duration: 2.0, ease: easings.smooth },
      position: 0,
    },
    {
      target: "vignette",
      from: { autoAlpha: 0 },
      to: { autoAlpha: 1, duration: 1.5, ease: easings.smooth },
      position: 0.3,
    },
    {
      target: "frameLine",
      from: { autoAlpha: 0, scale: 1.04 },
      to: { autoAlpha: 1, scale: 1, duration: 1.2, ease: easings.smooth },
      position: 0.8,
    },
    {
      target: "eyebrow",
      from: { autoAlpha: 0, x: -20 },
      to: { autoAlpha: 1, x: 0, duration: 0.8, ease: easings.smooth },
      position: 1.0,
    },
    {
      target: "headlineLine1",
      from: { autoAlpha: 0, y: 30, clipPath: "inset(0 0 100% 0)" },
      to: {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0 0 0% 0)",
        duration: 1.0,
        ease: easings.smooth,
      },
      position: 1.1,
    },
    {
      target: "headlineLine2",
      from: { autoAlpha: 0, y: 30, clipPath: "inset(0 0 100% 0)" },
      to: {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0 0 0% 0)",
        duration: 1.0,
        ease: easings.smooth,
      },
      position: 1.3,
    },
    {
      target: "description",
      from: { autoAlpha: 0, y: 15 },
      to: { autoAlpha: 1, y: 0, duration: 0.8, ease: easings.smooth },
      position: 1.6,
    },
    {
      target: "counter",
      from: { autoAlpha: 0 },
      to: { autoAlpha: 1, duration: 0.6, ease: easings.smooth },
      position: 1.8,
    },
    {
      target: "scrollCue",
      from: { autoAlpha: 0 },
      to: { autoAlpha: 1, duration: 0.6, ease: easings.smooth },
      position: 2.0,
    },
  ],
  totalDuration: 2.8,
};

// --------------------------------------------------
// scrollApertureProgress — Scroll-linked aperture blade rotation
// --------------------------------------------------
export const scrollApertureProgress = {
  bladeRotation: { from: 15, to: 0 },
  ringOpacity: { from: 0.3, to: 0.8 },
  scrollTrigger: { start: "top top", end: "bottom bottom", scrub: true },
};

// --------------------------------------------------
// irisTransition — Vertical blinds page transition (~0.7s)
// 8 strips cascade closed then open like turning blinds
// --------------------------------------------------
export const irisTransition = {
  blade: {
    close: {
      from: { scaleX: 0 },
      to: { scaleX: 1, ease: easings.smoothInOut, stagger: 0.03 },
    },
    open: {
      from: { scaleX: 1 },
      to: { scaleX: 0, ease: easings.smooth, stagger: 0.03 },
    },
  },
  durations: { close: 0.28, hold: 0.08, open: 0.28 },
  totalDuration: 0.7,
};

// --------------------------------------------------
// reducedMotionFallbacks — prefers-reduced-motion: reduce behavior
// --------------------------------------------------
export const reducedMotionFallbacks = {
  fadeUp: "instant autoAlpha: 1, no Y translation",
  fadeLeft: "instant autoAlpha: 1, no X translation",
  fadeRight: "instant autoAlpha: 1, no X translation",
  blurReveal: "instant autoAlpha: 1, no blur dissolve",
  textRevealLines: "instant autoAlpha: 1, no SplitText, no mask animation",
  textRevealWords: "all words at full opacity, no scrub",
  clipRevealUp: "instant clip-path: inset(0%), no animation",
  clipRevealLeft: "instant clip-path: inset(0%), no animation",
  imageReveal: "no overlay animation, image visible immediately at scale 1",
  parallaxLayer: "disabled — no Y translation",
  magneticPull: "disabled — no cursor following",
  staggerGrid: "instant autoAlpha: 1, no stagger delay",
  navOverlayOpen: "instant visibility toggle, no stagger",
  navOverlayClose: "instant visibility toggle",
  scrollIndicatorPulse: "visible but static, no pulse animation",
  collectionCardReveal: "overlay scaleX: 0, clip-path fully open, labels visible immediately",
  exhibitionParallax: "disabled — no scroll-driven scale",
  timelinePhaseReveal:
    "all elements visible immediately, no fade/rise stagger, no elastic badge, no x-slide images",
  folioReveal:
    "all images and labels visible immediately, no clip-path reveal on title, page numbers at final opacity",
  cinematicHeroReveal:
    "image visible immediately at scale 1, no brightness transition, no parallax, all text visible",
  bentoSplitReveal:
    "image at full color, no grayscale transition, no parallax, no filter, text visible immediately",
  fullBleedShowcase: "image visible at scale 1, no parallax, text visible immediately",
  textureCardReveal: "cards visible immediately, no parallax, no stagger",
  landingHeaderEntrance: "header visible immediately, no slide-down",
  headerShrink: "header at compact height immediately, no animation",
  landingHeroGridSequence: "all hero elements visible immediately, no choreography",
  landingHeroEditorialSequence:
    "all elements visible immediately, no choreography, no clip-path, no parallax",
  landingHeroParallax: "no ambient zoom, no scroll parallax/fade",
  landingWordReveal: "all words visible immediately, no rotation/stagger",
  cinematicImageReveal: "clip-path fully open, no parallax, image visible immediately",
  scrollApertureProgress: "blades at open position, no scroll-linked rotation",
  irisTransition: "instant opacity toggle, no blade animation",
} as const;
