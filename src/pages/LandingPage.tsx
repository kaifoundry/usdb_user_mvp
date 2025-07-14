
import React, { useEffect, useState } from "react";
import logo from "../assets/btclogo.svg";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Faq from "../components/faq";
import type { AccordionToggleHandler } from "../types/faq";
import Features from "../components/features";
import Howitworks from "../components/how-it-works";
import ProtocolStats from "../components/protocolStats";
import HeroSection from "../components/heroSection";
import WhitepaperSection from "../components/whitepaperSection";
import BackgroundCanvas from "../components/backgroundCanvas";
import AIAssistantSection from "../components/aiAssistantSection";
import { useAIAssistant } from "../Hooks/useAIAssistant";
const MOCK_WALLET = {
  address: "bc1q...xyuv",
  btcBalance: 2.5,
  usdbBalance: 10000,
};
const LandingPage: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "light" ||
      localStorage.getItem("theme") === "dark"
      ? (localStorage.getItem("theme") as "light" | "dark")
      : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark"
  );

  // Theme handling
  useEffect(() => {
    document.body.classList.toggle("light-mode", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

 
  // Scroll animation for elements
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-animate");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // FAQ accordion
  const handleAccordionToggle: AccordionToggleHandler = (e) => {
    const details = document.querySelectorAll("details");
    const currentDetail = e.currentTarget;

    details.forEach((detail) => {
      if (detail !== currentDetail) {
        detail.open = false;
      }
    });
  };

  // AI Assistant
  const {
  aiPrompt,
  setAiPrompt,
  aiResponse,
  setAiResponse,
  aiLoading,
  handleAiSubmit,
} = useAIAssistant();

  return (
    <div>
      <BackgroundCanvas theme={theme} />
      {/* Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        MOCK_WALLET={MOCK_WALLET}
        logo={logo}
        toggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <main className="pt-24 relative z-10">
        {/* hero section  */}
        <HeroSection />
        {/* Protocol Stats Section */}
        <ProtocolStats />
        {/* How It Works Section */}
        <Howitworks />
        {/* Features Section */}
        <Features />
        {/* AI Assistant Section */}
        <AIAssistantSection
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          aiResponse={aiResponse}
          setAiResponse={setAiResponse}
          aiLoading={aiLoading}
          handleAiSubmit={handleAiSubmit}
        />
        {/* FAQ Section */}
        <Faq handleAccordionToggle={handleAccordionToggle} />
        {/* Call to Action Section */}
        <WhitepaperSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default LandingPage;
