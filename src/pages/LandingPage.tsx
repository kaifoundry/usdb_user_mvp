
import React, { useEffect } from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Faq from "../components/faq";
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

  


  return (
    <div>
      <BackgroundCanvas/>
      <Header/>
      <main className="pt-24 relative z-10">
        <HeroSection />
        <ProtocolStats />
        <Howitworks />
        <Features />
        <Faq/>
        <WhitepaperSection />
      </main>
      <Footer />
    </div>
  );
};
export default LandingPage;
