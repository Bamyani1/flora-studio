'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Camera } from 'lucide-react';
import { useState } from 'react';
import { TransitionLink } from "@/components/layout/TransitionLink";
import { personJsonLd } from "@/lib/metadata";

const TEAM_MEMBERS = [
  {
    role: "Creative Director",
    name: "Julian Saint",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZxek1-WJMPyhTw8j9wdAU9dYDPFO6-dXY2uUPyRwuhCBfd0lzaV5YX2d1tnrKCrBM8y9EO2eGwuToSIRPs8uPP-cO73q0ei8V9esPZoE8ahhiDQvXJMj9NQgEsU3S8mcejDUuAtzix5EMdZMPXlfD_JqaTg6Bc6X9j5h_NOFrQfj8HNUXtFHdLqP5-re4PB_phE-GaeTz84O4Kup7Id2tNQo6L1JVqpCM-FshDZd-PY674brLxJ2kA0HsHR6plXxP_pW5jq5pgI0"
  },
  {
    role: "Lead Stylist",
    name: "Elena Vrai",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWXZ5kBwBuq4sGbbPFz7TRKu5eI09Kx1-bsf0KxmZiMsHgSprYvNmnUVB6Z1-9Xapy20qu_4ovg8eGiN6Hd_344cWP7EfNNTw6UoVoxLTKztVF3vsZOlbkeWeP0nWMWHgd1EjNdQBJPSRoO_6z3KGWvwQhxJmERcd41sKlWqU6jPHQdlysbhUOwg1WaKejw4u0QSYc39WrNE5uG1csbZYzenyEpiIlUrMWm8aHuOPpwVX54wkIwaGbdfdO86Bu6lSnFDBmBj47umg"
  },
  {
    role: "Archivist",
    name: "Marcus Thorne",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAY0nU5WufwlcTiies0hi9bxqOi28oDBkpadynikYjzkIQ9jWRKDsjCBAJ40ifIt8OPEyWxJ4MRuxkRfGZT6OCbGAcPG5O6mWttATCyfqRHWOjn3ZyZwwy3bqaiXo9QDDGxaxYkgaxY25g-wldV6MH7lgrB_1Pelzu7ltzyi21m9jWi8l6TFwQcQQLHyulrADqAnCfqFG4wSEaCqhmwgEkWpqYUXSTxrfDJJc_3OuBVINsRWjKzlbWiknYqQiTGWGAYG4TsNhTd-HU"
  }
];

