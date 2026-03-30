"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { landingHeaderEntrance, headerShrink, branchReveal } from "@/lib/animations";
import { easings } from "@/lib/easings";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HEADER_NAV_ITEMS, isNavItemActive } from "@/lib/navigation";
import { TransitionLink } from "./TransitionLink";
import { HeaderContactAction } from "./HeaderContactAction";
import { useUIStore } from "@/stores/ui-store";
import { BaharStudioLogo, type BaharStudioLogoHandle } from "@/components/ui/BaharStudioLogo";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<BaharStudioLogoHandle>(null);
  const branchRef = useRef<SVGSVGElement>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const isHomePage = pathname === "/";

  // Homepage entrance animation
  useGSAP(() => {
    if (!headerRef.current) return;

    if (!isHomePage || reducedMotion) {
      gsap.set(headerRef.current, { autoAlpha: 1 });
      if (branchRef.current) {
        gsap.set(branchRef.current, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 });
      }
      return;
    }

    gsap.fromTo(headerRef.current, landingHeaderEntrance.from, landingHeaderEntrance.to);

    // Branch bloom: clip-path reveals from center outward
    if (branchRef.current) {
      gsap.fromTo(branchRef.current, branchReveal.from, {
        ...branchReveal.to,
        duration: 1.2,
        ease: easings.smooth,
        delay: 0.6,
      });
    }
  }, [reducedMotion, isHomePage]);

  // Scroll-scrub morphing — continuous interpolation over 0-150px
  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;

    const shadowEl = header.querySelector<HTMLElement>(".header-shadow-target");

    if (reducedMotion) {
      gsap.set(header, headerShrink.to);
      if (shadowEl) gsap.set(shadowEl, headerShrink.shadow.to);
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        ...headerShrink.scrollTrigger,
      },
    });

    // Header: height, padding, background, border, borderRadius
    tl.fromTo(header, headerShrink.from, { ...headerShrink.to, ease: "none" }, 0);

    // Shadow overlay: opacity 0 → 1
    if (shadowEl) {
      tl.fromTo(shadowEl, headerShrink.shadow.from, { ...headerShrink.shadow.to, ease: "none" }, 0);
    }

    // Branch divider: retract to center on scroll (no layout props — GPU only)
    if (branchRef.current) {
      tl.to(
        branchRef.current,
        { clipPath: "inset(0% 50% 0% 50%)", autoAlpha: 0, ease: "none" },
        0,
      );
    }

    // Desktop-only: logo width shrink
    const logo = logoRef.current?.root;
    ScrollTrigger.matchMedia({
      "(min-width: 768px)": () => {
        if (logo) {
          tl.fromTo(logo, headerShrink.logo.from, { ...headerShrink.logo.to, ease: "none" }, 0);
        }
      },
    });
  }, [reducedMotion]);

  return (
    <div className="fixed top-0 w-full z-50 flex justify-center pointer-events-none">
      <header
        ref={headerRef}
        className="relative w-full border-b px-6 md:px-12 flex items-center justify-between pointer-events-auto"
        style={{
          visibility: isHomePage ? "hidden" : undefined,
          height: "5rem",
          paddingTop: "1.25rem",
          paddingBottom: "1.25rem",
          backgroundColor: "#111210",
          borderColor: "rgba(255,255,255,0.15)",
          borderRadius: "0px",
        }}
      >
        {/* Shadow layer — opacity animated instead of per-frame boxShadow */}
        <div
          className="header-shadow-target absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.3)", opacity: 0 }}
          aria-hidden="true"
        />

        {/* Left nav — desktop only */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8 w-1/3">
          {HEADER_NAV_ITEMS.map((item) => (
            <TransitionLink key={item.href} href={item.href} className="relative group">
              <span
                className={`text-[11px] font-label uppercase tracking-[0.2em] transition-colors duration-500 ${
                  isNavItemActive(pathname, item.href)
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`absolute -bottom-2 left-0 w-full h-[1px] bg-white transition-transform duration-500 origin-left ${
                  isNavItemActive(pathname, item.href)
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </TransitionLink>
          ))}
        </nav>

        {/* Center logo — wordmark crossfades to aperture icon on scroll */}
        <div className="w-1/2 flex flex-col items-start md:w-1/3 md:items-center relative">
          <TransitionLink
            href="/"
            aria-label="Bahar Studio"
            className="relative flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-500"
          >
            <BaharStudioLogo ref={logoRef} className="w-[140px] md:w-[180px] text-primary" />
          </TransitionLink>
          <svg
            ref={branchRef}
            viewBox="0 0 566.409 29.947"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[190px] md:w-[247px] h-auto text-primary-muted/30 hidden md:block absolute top-full mt-1.5"
            aria-hidden="true"
          >
            <g>
              <path d="M276.745,8.657c-2.402,0-4.404,2.002-4.404,4.404s2.002,4.404,4.404,4.404,4.404-2.002,4.404-4.404-2.002-4.404-4.404-4.404Z" />
              <g>
                <path d="M301.767,12.016l8.127.119,2.22.034c3.754.059,7.508.119,11.262.144,7.186.059,70.287.068,77.481.076h2.025c11.28.016,26.729.038,41.125.288,7.135.137,14.4.351,21.592.636l4.076.178c2.347.11,4.542.203,6.745.288,3.601.136,7.211.246,10.821.339,11.163.289,22.477.39,33.596.454.022-.298.145-.544.339-.769.044-.054.088-.104.131-.156.035-.046.071-.092.106-.141.07-.119.137-.241.196-.367.323-.888.523-1.832.677-2.765.049-.374.097-.745.146-1.115-.006.037-.012.074-.018.111.051-.424.093-.847.11-1.271.015-.387-.019-.766-.07-1.151-.033-.191-.078-.377-.117-.569-.076-.322.093-.653.415-.737.051-.014.103-.02.155-.02.265,0,.52.173.591.436.123.51.287.996.475,1.482.269.607.542,1.208.763,1.831.11.288.153.593.203.898.068.432.102.856.093,1.288-.008.78-.28,1.525-.644,2.203-.153.28-.39.525-.585.78-.013.017-.033.03-.047.048,1.819.01,3.648.02,5.452.029l.317.002h.313c-.206-.758-.414-1.449-.547-2.144-.149-.754-.16-1.522-.153-2.106.009-.71.15-1.417.272-1.954.146-.618.399-1.208.645-1.758.541-1.196,1.383-2.226,2.131-3.098.38-.445.797-.859,1.214-1.274l.228-.227c.619-.61,1.237-1.22,1.847-1.839.143-.143.324-.218.524-.218.205,0,.391.077.524.218.089.089.154.207.192.348.244.065.425.314.425.59l-.002,1.076c0,.899.002,1.802-.041,2.704-.06,1.405-.208,2.794-.441,4.13-.247,1.445-.71,2.739-1.375,3.846-.332.554-.784,1.094-1.343,1.606l-.171.123c1.812.008,3.624.025,5.427.042l.814.008h.746c-.092-.013-.14-.14-.185-.262-.088-.27-.123-.486-.156-.693-.096-.605-.113-.911-.122-1.225,0-.263.037-.525.075-.788.214-1.249.59-2.014.792-2.425.268-.603.646-1.109,1.112-1.707.297-.374.637-.722.976-1.061l.212-.22c.212-.213.425-.416.645-.611.238-.204.484-.382.73-.56.33-.233.567-.372.776-.495.541-.303.897-.498,1.253-.685.645-.339,1.306-.628,1.967-.916.112-.052.209-.087.314-.087.012,0,.217.086.217.098.009-.002.018-.003.028-.003.097,0,.217.097.283.231.12.187.116.452-.01.64.086,1.449.07,2.714-.047,3.854-.062.597-.168,1.153-.323,1.698-.143.615-.423,1.22-.705,1.783-.474.989-1.196,1.929-2.09,2.718-.425.349-.858.654-1.326.918l2.259-.151,2.289.008c-.09-.145.016-.413.263-.688.454-.505,1.004-.961,1.784-1.478.638-.466,1.382-.769,2.038-1.036,1.383-.56,2.716-.832,4.076-.832.749.008,1.308.117,1.801.212.88.169,1.575.469,2.022.679,1.335.608,2.559,1.497,3.639,2.282l.636.466c.205.145.337.358.381.616.104.241.043.554-.15.756-1.116,1.16-2.249,2.02-3.463,2.631-1.259.663-2.744,1.06-4.415,1.18-.253.018-.475.034-.705.034-1.184,0-2.441-.2-3.735-.594-.667-.192-1.371-.494-2.216-.951-.569-.301-1.171-.723-1.953-1.367l-3.629-.02c.169.003.337.12.589.317.9.709,1.685,1.589,2.47,2.768,1.101,1.646,1.701,3.574,2.232,5.274l.389,1.222c.201.12.331.364.331.625,0,.431-.374.81-.801.81-.743-.026-1.363-.096-1.953-.221-.768-.15-1.475-.446-2.004-.688-.646-.297-1.228-.716-1.614-.994-.578-.446-1.094-.935-1.58-1.495-.943-1.087-1.688-2.298-2.215-3.599-.29-.685-.51-1.379-.671-2.122-.068-.271-.102-.552-.136-.832l-.042-.288c-.034-.264-.051-.536-.051-.817-1.783.09-3.622.123-5.469.149l-1.169.034h-.221l.487.317c.422.394.822.908,1.226,1.574.413.663.691,1.385.909,2.004.52,1.475.782,3.027,1.035,4.528.221,1.317.449,2.677.847,3.972.053.159.036.317-.053.467-.08.152-.222.263-.379.298l-.363-.033-.269.017c-.58-.113-1.191-.292-1.821-.535-.608-.223-1.209-.537-1.835-.96-.583-.381-1.13-.825-1.672-1.358-.467-.459-.912-.99-1.443-1.723-.862-1.192-1.493-2.586-1.876-4.143-.373-1.484-.35-3.003.068-4.392l-.282.062-4.176.083c.292.448.534.926.682,1.458.102.39.127.814.161,1.212.034.39.034.771.017,1.161-.017.407-.025.814-.068,1.212-.034.415-.076.822-.11,1.237-.025.331-.254.602-.602.602-.322,0-.627-.271-.61-.602.016-.292.016-.569-.011-.859-.078-.419-.191-.822-.341-1.222-.156-.298-.327-.583-.522-.862-.311-.372-.643-.72-.982-1.073-.203-.212-.415-.424-.61-.644-.239-.277-.446-.553-.7-.806-.11-.075-.221-.147-.334-.211-.221-.133-.376-.327-.498-.539-4.312.07-8.621.141-12.915.193-5.101.068-10.211.11-15.313.11-2.102,0-4.212,0-6.313-.017-3.61-.034-7.22-.076-10.83-.161-2-.034-4.008-.093-6.008-.153l-4.805-.127c-6.927-.162-14.428-.237-23.608-.237-6.635,0-13.279.043-19.914.093l-2.839.017-2.796.025-2.796.017c-5.601.042-11.203.076-16.804.076-6.561,0-68.211-.044-73.465-.136-7.641-.11-13.627-.247-19.847-.585-.598-.034-1.077-.23-1.463-.599-.387-.395-.608-.926-.608-1.456,0-1.123.933-2.072,2.039-2.072Z" />
                <path d="M290.66,8.657c2.402,0,4.404,2.002,4.404,4.404s-2.002,4.404-4.404,4.404-4.404-2.002-4.404-4.404,2.002-4.404,4.404-4.404Z" />
              </g>
            </g>
            <path d="M264.642,12.016l-8.127.119-2.22.034c-3.754.059-7.508.119-11.262.144-7.186.059-70.287.068-77.481.076h-1.398s-.627,0-.627,0c-11.28.016-26.729.038-41.125.288-7.135.137-14.4.351-21.592.636l-4.076.178c-2.347.11-4.542.203-6.745.288-3.601.136-7.211.246-10.821.339-11.163.289-22.477.39-33.596.454-.022-.298-.145-.544-.339-.769-.044-.054-.088-.104-.131-.156-.035-.046-.071-.092-.106-.141-.07-.119-.137-.241-.196-.367-.323-.888-.523-1.832-.677-2.765-.049-.374-.097-.745-.146-1.115.006.037.012.074.018.111-.051-.424-.093-.847-.11-1.271-.015-.387.019-.766.07-1.151.033-.191.078-.377.117-.569.076-.322-.093-.653-.415-.737-.051-.014-.103-.02-.155-.02-.265,0-.52.173-.591.436-.123.51-.287.996-.475,1.482-.269.607-.542,1.208-.763,1.831-.11.288-.153.593-.203.898-.068.432-.102.856-.093,1.288.008.78.28,1.525.644,2.203.153.28.39.525.585.78.013.017.033.03.047.048-1.819.01-3.648.02-5.452.029l-.317.002h-.313c.206-.758.414-1.449.547-2.144.149-.754.16-1.522.153-2.106-.009-.71-.15-1.417-.272-1.954-.146-.618-.399-1.208-.645-1.758-.541-1.196-1.383-2.226-2.131-3.098-.38-.445-.797-.859-1.214-1.274l-.228-.227c-.619-.61-1.237-1.22-1.847-1.839C30.79.075,30.609,0,30.409,0c-.205,0-.391.077-.524.218-.089.089-.154.207-.192.348-.244.065-.425.314-.425.59l.002,1.076c0,.899-.002,1.802.041,2.704.06,1.405.208,2.794.441,4.13.247,1.445.71,2.739,1.375,3.846.332.554.784,1.094,1.343,1.606l.171.123c-1.812.008-3.624.025-5.427.042l-.814.008h-.746c.092-.013.14-.14.185-.262.088-.27.123-.486.156-.693.096-.605.113-.911.122-1.225,0-.263-.037-.525-.075-.788-.214-1.249-.59-2.014-.792-2.425-.268-.603-.646-1.109-1.112-1.707-.297-.374-.637-.722-.976-1.061l-.212-.22c-.212-.213-.425-.416-.645-.611-.238-.204-.484-.382-.73-.56-.33-.233-.567-.372-.776-.495-.541-.303-.897-.498-1.253-.685-.645-.339-1.306-.628-1.967-.916-.112-.052-.209-.087-.314-.087-.012,0-.217.086-.217.098-.009-.002-.018-.003-.028-.003-.097,0-.217.097-.283.231-.12.187-.116.452.01.64-.086,1.449-.07,2.714.047,3.854.062.597.168,1.153.323,1.698.143.615.423,1.22.705,1.783.474.989,1.196,1.929,2.09,2.718.425.349.858.654,1.326.918l-2.259-.151-2.289.008c.09-.145-.016-.413-.263-.688-.454-.505-1.004-.961-1.784-1.478-.638-.466-1.382-.769-2.038-1.036-1.383-.56-2.716-.832-4.076-.832-.749.008-1.308.117-1.801.212-.88.169-1.575.469-2.022.679-1.335.608-2.559,1.497-3.639,2.282l-.636.466c-.205.145-.337.358-.381.616-.104.241-.043.554.15.756,1.116,1.16,2.249,2.02,3.463,2.631,1.259.663,2.744,1.06,4.415,1.18.253.018.475.034.705.034,1.184,0,2.441-.2,3.735-.594.667-.192,1.371-.494,2.216-.951.569-.301,1.171-.723,1.953-1.367l3.629-.02c-.169.003-.337.12-.589.317-.9.709-1.685,1.589-2.47,2.768-1.101,1.646-1.701,3.574-2.232,5.274l-.389,1.222c-.201.12-.331.364-.331.625,0,.431.374.81.801.81.743-.026,1.363-.096,1.953-.221.768-.15,1.475-.446,2.004-.688.646-.297,1.228-.716,1.614-.994.578-.446,1.094-.935,1.58-1.495.943-1.087,1.688-2.298,2.215-3.599.29-.685.51-1.379.671-2.122.068-.271.102-.552.136-.832l.042-.288c.034-.264.051-.536.051-.817,1.783.09,3.622.123,5.469.149l1.169.034h.221l-.487.317c-.422.394-.822.908-1.226,1.574-.413.663-.691,1.385-.909,2.004-.52,1.475-.782,3.027-1.035,4.528-.221,1.317-.449,2.677-.847,3.972-.053.159-.036.317.053.467.08.152.222.263.379.298l.363-.033.269.017c.58-.113,1.191-.292,1.821-.535.608-.223,1.209-.537,1.835-.96.583-.381,1.13-.825,1.672-1.358.467-.459.912-.99,1.443-1.723.862-1.192,1.493-2.586,1.876-4.143.373-1.484.35-3.003-.068-4.392l.282.062,4.176.083c-.292.448-.534.926-.682,1.458-.102.39-.127.814-.161,1.212-.034.39-.034.771-.017,1.161.017.407.025.814.068,1.212.034.415.076.822.11,1.237.025.331.254.602.602.602.322,0,.627-.271.61-.602-.016-.292-.016-.569.011-.859.078-.419.191-.822.341-1.222.156-.298.327-.583.522-.862.311-.372.643-.72.982-1.073.203-.212.415-.424.61-.644.239-.277.446-.553.7-.806.11-.075.221-.147.334-.211.221-.133.376-.327.498-.539,4.312.07,8.621.141,12.915.193,5.101.068,10.211.11,15.313.11,2.102,0,4.212,0,6.313-.017,3.61-.034,7.22-.076,10.83-.161,2-.034,4.008-.093,6.008-.153l4.805-.127c6.927-.162,14.428-.237,23.608-.237,6.635,0,13.279.043,19.914.093l2.839.017,2.796.025,2.796.017c5.601.042,11.203.076,16.804.076,6.561,0,68.211-.044,73.465-.136,7.641-.11,13.627-.247,19.847-.585.598-.034,1.077-.23,1.463-.599.387-.395.608-.926.608-1.456,0-1.123-.933-2.072-2.039-2.072Z" />
          </svg>
        </div>

        {/* Right section — desktop CTA */}
        <div className="hidden md:flex items-center justify-end w-1/3">
          <HeaderContactAction
            label="Get in touch"
            className="relative group p-[3px] bg-neutral-300 font-label text-[11px] uppercase tracking-[0.2em] overflow-hidden inline-flex"
          >
            {/* Outer spinning gradient glow */}
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#a3a3a3_95%,#e5e5e5_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
            {/* Inner spinning gradient */}
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_85%,#d4d4d4_95%,#737373_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Button content */}
            <span className="relative z-10 w-full h-full bg-neutral-200 text-black px-5 py-1.5 flex items-center justify-center gap-2">
              Get in touch
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="transform transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M1 5H9M9 5L5 1M9 5L5 9" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </span>
          </HeaderContactAction>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-[10px] font-label uppercase tracking-[0.2em] text-white border border-white/20 px-4 py-1.5 hover:bg-white hover:text-black transition-colors"
          onClick={() => useUIStore.getState().setMenuOpen(true)}
          aria-label="Open menu"
        >
          Menu
        </button>
      </header>
    </div>
  );
}
