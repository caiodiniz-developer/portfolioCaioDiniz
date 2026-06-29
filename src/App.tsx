import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import CustomCursor from "./components/animations/CustomCursor";
import SmoothScroll from "./components/animations/SmoothScroll";
import ScrollProgress from "./components/animations/ScrollProgress";
import GravityCursor from "./components/animations/GravityCursor";
import CurrentlyWidget from "./components/ui/CurrentlyWidget";
import ReturnVisitor from "./components/animations/ReturnVisitor";
import PresentationMode from "./components/animations/PresentationMode";
import ClickSound from "./components/animations/ClickSound";

export default function App() {
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
      "%c 🔗  github.com/caiodiniz-dev",
      "color:#60a5fa;font-size:11px;padding:0 0 6px;"
    );
    console.log(
      "%c 💡  Pressione Ctrl+` para abrir o terminal secreto. Tente: snake, joke, matrix",
      "color:rgba(80,250,123,0.6);font-size:11px;font-style:italic;padding:0 0 8px;"
    );
  }, []);

  return (
    <>
      <CustomCursor />
      <SmoothScroll />
      <ScrollProgress />
      <GravityCursor />
      <CurrentlyWidget />
      <ReturnVisitor />
      <PresentationMode />
      <ClickSound />
      <RouterProvider router={router} />
    </>
  );
}
