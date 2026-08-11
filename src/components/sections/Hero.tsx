import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useT } from "@/hooks/useTranslation";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useCursorStore } from "@/store/useCursorStore";
import Magnetic from "@/components/animations/Magnetic";
import PaintReveal from "@/components/animations/PaintReveal";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

/* ─── Dev uptime counter ─── */
const CODING_START = new Date("2023-01-01");

function DevUptime({ lang }: { lang: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const ms = now.getTime() - CODING_START.getTime();
  const days = Math.floor(ms / 86_400_000);
  const hrs = Math.floor((ms % 86_400_000) / 3_600_000);
  const min = Math.floor((ms % 3_600_000) / 60_000);

  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: '"JetBrains Mono","Fira Code",monospace',
        fontSize: "0.58rem",
        color: "rgba(255,255,255,0.18)",
        letterSpacing: "0.04em",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.1)" }}>$</span>
      {`uptime ${days}d ${hrs}h ${min}m`}
    </span>
  );
}

/* ─── Char-by-char reveal ─── */
function CharReveal({
  text,
  style,
}: {
  text: string;
  style?: React.CSSProperties;
}) {
  // overflow:hidden on the LINE block — descenders (g, p, q) show freely
  return (
    <span
      style={{
        display: "block",
        overflow: "hidden",
        paddingBottom: "0.45em",
        marginBottom: "-0.17em",
        ...style,
      }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{ display: "inline-block", verticalAlign: "top" }}
        >
          <span className="h-char" style={{ display: "inline-block" }}>
            {char === " " ? " " : char}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ─── Compile intro overlay ─── */
function CompileIntro({ onDone }: { onDone: () => void }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setOpacity(1), 60);
    const t2 = setTimeout(() => setOpacity(0), 820);
    const t3 = setTimeout(() => onDone(), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        padding: "clamp(6rem,11vw,8.5rem) clamp(1.5rem,5vw,4.5rem)",
        pointerEvents: "none",
        opacity,
        transition: opacity === 0 ? "opacity 0.3s ease" : "opacity 0.12s ease",
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono","Fira Code",monospace',
          fontSize: "clamp(0.62rem,1.1vw,0.82rem)",
          lineHeight: 1.9,
          userSelect: "none",
        }}
      >
        <div style={{ color: "rgba(255,255,255,0.18)", marginBottom: "0.5em" }}>
          {"// portfolio.tsx"}
        </div>
        <div>
          <span style={{ color: "rgba(130,200,130,0.7)" }}>const</span>{" "}
          <span style={{ color: "rgba(150,185,255,0.8)" }}>developer</span>{" "}
          <span style={{ color: "rgba(255,255,255,0.35)" }}>=</span>{" "}
          <span style={{ color: "rgba(255,255,255,0.35)" }}>{"{"}</span>
        </div>
        <div style={{ paddingLeft: "1.4em" }}>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>name</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>: </span>
          <span style={{ color: "rgba(200,155,100,0.8)" }}>"Caio Diniz"</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>,</span>
        </div>
        <div style={{ paddingLeft: "1.4em" }}>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>role</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>: </span>
          <span style={{ color: "rgba(200,155,100,0.8)" }}>
            "Full Stack Developer"
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>,</span>
        </div>
        <div style={{ paddingLeft: "1.4em" }}>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>available</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>: </span>
          <span style={{ color: "rgba(100,180,255,0.8)" }}>true</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>,</span>
        </div>
        <div style={{ paddingLeft: "1.4em" }}>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>stack</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>: </span>
          <span style={{ color: "rgba(200,155,100,0.8)" }}>
            ["React", "Node.js", "TypeScript"]
          </span>
        </div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>{"}"}</span>
        </div>
        <div style={{ marginTop: "0.6em", color: "rgba(255,255,255,0.18)" }}>
          {"// compiling experience..."}
          <span
            style={{
              animation: "compileBlink 0.6s step-end infinite",
              marginLeft: 2,
            }}
          >
            ▋
          </span>
        </div>
      </div>
      <style>{`@keyframes compileBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

/* ─── Hero ─── */
export default function Hero() {
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);
  const setCursor = useCursorStore((s) => s.setState);
  const ref = useRef<HTMLElement>(null);
  const [showCompile, setShowCompile] = useState(
    () => !sessionStorage.getItem("hero-compiled"),
  );

  const HL: React.CSSProperties = {
    fontFamily: "Syne, sans-serif",
    fontWeight: 900,
    letterSpacing: "-0.055em",
    lineHeight: "0.88",
    fontSize: "clamp(2.8rem, 7.5vw, 7rem)",
  };

  const w1 = lang === "en" ? "Building" : "Criando";
  const w2 = lang === "en" ? "digital" : "produtos";
  const w3 = lang === "en" ? "products." : "digitais.";

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".h-char", { y: "140%" }); // must exceed outer-block clip (lineHeight + paddingBottom)
      gsap.set(".hero-badge", { y: 14, opacity: 0 });
      gsap.set(".hero-sub", { y: 24, opacity: 0 });
      gsap.set(".hero-btns", { y: 20, opacity: 0 });
      gsap.set(".hero-photo", { clipPath: "inset(100% 0 0 0)" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".hero-badge", { y: 0, opacity: 1, duration: 0.6 }, 0.1);
      tl.to(
        ".h-char",
        { y: "0%", duration: 0.9, stagger: { each: 0.018 } },
        0.22,
      );
      tl.to(".hero-sub", { y: 0, opacity: 1, duration: 0.65 }, 0.65);
      tl.to(".hero-btns", { y: 0, opacity: 1, duration: 0.6 }, 0.78);
      tl.to(
        ".hero-photo",
        { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "power4.inOut" },
        0.3,
      );

      gsap.to(".hero-photo-inner", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current!,
          start: "top top",
          end: "bottom top",
          scrub: 1.6,
        },
      });

      const numEl = ref.current!.querySelector<HTMLElement>(".hero-proj-num");
      if (numEl) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: projects.length,
          duration: 1.4,
          ease: "power2.out",
          delay: 1.0,
          onUpdate() {
            numEl.textContent = String(Math.round(obj.val));
          },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative"
      style={{ minHeight: "100svh", background: "#0d0d0d" }}
    >
      {showCompile && (
        <CompileIntro
          onDone={() => {
            sessionStorage.setItem("hero-compiled", "1");
            setShowCompile(false);
          }}
        />
      )}

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: 0.12,
          filter: "blur(1px)",
          transform: "scale(1.04)",
          zIndex: 0,
        }}
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(13,13,13,0.6) 100%)",
        }}
      />

      {/* Two-column layout */}
      <div
        className="hero-grid relative"
        style={{
          zIndex: 2,
          minHeight: "100svh",
          display: "grid",
          gridTemplateColumns: "1fr 42%",
        }}
      >
        {/* Left: content */}
        <div
          className="flex flex-col justify-center"
          style={{
            padding:
              "clamp(6rem,11vw,8.5rem) clamp(1.5rem,5vw,4.5rem) clamp(4rem,6vw,5rem)",
            gap: "clamp(1.2rem,2vw,1.8rem)",
          }}
        >
          {/* Badge + uptime */}
          <div
            className="hero-badge"
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 6px #22c55e88",
                  animation: "heroPulseGreen 2.4s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {lang === "en"
                  ? "Full Stack Developer · Available"
                  : "Full Stack Developer · Disponível"}
              </span>
            </div>
            <DevUptime lang={lang} />
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: '"JetBrains Mono","Fira Code",monospace',
                fontSize: "0.58rem",
                color: "rgba(255,255,255,0.18)",
                letterSpacing: "0.04em",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.1)" }}>$</span>
              {`count ./projects → `}
              <span className="hero-proj-num">0</span>
            </span>
          </div>

          {/* Headline — smooth lang crossfade, GSAP entrance only on mount */}
          <AnimatePresence mode="wait">
            <motion.div
              key={lang}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              style={{ lineHeight: "1" }}
            >
              <CharReveal text={w1} style={{ ...HL, color: "#ffffff" }} />
              <CharReveal
                text={w2}
                style={{ ...HL, color: "rgba(255,255,255,0.13)" }}
              />
              <CharReveal text={w3} style={{ ...HL, color: "#ffffff" }} />
            </motion.div>
          </AnimatePresence>

          <p
            className="hero-sub"
            style={{
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.3)",
              lineHeight: 1.75,
              maxWidth: 350,
            }}
          >
            {t.hero.sub}
          </p>

          <div className="hero-btns flex items-center gap-3 flex-wrap">
            <Magnetic strength={0.32}>
              <Link to="/projects">
                <CubertoBtn
                  theme="dark"
                  onMouseEnter={() => setCursor("pointer")}
                  onMouseLeave={() => setCursor("default")}
                >
                  {t.hero.ctaPrimary} <ArrowUpRight size={12} />
                </CubertoBtn>
              </Link>
            </Magnetic>
            <Magnetic strength={0.32}>
              <Link to="/contact">
                <CubertoBtn
                  theme="dark-outline"
                  onMouseEnter={() => setCursor("pointer")}
                  onMouseLeave={() => setCursor("default")}
                >
                  {t.hero.ctaSecondary}
                </CubertoBtn>
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Right: photo */}
        <div className="hero-photo-col relative overflow-hidden">
          <div
            className="hero-photo rounded-t-2xl overflow-hidden"
            style={{
              position: "absolute",
              top: "clamp(4.5rem,7vw,6rem)",
              right: "clamp(2rem,4vw,3.5rem)",
              bottom: 0,
              left: 0,
            }}
          >
            <div
              className="hero-photo-inner absolute"
              style={{ top: 0, bottom: "-24%", left: 0, right: 0 }}
            >
              <PaintReveal
                src="/assets/minha-foto-1.png"
                alt="Caio Diniz"
                brushSize={110}
                style={{ width: "100%", height: "100%" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  height: "45%",
                  background:
                    "linear-gradient(to top, rgba(13,13,13,0.65), transparent)",
                  zIndex: 10,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroPulseGreen {
          0%,100% { opacity:1; box-shadow:0 0 6px #22c55e88; }
          50%      { opacity:0.6; box-shadow:0 0 12px #22c55ecc; }
        }
        @media (max-width:860px) {
          .hero-grid        { grid-template-columns:1fr !important; }
          .hero-photo-col   { display:none !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── CubertoBtn — Liquid Metal CTA ─── */

type CubertoTheme = "dark" | "dark-outline" | "light" | "light-outline";

export function CubertoBtn({
  children,
  theme = "dark",
  className = "",
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { theme?: CubertoTheme }) {
  const [hovered,  setHovered]  = useState(false);
  const [pressed,  setPressed]  = useState(false);
  const [ripples,  setRipples]  = useState<Array<{x:number;y:number;id:number}>>([]);
  const [width,    setWidth]    = useState(148);
  const H = 46;

  const shaderRef  = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: external lib
  const mountRef   = useRef<any>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const rippleId   = useRef(0);

  useLayoutEffect(() => {
    if (measureRef.current) {
      setWidth(Math.max(Math.ceil(measureRef.current.offsetWidth) + 52, 110));
    }
  });

  useEffect(() => {
    const id = "lmb-canvas-style";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = `.lmb-shader canvas{width:100%!important;height:100%!important;display:block!important;position:absolute!important;top:0!important;left:0!important;border-radius:100px!important}@keyframes lmb-ripple{0%{transform:translate(-50%,-50%)scale(0);opacity:.6}100%{transform:translate(-50%,-50%)scale(4);opacity:0}}`;
      document.head.appendChild(s);
    }
    if (shaderRef.current) {
      mountRef.current?.destroy?.();
      mountRef.current = new ShaderMount(shaderRef.current, liquidMetalFragmentShader, {
        u_repetition:4, u_softness:0.5, u_shiftRed:0.3, u_shiftBlue:0.3,
        u_distortion:0, u_contour:0, u_angle:45, u_scale:8,
        u_shape:1, u_offsetX:0.1, u_offsetY:-0.1,
      }, undefined, 0.6);
    }
    return () => { mountRef.current?.destroy?.(); mountRef.current = null; };
  }, []);

  function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
    setHovered(true);
    mountRef.current?.setSpeed?.(1);
    onMouseEnter?.(e as React.MouseEvent<HTMLButtonElement>);
  }
  function handleMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
    setHovered(false); setPressed(false);
    mountRef.current?.setSpeed?.(0.6);
    onMouseLeave?.(e as React.MouseEvent<HTMLButtonElement>);
  }
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    mountRef.current?.setSpeed?.(2.4);
    setTimeout(() => mountRef.current?.setSpeed?.(hovered ? 1 : 0.6), 300);
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const rip = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
      setRipples(p => [...p, rip]);
      setTimeout(() => setRipples(p => p.filter(r => r.id !== rip.id)), 600);
    }
    onClick?.(e);
  }

  const shadow = pressed
    ? "0 0 0 1px rgba(0,0,0,.5),0 1px 2px rgba(0,0,0,.3)"
    : hovered
      ? "0 0 0 1px rgba(0,0,0,.4),0 12px 6px rgba(0,0,0,.05),0 8px 5px rgba(0,0,0,.1),0 4px 4px rgba(0,0,0,.15),0 1px 2px rgba(0,0,0,.2)"
      : "0 0 0 1px rgba(0,0,0,.3),0 20px 12px rgba(0,0,0,.08),0 9px 9px rgba(0,0,0,.12),0 2px 5px rgba(0,0,0,.15)";

  return (
    <div ref={wrapRef} className={`relative inline-block ${className}`} style={{ perspective:1000 }}>
      {/* measure span */}
      <span ref={measureRef} aria-hidden style={{ position:"absolute", visibility:"hidden", whiteSpace:"nowrap", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", pointerEvents:"none", top:0, left:0 }}>
        {children}
      </span>

      <div style={{ position:"relative", width, height:H, transformStyle:"preserve-3d", transition:"all .8s cubic-bezier(.34,1.56,.64,1)" }}>
        {/* label */}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", gap:6, zIndex:30, pointerEvents:"none", transform:"translateZ(20px)" }}>
          <span style={{ fontSize:11, color:"#666", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", textShadow:"0 1px 2px rgba(0,0,0,.5)", whiteSpace:"nowrap" }}>
            {children}
          </span>
        </div>
        {/* dark pill */}
        <div style={{ position:"absolute", inset:0, zIndex:20, transform:`translateZ(10px)${pressed?" translateY(1px) scale(.98)":""}`, transition:"all .8s cubic-bezier(.34,1.56,.64,1)" }}>
          <div style={{ width:width-4, height:H-4, margin:2, borderRadius:100, background:"linear-gradient(180deg,#202020 0%,#000 100%)", boxShadow:pressed?"inset 0 2px 4px rgba(0,0,0,.4)":"none" }} />
        </div>
        {/* shader */}
        <div style={{ position:"absolute", inset:0, zIndex:10, transform:`translateZ(0)${pressed?" translateY(1px) scale(.98)":""}`, transition:"all .8s cubic-bezier(.34,1.56,.64,1)" }}>
          <div style={{ width, height:H, borderRadius:100, boxShadow:shadow, transition:"box-shadow .15s" }}>
            <div ref={shaderRef} className="lmb-shader" style={{ borderRadius:100, overflow:"hidden", position:"relative", width, height:H }} />
          </div>
        </div>
        {/* hit area */}
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}
          onClick={handleClick}
          style={{ position:"absolute", inset:0, background:"transparent", border:"none", cursor:"pointer", outline:"none", zIndex:40, transform:"translateZ(25px)", borderRadius:100, overflow:"hidden" }}
          {...props}
        >
          {ripples.map(r => (
            <span key={r.id} style={{ position:"absolute", left:r.x, top:r.y, width:20, height:20, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,255,255,.4) 0%,transparent 70%)", pointerEvents:"none", animation:"lmb-ripple .6s ease-out" }} />
          ))}
        </button>
      </div>
    </div>
  );
}
