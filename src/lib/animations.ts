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
  scrollTrigger: { start: "top 80%", end: "bottom 20%", scrub: 0.3 },
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
// heroArchiveSequence — Brutalist hero choreography (~3.5s)
// --------------------------------------------------
export const heroArchiveSequence = {
  steps: [
    {
      target: ".hero-image",
      from: { autoAlpha: 0, scale: 1.1 },
      to: { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power2.out" },
      position: 0,
    },
    {
      target: ".hero-label",
      from: { autoAlpha: 0 },
      to: { autoAlpha: 1, duration: 0.6, ease: easings.smooth },
      position: 0.4,
    },
    {
      target: ".hero-title-line",
      animation: "textRevealLines" as const,
      stagger: 0.12,
      position: 0.7,
    },
    {
      target: ".hero-title-stroke",
      animation: "textRevealLines" as const,
      stagger: 0.12,
      position: 0.9,
    },
    {
      target: ".hero-description",
      from: { autoAlpha: 0, y: 20 },
      to: { autoAlpha: 1, y: 0, duration: 0.6, ease: easings.smooth },
      position: 1.8,
    },
    {
      target: ".hero-cta",
      from: { autoAlpha: 0, y: 20 },
      to: { autoAlpha: 1, y: 0, duration: 0.5, ease: easings.smooth },
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
    to: { clipPath: "inset(0 0 0 0)", duration: 1.2, ease: easings.sharp },
  },
  pageNumber: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 0.06, duration: 0.6, ease: easings.smooth },
    delay: 0.3,
  },
  scrollTrigger: { start: "top 60%", toggleActions: "play none none none" },
};

// --------------------------------------------------
// cinematicHeroReveal — Gallery hero: blur/brightness/scale entrance + parallax
// --------------------------------------------------
export const cinematicHeroReveal = {
  image: {
    from: { scale: 1.15, filter: "brightness(0.1) blur(20px)" },
    to: { scale: 1, filter: "brightness(1) blur(0px)", duration: 3.5, ease: "power3.inOut" },
  },
  nav: {
    from: { y: -20, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: easings.smooth },
  },
  chapterLabel: {
    from: { y: 20, autoAlpha: 0 },
    to: { autoAlpha: 1, y: 0, duration: 1, ease: easings.smooth },
  },
  titleLine: {
    from: { y: 100, autoAlpha: 0, rotationX: -20 },
    to: { y: 0, autoAlpha: 1, rotationX: 0, duration: 1.5, ease: easings.smooth, stagger: 0.2 },
  },
  description: {
    from: { y: 20, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 1, ease: easings.smooth },
  },
  scrollCue: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 1, ease: easings.smooth },
  },
  parallax: {
    to: { yPercent: 20, ease: "none" },
    scrollTrigger: { start: "top top", end: "bottom top", scrub: 0.5 },
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
  scrollTrigger: { start: "top 80%", end: "bottom top", scrub: 0.5 },
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
    scrollTrigger: { start: "top bottom", end: "bottom top", scrub: 0.5 },
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
    scrollTrigger: { start: "top bottom", end: "bottom top", scrub: 0.5 },
  },
};

// --------------------------------------------------
// landingHeaderEntrance — Floating header slide-down entrance
// --------------------------------------------------
export const landingHeaderEntrance = {
  from: { y: -100, autoAlpha: 0 },
  to: { y: 0, autoAlpha: 1, duration: 1.5, ease: easings.smooth, delay: 0.5 },
};

// --------------------------------------------------
// headerShrink — Scroll-scrub header morphing (continuous interpolation)
// --------------------------------------------------
export const headerShrink = {
  scrollTrigger: {
    start: 0,
    end: 150,
    scrub: 0.5,
  },
  from: {
    height: "5rem",
    paddingTop: "1.25rem",
    paddingBottom: "1.25rem",
    backgroundColor: "#161a12",
    borderColor: "rgba(255,255,255,0.15)",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
    borderRadius: "0px",
  },
  to: {
    height: "3.5rem",
    paddingTop: "0.625rem",
    paddingBottom: "0.625rem",
    backgroundColor: "rgba(17,18,16,0.35)",
    borderColor: "rgba(255,255,255,0.2)",
    boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
    borderRadius: "2px",
  },
  blur: { from: 0, to: 0 },
  logo: {
    from: { fontSize: "1.5rem" },
    to: { fontSize: "1.25rem" },
  },
  /** Crossfade: wordmark text fades out, aperture icon fades in */
  logoMorph: {
    text: { from: { autoAlpha: 1 }, to: { autoAlpha: 0 } },
    icon: { from: { autoAlpha: 0, scale: 0.8 }, to: { autoAlpha: 1, scale: 1 } },
  },
};

