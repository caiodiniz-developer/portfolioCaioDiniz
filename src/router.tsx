import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import PageTransition from "@/components/animations/PageTransition";
import Terminal from "@/components/animations/Terminal";
import Home from "@/pages/Home";
import AboutPage from "@/pages/AboutPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetail from "@/pages/ProjectDetail";
import ServicesPage from "@/pages/ServicesPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/NotFound";
import GuestbookPage from "@/pages/GuestbookPage";
import CVPage from "@/pages/CVPage";
import UsesPage from "@/pages/UsesPage";
import { getLenis } from "@/hooks/useLenis";
import { initAnalytics, pageview } from "@/lib/analytics";

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
          <PageTransition key={location.pathname}>
            <Outlet />
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
      { path: "uses",       element: <UsesPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