const StaggeredText = ({ text, className }: { text: string, className?: string }) => {
  const words = text.split(" ");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.08 } },
        hidden: {},
      }}
      className={className}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] pb-2">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "120%", opacity: 0, rotate: 5 },
              visible: { y: 0, opacity: 1, rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

export default function AboutPage() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  return (
    <div className="about-theme">
      <main id="main-content" className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />

        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20 film-reel-border overflow-hidden">
          <div className="max-w-screen-xl w-full flex flex-col items-center text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="flex items-center justify-center gap-4 mb-10"
            >
              <span className="w-12 h-px bg-primary/40"></span>
              <span className="font-label uppercase tracking-[0.5em] text-primary text-[10px]">Sequence 01: Vision</span>
              <span className="w-12 h-px bg-primary/40"></span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-[8rem] text-on-surface leading-[0.9] tracking-tighter mb-10">
              <StaggeredText text="The Art of" />
              <motion.span
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                className="italic text-primary block mt-4"
              >
                Visual Silence.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
              className="font-body text-xl md:text-2xl text-on-surface-variant/60 max-w-2xl leading-relaxed font-light"
            >
              Every frame is a dialogue between light and void. We capture the stillness that defines the narrative of the modern era.
            </motion.p>
          </div>
        </section>

        <div className="w-full h-1 bg-surface-container-lowest"></div>
        <div className="scene-divider"></div>

        {/* Manifesto */}
        <section className="py-48 md:py-64 px-6 bg-surface-container-lowest relative overflow-hidden flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.03, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <span className="font-display text-[30vw] select-none italic text-on-surface">Manifesto</span>
          </motion.div>

          <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="flex items-center gap-6 mb-24"
            >
              <span className="w-12 h-[1px] bg-primary/40"></span>
              <span className="font-label uppercase tracking-[0.5em] text-primary/60 text-[10px]">Sequence 02: Essence</span>
              <span className="w-12 h-[1px] bg-primary/40"></span>
            </motion.div>

            <blockquote className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.2] text-center text-on-surface max-w-5xl mx-auto relative z-10 tracking-tight">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                We don&apos;t just photograph life; we <span className="text-primary italic font-light">sculpt</span> the shadows to reveal the hidden architecture of the soul.
              </motion.div>
            </blockquote>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-24 flex flex-col items-center gap-6"
            >
              <span className="font-label uppercase tracking-[0.4em] text-xs text-on-surface-variant/60">The Directors</span>
              <div className="flex gap-2">
                <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="scene-divider"></div>
        <div className="w-full h-1 bg-surface-container-lowest"></div>

        {/* Team */}
        <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-surface film-reel-border relative">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-20">

            {/* Left Column: Sticky Image & Header */}
            <div className="lg:sticky lg:top-32 h-fit flex flex-col gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="font-label uppercase tracking-[0.5em] text-primary/60 text-[10px] block mb-6">Sequence 03: The Collective</span>
                <h2 className="font-display text-5xl md:text-7xl tracking-tighter mb-6 text-on-surface">Team Muse</h2>
                <p className="font-body text-on-surface-variant/60 leading-relaxed max-w-md text-base font-light">
                  A symposium of creators, visionaries, and technologists dedicated to the perfection of the image.
                </p>
              </motion.div>

              {/* Dynamic Image Container */}
              <div className="hidden lg:block w-full aspect-[4/5] relative rounded-sm overflow-hidden bg-surface-container-lowest border border-outline-variant/10 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hoveredMember !== null ? hoveredMember : 'default'}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    {hoveredMember !== null ? (
                      <Image
                        src={TEAM_MEMBERS[hoveredMember].img}
                        alt={TEAM_MEMBERS[hoveredMember].name}
                        fill
                        className="object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container-lowest">
                        <Camera className="w-12 h-12 text-outline-variant/20" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Interactive List */}
            <div className="flex flex-col justify-center pt-12 lg:pt-32">
              <div className="border-t border-outline-variant/20">
                {TEAM_MEMBERS.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredMember(index)}
                    onMouseLeave={() => setHoveredMember(null)}
                    className="group border-b border-outline-variant/20 py-10 md:py-16 cursor-pointer flex flex-col gap-6"
                  >
                    <div className="flex items-start md:items-center justify-between gap-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
                        <span className="font-mono text-primary/40 text-sm group-hover:text-primary transition-colors duration-500">
                          0{index + 1}
                        </span>
                        <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-on-surface group-hover:text-white transition-colors duration-500 tracking-tight">
                          {member.name}
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-500 shrink-0">
                        <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-on-primary transition-colors duration-500" />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 md:pl-16">
                      <span className="font-label uppercase tracking-[0.3em] text-[10px] md:text-xs text-primary transition-colors duration-500">
                        {member.role}
                      </span>
                    </div>

                    {/* Mobile Image */}
                    <div className="lg:hidden w-full aspect-[4/5] relative mt-8 rounded-sm overflow-hidden bg-surface-container-lowest border border-outline-variant/10">
                      <Image
                        src={member.img}
                        alt={member.name}
                        fill
                        className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </section>

        <div className="scene-divider"></div>
        <div className="w-full h-1 bg-surface-container-lowest"></div>

        {/* Process */}
        <section className="py-64 px-12 bg-surface-container-lowest">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
            <div className="order-2 md:order-1 space-y-20">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="flex items-center gap-4"
                >
                  <span className="font-label uppercase tracking-[0.5em] text-primary text-[10px]">Sequence 04: Process</span>
                </motion.div>
                <h2 className="font-display italic text-primary text-5xl md:text-7xl block tracking-tighter">
                  <StaggeredText text="Technical Mastery." />
                </h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="font-body text-2xl text-on-surface-variant font-light leading-relaxed max-w-xl"
                >
                  Merging archival 35mm film aesthetics with high-fidelity digital precision. We obsess over the grain structure and tonal depth.
                </motion.p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 border-t border-outline-variant/10 pt-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-6"
                >
                  <h4 className="font-label uppercase tracking-widest text-primary text-xs font-bold">Curation Phase</h4>
                  <p className="font-body text-sm text-on-surface-variant/50 leading-loose">A rigorous elimination process. We seek the frames that hold tension in their silence.</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="space-y-6"
                >
                  <h4 className="font-label uppercase tracking-widest text-primary text-xs font-bold">Darkroom Logic</h4>
                  <p className="font-body text-sm text-on-surface-variant/50 leading-loose">Digital grading inspired by the photochemical response of 1960s French cinematic stock.</p>
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: "brightness(0.5)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="order-1 md:order-2 aspect-square relative group overflow-hidden"
            >
              <Image
                alt="Studio Interior"
                className="w-full h-full object-cover grayscale brightness-50 group-hover:brightness-90 transition-all duration-[2s] scale-110 group-hover:scale-100 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8-vfQCZEqIx1r12WDFxwKuTM4vqEbXPUi1I13AGkEb1NVd05Gz8nQoDf8EOvRK16q72r9ssnVRcaGRiZSEllnkWBiWsJVO1sEEFr9xBqk9TPuebv0-GjqSj-X2l2fdtksi15YGuSDW0n_JQFP8tGeyQ9EMZhf2cZMKlpyhWh2ejN19eaXluDjkFseShyLy1qw4NdgABQfxJ4L3CMWVpDaMIMgnEVvqai4Q9zGp1l-BBPCYRxGt2MfNJdOvTJPoQgJ8FOw0Li60vQ"
                fill
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-[24px] border-surface-container-lowest mix-blend-multiply pointer-events-none transition-all duration-1000 group-hover:border-[12px]"></div>
            </motion.div>
          </div>
        </section>

        <div className="scene-divider"></div>
        <div className="w-full h-1 bg-surface-container-lowest"></div>

        {/* End Scene */}
        <section className="py-72 px-12 bg-surface text-center film-reel-border relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto space-y-16">
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.8em" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="font-label uppercase text-primary/40 text-[11px] block"
            >
              End Scene
            </motion.span>
            <h2 className="font-display text-6xl md:text-[9rem] tracking-tighter text-on-surface leading-[0.85]">
              <StaggeredText text="Write Your" />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 }}
                className="italic text-primary block mt-4"
              >
                History.
              </motion.span>
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.5 }}
              className="pt-12"
            >
              <TransitionLink className="inline-flex items-center gap-6 group text-primary font-label uppercase tracking-[0.5em] text-sm font-semibold" href="/contact">
                <span>Start the sequence</span>
                <div className="relative flex items-center">
                  <span className="w-16 h-px bg-primary group-hover:w-32 transition-all duration-700"></span>
                  <ChevronRight className="w-4 h-4 -ml-2 group-hover:ml-0 transition-all duration-700" />
                </div>
              </TransitionLink>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.03, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            <span className="font-display text-[35vw] tracking-tighter">FIN</span>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
