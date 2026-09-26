import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { router } from "./router";
import SmoothScroll from "./components/animations/SmoothScroll";
import ScrollProgress from "./components/animations/ScrollProgress";
import GravityCursor from "./components/animations/GravityCursor";
import PresentationMode from "./components/animations/PresentationMode";
import LiveTab from "./components/animations/LiveTab";
import BatterySaver from "./components/animations/BatterySaver";
import ContextCursor from "./components/animations/ContextCursor";
import Preloader from "./components/Preloader";
import { markAppReady } from "./lib/appReady";

const INTRO_KEY = "intro-seen";

/* The intro plays once per session: it's a first impression, not something
   to sit through again on every reload or return from a case study link. */
function shouldPlayIntro() {
  try { return !sessionStorage.getItem(INTRO_KEY); } catch { return true; }
}

export default function App() {
  const [loading, setLoading] = useState(shouldPlayIntro);

  useEffect(() => {
    if (!loading) markAppReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(
      "%c  CAIO DINIZ  ",
      "background:linear-gradient(90deg,#1a1a1a,#2a2a2a);color:#fff;font-size:16px;font-weight:900;letter-spacing:0.2em;padding:12px 24px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);"
    );
    console.log(
      "%c ↳ Full Stack Developer  ·  Campinas, SP",
      "color:rgba(255,255,255,0.35);font-size:11px;font-style:italic;padding:2px 0;"
    );
    console.log(
      "%c ─────────────────────────────────────────",
      "color:rgba(255,255,255,0.08);font-size:10px;"
    );
    console.log(
      "%c 👋  Oi! Você inspecionou o código.",
      "color:#ffffff;font-size:12px;font-weight:700;padding:4px 0;"
    );
    console.log(
      "%c    Temos muito em comum — vamos trabalhar juntos?",
      "color:rgba(255,255,255,0.5);font-size:11px;"
    );
    console.log(
      "%c ✉  cvdinizramos@gmail.com",
      "color:#4ade80;font-size:12px;font-weight:700;padding:4px 0 2px;"
    );
    console.log(
      "%c 🔗  github.com/caiodiniz-developer",
      "color:#60a5fa;font-size:11px;padding:0 0 6px;"
    );
    console.log(
      "%c 💡  Pressione Ctrl+` para abrir o terminal secreto. Tente: snake, joke, matrix",
      "color:rgba(80,250,123,0.6);font-size:11px;font-style:italic;padding:0 0 8px;"
    );
  }, []);

  return (
    <>
      {/* SmoothScroll must mount BEFORE the Preloader: React fires effects in tree
          order, and the Preloader's stopLenis() is a no-op unless Lenis already exists. */}
      <SmoothScroll />

      <AnimatePresence mode="wait">
        {loading && (
          <Preloader
            key="preloader"
            onDone={() => {
              setLoading(false)
              try { sessionStorage.setItem(INTRO_KEY, "1") } catch { /* storage blocked */ }
              // Entrance animations wait for this — until now the hero was
              // playing its whole timeline behind the overlay.
              markAppReady()
            }}
          />
        )}
      </AnimatePresence>

      <ScrollProgress />
      <GravityCursor />
      <PresentationMode />
      <LiveTab />
      <BatterySaver />
      <ContextCursor />
      <RouterProvider router={router} />
    </>
  );
}
