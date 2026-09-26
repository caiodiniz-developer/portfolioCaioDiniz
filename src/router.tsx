import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import PageTransition from "@/components/animations/PageTransition";
import Terminal from "@/components/animations/Terminal";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

/* Home is the landing page, so it ships in the entry chunk. Every other route
   is split off: Three.js and the 3D model only exist on /about, and nobody
   landing on / should pay for them. */
const AboutPage     = lazy(() => import("@/pages/AboutPage"));
const ProjectsPage  = lazy(() => import("@/pages/ProjectsPage"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const ServicesPage  = lazy(() => import("@/pages/ServicesPage"));
const ContactPage   = lazy(() => import("@/pages/ContactPage"));
const GuestbookPage = lazy(() => import("@/pages/GuestbookPage"));
const CVPage        = lazy(() => import("@/pages/CVPage"));
import { getLenis } from "@/hooks/useLenis";
import { initAnalytics, pageview } from "@/lib/analytics";
import { isMorphing } from "@/lib/morph";

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname]);
  return null;
}

/** Client-side routing means the browser never re-requests a document, so the
 *  tracker only ever sees the landing page unless we report navigation itself. */
function AnalyticsTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    initAnalytics();
  }, []);
  useEffect(() => {
    pageview(pathname);
  }, [pathname]);
  return null;
}

function RootLayout() {
  const location = useLocation();

  /* A card morph (src/lib/morph.ts) keeps the transition key unchanged, so the
     new route renders in place instead of waiting for AnimatePresence to play
     the old page out — the browser pauses animation frames while a View
     Transition captures the new state, and that exit would never finish. The
     key only follows the pathname when the pathname actually changes. */
  const lastPath = useRef(location.pathname);
  const pageKey  = useRef(location.pathname);
  if (location.pathname !== lastPath.current) {
    lastPath.current = location.pathname;
    if (!isMorphing()) pageKey.current = location.pathname;
  }
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <ScrollReset />
      <AnalyticsTracker />
      <Header />
      {/* Wrapper adds bottom padding on mobile to clear the bottom nav bar */}
      <div style={{ paddingBottom: isMobile ? 68 : 0 }}>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={pageKey.current}>
            {/* Inside the transition, so the page-out animation still plays
                while the next route's chunk downloads. */}
            <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
              <Outlet />
            </Suspense>
          </PageTransition>
        </AnimatePresence>
        <Footer />
      </div>
      {/* Global overlays that need router context */}
      <Terminal />
      <MobileNav />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <AboutPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "projects/:slug", element: <ProjectDetail /> },
      { path: "services", element: <ServicesPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "guestbook",  element: <GuestbookPage /> },
      { path: "cv",         element: <CVPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
