import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { router } from "./router";
import SmoothScroll from "./components/animations/SmoothScroll";
import ScrollProgress from "./components/animations/ScrollProgress";
import GravityCursor from "./components/animations/GravityCursor";
import CurrentlyWidget from "./components/ui/CurrentlyWidget";
import ReturnVisitor from "./components/animations/ReturnVisitor";
import PresentationMode from "./components/animations/PresentationMode";
import ClickSound from "./components/animations/ClickSound";
import SectionCounter from "./components/animations/SectionCounter";
import LiveTab from "./components/animations/LiveTab";
import BatterySaver from "./components/animations/BatterySaver";
import ContextCursor from "./components/animations/ContextCursor";
import SpeedReader from "./components/animations/SpeedReader";
import Preloader from "./components/Preloader";
import { markAppReady } from "./lib/appReady";

export default function App() {
  const [loading, setLoading] = useState(true);

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
              // Entrance animations wait for this — until now the hero was
              // playing its whole timeline behind the overlay.
              markAppReady()
            }}
          />
        )}
      </AnimatePresence>

      <ScrollProgress />
      <GravityCursor />
      <CurrentlyWidget />
      <ReturnVisitor />
      <PresentationMode />
      <ClickSound />
      <SectionCounter />
      <LiveTab />
      <BatterySaver />
      <ContextCursor />
      <SpeedReader />
      <RouterProvider router={router} />
    </>
  );
}