// --------------------------------------------------
// landingHeroParallax — (legacy) Hero background scroll-driven parallax
// --------------------------------------------------
export const landingHeroParallax = {
  yPercent: { from: 0, to: 50 },
  scale: { from: 1, to: 1.15 },
  autoAlpha: { from: 1, to: 0 },
  blur: { from: "blur(0px)", to: "blur(12px)" },
  scrollTrigger: { start: "top top", end: "bottom top", scrub: true },
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
    {
      target: "curves",
      from: { autoAlpha: 0 },
      to: { autoAlpha: 1, duration: 1.0, ease: easings.smooth },
      position: 1.6,
    },
    {
      target: "dash",
      from: { autoAlpha: 0 },
      to: { autoAlpha: 1, duration: 0.6, ease: easings.smooth },
      position: 1.8,
    },
  ],
  totalDuration: 2.4,
};

// --------------------------------------------------
// heroOverprintSequence — V1: Layered type collision choreography (~3s)
// --------------------------------------------------
export const heroOverprintSequence = {
  ghostText: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 0.04, duration: 1.5, ease: easings.smooth },
  },
  taglineWords: {
    splitConfig: { type: "words", mask: "words", autoSplit: true } as const,
    from: { yPercent: 100, autoAlpha: 0 },
    to: { yPercent: 0, autoAlpha: 1, duration: 1.0, ease: easings.smooth, stagger: 0.06 },
  },
  accentLine: {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0 0 0)", duration: 0.8, ease: easings.smoothInOut },
  },
  subtitleFade: {
    from: { y: 20, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 0.6, ease: easings.smooth },
  },
  goldRule: {
    from: { scaleY: 0, transformOrigin: "top center" },
    to: { scaleY: 1, duration: 0.4, ease: easings.smooth },
  },
  cta: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.4, ease: easings.smooth },
  },
  totalDuration: 3.0,
};

// --------------------------------------------------
// heroFrameSequence — V2: Double-exposure cinematic layering (~3.5s)
// --------------------------------------------------
export const heroFrameSequence = {
  bgImage: {
    from: { autoAlpha: 0, scale: 1.06 },
    to: { autoAlpha: 1, scale: 1, duration: 1.5, ease: easings.smooth },
  },
  diagonal: {
    from: { scaleX: 0 },
    to: { scaleX: 1, duration: 0.8, ease: easings.smoothInOut },
  },
  fgFrame: {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0 0 0)", duration: 1.2, ease: easings.smooth },
  },
  title: {
    splitConfig: { type: "chars" } as const,
    from: { yPercent: 100, autoAlpha: 0 },
    to: { yPercent: 0, autoAlpha: 1, duration: 1.0, ease: easings.smooth, stagger: 0.025 },
  },
  label: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.5, ease: easings.smooth },
  },
  metadata: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.4, ease: easings.smooth },
  },
  totalDuration: 3.5,
};

// --------------------------------------------------
// heroMonolithSequence — V3: Text-as-image-window reveal (~3.5s)
// --------------------------------------------------
export const heroMonolithSequence = {
  giantText: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.6, ease: easings.smooth },
  },
  overlayReveal: {
    from: { opacity: 1 },
    to: { opacity: 0.82, duration: 1.5, ease: "power2.inOut" },
  },
  overlayScroll: {
    to: { opacity: 0.65, ease: "none" },
    scrollTrigger: { start: "top top", end: "bottom top", scrub: 0.5 },
  },
  imageScale: {
    from: { scale: 1.05 },
    to: { scale: 1, ease: "none" },
    scrollTrigger: { start: "top top", end: "bottom top", scrub: 0.5 },
  },
  subtitle: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.5, ease: easings.smooth },
  },
  goldLines: {
    from: { scaleX: 0 },
    to: { scaleX: 1, duration: 0.4, ease: easings.smoothInOut },
  },
  tagline: {
    from: { y: 15, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 0.4, ease: easings.smooth },
  },
  cta: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.4, ease: easings.smooth },
  },
  totalDuration: 3.5,
};

