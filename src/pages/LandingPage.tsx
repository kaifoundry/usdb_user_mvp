
import React, { useEffect } from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Faq from "../components/faq";
import type { AccordionToggleHandler } from "../types/faq";
import Features from "../components/features";
import Howitworks from "../components/howItWorks";
import ProtocolStats from "../components/protocolStats";
import HeroSection from "../components/heroSection";
import WhitepaperSection from "../components/whitepaperSection";
import BackgroundCanvas from "../components/backgroundCanvas";

const LandingPage: React.FC = () => {
 

 
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


  return (
    <div>
      <BackgroundCanvas/>
      <Header
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
        {/* <AIAssistantSection
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          aiResponse={aiResponse}
          setAiResponse={setAiResponse}
          aiLoading={aiLoading}
          handleAiSubmit={handleAiSubmit}
        /> */}
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
