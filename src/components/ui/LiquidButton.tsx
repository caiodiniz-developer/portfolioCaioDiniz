import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";

/* The liquid-metal pill button used by the hero, the header CTA and the
   projects section. Lived inside sections/Hero.tsx until it was needed by
   more than the hero. */

type CubertoTheme = "dark" | "dark-outline" | "light" | "light-outline";

/* Each liquid-metal button owns a WebGL context, and compiling its shader was
   the single most expensive thing on first load (~300ms for the four on the
   home page). They now start as a static metallic gradient and upgrade one at
   a time, in idle slots, once actually on screen. */
const shaderQueue: Array<() => void> = [];
let shaderPumping = false;
function whenIdle(cb: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 2000 });
  else setTimeout(cb, 120);
}
function enqueueShader(init: () => void) {
  shaderQueue.push(init);
  if (shaderPumping) return;
  shaderPumping = true;
  const step = () => {
    const next = shaderQueue.shift();
    if (!next) { shaderPumping = false; return; }
    next();
    whenIdle(step);
  };
  whenIdle(step);
}

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

  // Only when the label changes — without deps this forced a layout read on
  // every render (every hover, every ripple).
  useLayoutEffect(() => {
    if (measureRef.current) {
      setWidth(Math.max(Math.ceil(measureRef.current.offsetWidth) + 52, 110));
    }
  }, [children]);

  useEffect(() => {
    const id = "lmb-canvas-style";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = `.lmb-shader canvas{width:100%!important;height:100%!important;display:block!important;position:absolute!important;top:0!important;left:0!important;border-radius:100px!important}@keyframes lmb-ripple{0%{transform:translate(-50%,-50%)scale(0);opacity:.6}100%{transform:translate(-50%,-50%)scale(4);opacity:0}}`;
      document.head.appendChild(s);
    }
    const el = shaderRef.current;
    let alive = true;
    const init = () => {
      if (!alive || !el || mountRef.current) return;
      mountRef.current = new ShaderMount(el, liquidMetalFragmentShader, {
        u_repetition:4, u_softness:0.5, u_shiftRed:0.3, u_shiftBlue:0.3,
        u_distortion:0, u_contour:0, u_angle:45, u_scale:8,
        u_shape:1, u_offsetX:0.1, u_offsetY:-0.1,
      }, undefined, 0.6);
    };
    const io = el ? new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { io?.disconnect(); enqueueShader(init); }
    }) : null;
    if (el) io!.observe(el);
    return () => { alive = false; io?.disconnect(); mountRef.current?.dispose?.(); mountRef.current = null; };
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
        {/* label — visual only; the hit-area button below carries the accessible name */}
        <div aria-hidden style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", gap:6, zIndex:30, pointerEvents:"none", transform:"translateZ(20px)" }}>
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
            <div ref={shaderRef} className="lmb-shader" style={{ borderRadius:100, overflow:"hidden", position:"relative", width, height:H, background:"linear-gradient(135deg,#8a8a8a 0%,#2a2a2a 38%,#b5b5b5 55%,#3a3a3a 80%,#9a9a9a 100%)" }} />
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
          <span style={{ position:"absolute", width:1, height:1, overflow:"hidden", clip:"rect(0 0 0 0)", whiteSpace:"nowrap" }}>{children}</span>
          {ripples.map(r => (
            <span key={r.id} style={{ position:"absolute", left:r.x, top:r.y, width:20, height:20, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,255,255,.4) 0%,transparent 70%)", pointerEvents:"none", animation:"lmb-ripple .6s ease-out" }} />
          ))}
        </button>
      </div>
    </div>
  );
}