// --------------------------------------------------
// heroParallaxSequence — V4: Multi-depth floating layers (~3.5s)
// --------------------------------------------------
export const heroParallaxSequence = {
  ghostText: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 0.025, duration: 0.8, ease: easings.smooth },
  },
  image: {
    from: { filter: "blur(20px) brightness(0.15)", scale: 1.15 },
    to: { filter: "blur(0px) brightness(1)", scale: 1.05, duration: 2.0, ease: "power3.inOut" },
  },
  wordLeft: {
    from: { x: -25, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1, duration: 0.6, ease: easings.smooth },
  },
  wordCenter: {
    splitConfig: { type: "chars" } as const,
    from: { yPercent: 110, autoAlpha: 0 },
    to: { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: easings.smooth, stagger: 0.04 },
  },
  wordRight: {
    from: { x: 25, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1, duration: 0.6, ease: easings.smooth },
  },
  ui: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.5, ease: easings.smooth },
  },
  parallaxSpeeds: { layer0: 0.05, layer2: 0.15, layer3: 0.3 },
  totalDuration: 3.5,
};

// --------------------------------------------------
// heroNegativeSequence — V5: Film strip with negative-to-positive (~4s)
// --------------------------------------------------
export const heroNegativeSequence = {
  strip: {
    from: { xPercent: 100 },
    to: { xPercent: 0, duration: 1.2, ease: "power2.out" },
  },
  negativeToPositive: {
    from: { filter: "invert(1) hue-rotate(180deg) saturate(0.6) brightness(0.9)" },
    to: {
      filter: "invert(0) hue-rotate(0deg) saturate(1) brightness(1)",
      duration: 1.8,
      ease: "power2.inOut",
    },
  },
  perforations: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
    stagger: 0.02,
  },
  gate: {
    from: { clipPath: "inset(100%)" },
    to: { clipPath: "inset(0%)", duration: 0.8, ease: easings.smoothInOut },
  },
  label: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.4, ease: easings.smooth },
  },
  titleLines: {
    splitConfig: { type: "lines", mask: "lines", autoSplit: true } as const,
    from: { yPercent: 80 },
    to: { yPercent: 0, duration: 0.8, ease: easings.smooth, stagger: 0.12 },
  },
  goldLine: {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0 0 0)", duration: 0.6, ease: easings.smoothInOut },
  },
  edgeMarks: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
  },
  totalDuration: 4.0,
};

// --------------------------------------------------
// heroDiptychSequence — V6: Asymmetric split-screen (~3s)
// --------------------------------------------------
export const heroDiptychSequence = {
  image: {
    from: { scale: 1.12, autoAlpha: 0, filter: "blur(12px)" },
    to: { scale: 1, autoAlpha: 1, filter: "blur(0px)", duration: 1.8, ease: "power3.inOut" },
  },
  divider: {
    from: { scaleY: 0 },
    to: { scaleY: 1, duration: 0.7, ease: easings.smoothInOut },
  },
  cornerAccent: {
    from: { scaleX: 0, scaleY: 0 },
    to: { scaleX: 1, scaleY: 1, duration: 0.4, ease: easings.smooth },
  },
  titleChars: {
    splitConfig: { type: "chars" } as const,
    from: { yPercent: 100, autoAlpha: 0 },
    to: { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: easings.smooth, stagger: 0.04 },
  },
  studioClip: {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0 0 0)", duration: 0.6, ease: easings.smoothInOut },
  },
  goldRule: {
    from: { scaleX: 0 },
    to: { scaleX: 1, duration: 0.3, ease: easings.smooth },
  },
  tagline: {
    from: { y: 20, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 0.5, ease: easings.smooth },
  },
  cta: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
  },
  totalDuration: 3.0,
};

