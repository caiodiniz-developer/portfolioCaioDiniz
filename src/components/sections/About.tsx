import { useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useT } from "@/hooks/useTranslation";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useCursorStore } from "@/store/useCursorStore";
import PaintReveal from "@/components/animations/PaintReveal";
import { SITE } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    value: "100%",
    end: 100,
    suffix: "%",
    labelPt: "Funcional e otiizado.",
    labelEn: "Custom projects",
    numeric: true,
  },
  {
    value: "Design",
    end: 0,
    suffix: "",
    labelPt: "Experiências digitais premium",
    labelEn: "Premium digital experiences",
    numeric: false,
  },
  {
    value: "Mobile",
    end: 0,
    suffix: "",
    labelPt: "Responsivo em qualquer dispositivo",
    labelEn: "Responsive on every device",
    numeric: false,
  },
  {
    value: "Site",
    end: 0,
    suffix: "",
    labelPt: "Totalmente feito ao seu gosto.",
    labelEn: "Search engine optimized",
    numeric: false,
  },
  {
    value: "Secure",
    end: 0,
    suffix: "",
    labelPt: "Arquitetura segura e escalável",
    labelEn: "Secure & scalable architecture",
    numeric: false,
  },
  {
    value: "24h",
    end: 24,
    suffix: "h",
    labelPt: "Resposta rápida",
    labelEn: "Fast response time",
    numeric: true,
  },
];

export default function About() {
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);
  const setCursor = useCursorStore((s) => s.setState);
  const ref = useRef<HTMLElement>(null);
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".ab-label", { y: 20, opacity: 0 });
      gsap.set(".ab-title-line", { y: "105%" });
      gsap.set(".ab-desc", { y: 24, opacity: 0 });
      gsap.set(".ab-cta", { y: 20, opacity: 0 });
      gsap.set(".ab-stat", { y: 32, opacity: 0 });
      gsap.set(".ab-img", { scale: 1.06, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current!, start: "top 72%", once: true },
        defaults: { ease: "power3.out" },
      });
      tl.to(".ab-label", { y: 0, opacity: 1, duration: 0.6 }, 0);
      tl.to(".ab-title-line", { y: "0%", duration: 0.95, stagger: 0.12 }, 0.15);
      tl.to(".ab-desc", { y: 0, opacity: 1, duration: 0.7 }, 0.5);
      tl.to(".ab-cta", { y: 0, opacity: 1, duration: 0.6 }, 0.65);
      tl.to(
        ".ab-stat",
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 },
        0.38,
      );
      tl.to(
        ".ab-img",
        { scale: 1, opacity: 1, duration: 1.1, ease: "power2.out" },
        0.1,
      );

      stats.forEach((s, i) => {
        if (!s.numeric) return;
        const el = statRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: s.end,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.5 + i * 0.1,
          scrollTrigger: {
            trigger: ref.current!,
            start: "top 68%",
            once: true,
          },
          onUpdate() {
            el.textContent = Math.floor(obj.val) + s.suffix;
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="about-section"
      style={{
        background: "#111111",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "grid",
        gridTemplateColumns: "1fr 44%",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @media (max-width: 900px) {
          .about-section { grid-template-columns: 1fr !important; }
          .about-img-col { min-height: 70vw !important; order: -1; }
        }
      `}</style>

      {/* Left: content */}
      <div
        className="flex flex-col justify-center gap-10"
        style={{
          padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4.5rem)",
        }}
      >
        <span className="ab-label inline-flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
          <span className="w-5 h-px bg-white/15" />
          {t.about.badge}
        </span>

        <div>
          {(lang === "en"
            ? ["I don't just build", "websites.", "I build experiences."]
            : ["Não construo", "só sites.", "Construo experiências."]
          ).map((line, i) => (
            <div key={i} className="overflow-hidden">
              <h2
                className="ab-title-line font-black"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: "0.95",
                  color: i === 1 ? "rgba(255,255,255,0.18)" : "#ffffff",
                }}
              >
                {line}
              </h2>
            </div>
          ))}
        </div>

        <p className="ab-desc text-sm text-white/35 leading-relaxed max-w-md">
          {t.about.description}
        </p>

        <div className="grid grid-cols-3 gap-0 overflow-hidden">
          {stats.map((s, i) => (
            <div
              key={i}
              className="ab-stat flex flex-col gap-1.5 py-5 pr-4"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                borderRight:
                  i % 3 < 2 ? "1px solid rgba(255,255,255,0.07)" : undefined,
                paddingLeft: i % 3 > 0 ? "1rem" : 0,
              }}
            >
              <span
                ref={(el) => {
                  statRefs.current[i] = el;
                }}
                className="font-black text-white"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.9rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: "1",
                }}
              >
                {s.value}
              </span>
              <span className="text-[0.6rem] font-semibold text-white/28 uppercase tracking-[0.09em]">
                {lang === "en" ? s.labelEn : s.labelPt}
              </span>
            </div>
          ))}
        </div>

        <a
          href={SITE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="ab-cta inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-white/35 hover:text-white transition-colors duration-300 group w-fit"
          onMouseEnter={() => setCursor("pointer")}
          onMouseLeave={() => setCursor("default")}
        >
          <span className="w-8 h-px bg-white/20 group-hover:w-12 transition-all duration-300" />
          {t.about.cta}
          <ArrowUpRight size={13} />
        </a>
      </div>

      {/* Right: photo with B&W paint reveal */}
      <div
        className="about-img-col relative overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        <div className="ab-img absolute inset-0">
          <PaintReveal
            src="/assets/minha-foto-1.png"
            alt="Caio Diniz"
            style={{ width: "100%", height: "100%" }}
            brushSize={105}
          />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "35%",
            background:
              "linear-gradient(to top, rgba(17,17,17,0.65), transparent)",
            zIndex: 10,
          }}
        />
      </div>
    </section>
  );
}
