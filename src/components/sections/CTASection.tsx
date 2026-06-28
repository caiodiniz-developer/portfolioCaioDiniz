import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useT } from "@/hooks/useTranslation";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useCursorStore } from "@/store/useCursorStore";
import Magnetic from "@/components/animations/Magnetic";
import { CubertoBtn } from "./Hero";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);
  const setCursor = useCursorStore((s) => s.setState);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".cta-tag", { y: 14, opacity: 0 });
      gsap.set(".cta-h", { y: "105%" });
      gsap.set(".cta-sub", { y: 22, opacity: 0 });
      gsap.set(".cta-btns", { y: 22, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current!, start: "top 72%", once: true },
        defaults: { ease: "power3.out" },
      });
      tl.to(".cta-tag", { y: 0, opacity: 1, duration: 0.55 }, 0);
      tl.to(".cta-h", { y: "0%", duration: 0.95 }, 0.15);
      tl.to(".cta-sub", { y: 0, opacity: 1, duration: 0.7 }, 0.5);
      tl.to(".cta-btns", { y: 0, opacity: 1, duration: 0.65 }, 0.62);
    }, ref);

    return () => ctx.revert();
  }, []);

  const HL: React.CSSProperties = {
    fontFamily: "Syne, sans-serif",
    fontSize: "clamp(3rem, 9vw, 8rem)",
    letterSpacing: "-0.055em",
    lineHeight: "0.88",
    fontWeight: 900,
    color: "#ffffff",
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "#0d0d0d",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.15 }}
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,13,13,0.65), rgba(13,13,13,0.5), rgba(13,13,13,0.65))",
        }}
      />

      <div className="container-custom relative z-10 w-full">
        <span className="cta-tag inline-flex items-center gap-3 mb-10 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
          <span className="w-5 h-px bg-white/15" />
          {t.contact.badge}
        </span>

        {/* Big headline — no "Have an idea?" */}
        <div className="overflow-hidden mb-3">
          <h2 className="cta-h" style={HL}>
            {lang === "en" ? "Let's work" : "Vamos"}
          </h2>
        </div>
        <div className="overflow-hidden mb-12">
          <h2
            className="cta-h"
            style={{ ...HL, color: "rgba(255,255,255,0.18)" }}
          >
            {lang === "en" ? "together." : "trabalhar."}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <p
            className="cta-sub text-sm text-white/30 leading-relaxed"
            style={{ maxWidth: 360 }}
          >
            {t.cta.sub}
          </p>

          <div className="cta-btns flex gap-3 flex-wrap flex-shrink-0">
            <Magnetic strength={0.3}>
              <Link to="/contact">
                <CubertoBtn
                  theme="dark"
                  onMouseEnter={() => setCursor("pointer")}
                  onMouseLeave={() => setCursor("default")}
                >
                  {t.cta.primary} <ArrowUpRight size={13} />
                </CubertoBtn>
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link to="/contact">
                <CubertoBtn
                  theme="dark-outline"
                  onMouseEnter={() => setCursor("pointer")}
                  onMouseLeave={() => setCursor("default")}
                >
                  {t.cta.secondary}
                </CubertoBtn>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