// --------------------------------------------------
// heroExposureSequence — V7: Ghost text double-exposed through film gate (~3.5s)
// --------------------------------------------------
export const heroExposureSequence = {
  stripBg: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.5, ease: easings.smooth },
  },
  negativeToPositive: {
    from: { filter: "invert(1) hue-rotate(180deg) saturate(0.6) brightness(0.9)" },
    to: {
      filter: "invert(0) hue-rotate(0deg) saturate(1) brightness(1)",
      duration: 1.5,
      ease: "power2.inOut",
    },
  },
  ghostOverlay: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 0.6, duration: 1.2, ease: easings.smooth },
  },
  perforations: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
    stagger: 0.02,
  },
  gate: {
    from: { clipPath: "inset(100%)" },
    to: { clipPath: "inset(0%)", duration: 0.8, ease: easings.smoothInOut },
  },
  titleLines: {
    splitConfig: { type: "lines", mask: "lines", autoSplit: true } as const,
    from: { yPercent: 80 },
    to: { yPercent: 0, duration: 0.8, ease: easings.smooth, stagger: 0.1 },
  },
  goldWord: {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0 0 0)", duration: 0.6, ease: easings.smoothInOut },
  },
  label: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
  },
  totalDuration: 3.5,
};

// --------------------------------------------------
// heroReelSequence — V8: Vertical film strip with diagonal type (~3.5s)
// --------------------------------------------------
export const heroReelSequence = {
  ghostText: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 0.03, duration: 0.8, ease: easings.smooth },
  },
  strip: {
    from: { xPercent: 100 },
    to: { xPercent: 0, duration: 1.2, ease: "power2.out" },
  },
  frameReveal: {
    from: { clipPath: "inset(0 0 100% 0)" },
    to: { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: easings.smooth },
    stagger: 0.2,
  },
  wordFade: {
    from: { x: -20, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1, duration: 0.5, ease: easings.smooth },
  },
  wordCenter: {
    splitConfig: { type: "chars" } as const,
    from: { yPercent: 100, autoAlpha: 0 },
    to: { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: easings.smooth, stagger: 0.04 },
  },
  perforations: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.4, ease: easings.smooth },
    stagger: 0.02,
  },
  label: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
  },
  totalDuration: 3.5,
};

// --------------------------------------------------
// heroProjectionSequence — V9: Projector beam with type in darkness (~3.5s)
// --------------------------------------------------
export const heroProjectionSequence = {
  gate: {
    from: { scale: 0, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1, duration: 0.5, ease: easings.smooth },
  },
  beam: {
    from: { clipPath: "polygon(5% 95%, 5% 95%, 5% 95%, 5% 95%)" },
    to: {
      clipPath: "polygon(5% 85%, 95% 10%, 100% 60%, 15% 100%)",
      duration: 1.5,
      ease: "power2.out",
    },
  },
  image: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 1.2, ease: easings.smooth },
  },
  ghostText: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 0.04, duration: 0.6, ease: easings.smooth },
  },
  titleReveal: {
    splitConfig: { type: "lines", mask: "lines", autoSplit: true } as const,
    from: { yPercent: 80 },
    to: { yPercent: 0, duration: 0.8, ease: easings.smooth, stagger: 0.1 },
  },
  goldWord: {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0 0 0)", duration: 0.6, ease: easings.smoothInOut },
  },
  metadata: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
  },
  totalDuration: 3.5,
};

// --------------------------------------------------
// heroContactSequence — V10: Contact sheet proof grid (~3.5s)
// --------------------------------------------------
export const heroContactSequence = {
  ghostText: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 0.03, duration: 0.8, ease: easings.smooth },
  },
  gridReveal: {
    from: { clipPath: "inset(100% 0 0 0)" },
    to: { clipPath: "inset(0 0 0 0)", duration: 0.6, ease: easings.smooth },
    stagger: 0.1,
  },
  perforations: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
    stagger: 0.02,
  },
  selectionCircle: {
    from: { scale: 0, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
  },
  selectedSaturate: {
    from: { filter: "grayscale(0.3) contrast(1.1)" },
    to: { filter: "grayscale(0) contrast(1)", duration: 0.8, ease: easings.smooth },
  },
  titleLines: {
    splitConfig: { type: "lines", mask: "lines", autoSplit: true } as const,
    from: { yPercent: 80 },
    to: { yPercent: 0, duration: 0.8, ease: easings.smooth, stagger: 0.1 },
  },
  goldWord: {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0 0 0)", duration: 0.6, ease: easings.smoothInOut },
  },
  label: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
  },
  totalDuration: 3.5,
};

// --------------------------------------------------
// heroSpliceSequence — V11: Split film strip with text gap (~4s)
// --------------------------------------------------
export const heroSpliceSequence = {
  ghostText: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 0.025, duration: 0.6, ease: easings.smooth },
  },
  stripTop: {
    from: { xPercent: -100 },
    to: { xPercent: 0, duration: 1.2, ease: "power2.out" },
  },
  stripBottom: {
    from: { xPercent: 100 },
    to: { xPercent: 0, duration: 1.2, ease: "power2.out" },
  },
  negativeToPositive: {
    from: { filter: "invert(1) hue-rotate(180deg) saturate(0.6) brightness(0.9)" },
    to: {
      filter: "invert(0) hue-rotate(0deg) saturate(1) brightness(1)",
      duration: 1.5,
      ease: "power2.inOut",
    },
  },
  perforations: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
    stagger: 0.02,
  },
  gate: {
    from: { clipPath: "inset(100%)" },
    to: { clipPath: "inset(0%)", duration: 0.6, ease: easings.smoothInOut },
  },
  spliceMark: {
    from: { scale: 0, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" },
  },
  gapRule: {
    from: { scaleX: 0 },
    to: { scaleX: 1, duration: 0.3, ease: easings.smoothInOut },
  },
  textFade: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.4, ease: easings.smooth },
  },
  titleChars: {
    splitConfig: { type: "chars" } as const,
    from: { yPercent: 100, autoAlpha: 0 },
    to: { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: easings.smooth, stagger: 0.04 },
  },
  subtitleFade: {
    from: { y: 10, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 0.4, ease: easings.smooth },
  },
  metadata: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.3, ease: easings.smooth },
  },
  totalDuration: 4.0,
};

// --------------------------------------------------
// scrollApertureProgress — Scroll-linked aperture blade rotation
// --------------------------------------------------
export const scrollApertureProgress = {
  bladeRotation: { from: 15, to: 0 },
  ringOpacity: { from: 0.3, to: 0.8 },
  scrollTrigger: { start: "top top", end: "bottom bottom", scrub: 0.3 },
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
  heroArchiveSequence: "all elements visible immediately, no choreography",
  collectionCardReveal: "overlay scaleX: 0, clip-path fully open, labels visible immediately",
  exhibitionParallax: "disabled — no scroll-driven scale",
  timelinePhaseReveal:
    "all elements visible immediately, no fade/rise stagger, no elastic badge, no x-slide images",
  folioReveal:
    "all images and labels visible immediately, no clip-path reveal on title, page numbers at final opacity",
  cinematicHeroReveal:
    "image visible immediately at scale 1, no blur/brightness transition, no parallax, all text visible",
  bentoSplitReveal:
    "image at full color, no grayscale transition, no parallax, no filter, text visible immediately",
  fullBleedShowcase: "image visible at scale 1, no parallax, text visible immediately",
  textureCardReveal: "cards visible immediately, no parallax, no stagger",
  landingHeaderEntrance: "header visible immediately, no slide-down",
  headerShrink: "header at compact height immediately, no animation",
  landingHeroGridSequence: "all hero elements visible immediately, no choreography",
  landingHeroParallax: "disabled — no scroll-driven parallax on hero",
  landingWordReveal: "all words visible immediately, no rotation/stagger",
  cinematicImageReveal: "clip-path fully open, no parallax, image visible immediately",
  heroOverprintSequence:
    "all elements visible immediately, ghost text at final opacity, no choreography",
  heroFrameSequence:
    "all elements visible immediately, both images visible, no clip-path, no stagger",
  heroMonolithSequence: "overlay at final opacity, text visible as window, no entrance animation",
  heroParallaxSequence: "all layers visible immediately, no blur/scale transition, no parallax",
  heroNegativeSequence: "film strip visible, image in positive, no negative filter, no slide",
  heroDiptychSequence: "both panels visible, no split animation, no blur, all text visible",
  heroExposureSequence:
    "all elements visible, image positive, ghost overlay at final opacity, no animation",
  heroReelSequence: "strip visible, all frames revealed, ghost text at final opacity, no animation",
  heroProjectionSequence: "beam fully expanded, image visible, ghost text visible, no animation",
  heroContactSequence:
    "all grid cells visible, selection circle visible, selected frame in color, no animation",
  heroSpliceSequence: "both strips visible, images positive, text visible, no animation",
  scrollApertureProgress: "blades at open position, no scroll-linked rotation",
  irisTransition: "instant opacity toggle, no blade animation",
} as const;
