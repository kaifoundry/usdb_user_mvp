import { Loader2 } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import logo from "../assets/btclogo.svg";
import Header from "../Layout/HeaderMain";
import Footer from "../Layout/Footer";
import Faq from "../components/faq";
import type { AccordionToggleHandler } from "../types/faq";
import Features from "../components/features";
import Howitworks from "../components/how-it-works";
import ProtocolStats from "../components/protocolStats";
import HeroSection from "../components/heroSection";
import WhitepaperSection from "../components/whitepaperSection";
const MOCK_WALLET = {
  address: "bc1q...xyuv",
  btcBalance: 2.5,
  usdbBalance: 10000,
};
const LandingPage: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem("theme") === "light" || localStorage.getItem("theme") === "dark")
      ? (localStorage.getItem("theme") as 'light' | 'dark')
      : (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark")
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState(
    "Your answer will appear here..."
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const targetScrollYRef = useRef(0);
  const currentScrollYRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

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

  // Particle animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    class Particle {
      x: number;
      y: number;
      sz: number;
      sx: number;
      sy: number;
      color: string;

      constructor(c: HTMLCanvasElement, color: string) {
        this.x = Math.random() * c.width;
        this.y = Math.random() * c.height;
        this.sz = Math.random() * 1.5 + 0.5;
        this.sx = Math.random() * 0.5 - 0.25;
        this.sy = Math.random() * 0.5 - 0.25;
        this.color = color;
      }

      update() {
        this.x += this.sx;
        this.y += this.sy;
        if (this.x < 0 || this.x > canvas.width) this.sx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.sy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const particleColor =
        theme === "light" ? "rgba(55, 65, 81, 0.3)" : "rgba(251, 191, 36, 0.3)";
      particlesRef.current = [];
      const num = (canvas.height * canvas.width) / 9000;
      for (let i = 0; i < num; i++) {
        particlesRef.current.push(new Particle(canvas, particleColor));
      }
    };

    const animate = () => {
      // Smooth scroll (lerp)
      currentScrollYRef.current +=
        (targetScrollYRef.current - currentScrollYRef.current) * 0.08;
      // Apply the smoothed, negative transform for parallax effect
      canvas.style.transform = `translateY(-${
        currentScrollYRef.current * 0.3
      }px)`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      targetScrollYRef.current = window.scrollY;
    };

    // Initial setup
    resizeCanvas();
    animate();

    // Event listeners
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

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
  const handleAiSubmit = async () => {
    const userPrompt = aiPrompt.trim();
    if (!userPrompt) {
      setAiResponse("Please enter a question.");
      return;
    }

    setAiLoading(true);
    setAiResponse("Thinking...");

    const context = `You are an expert AI assistant for USDB, a natively BTC-backed stablecoin. Based on the following information, answer the user's question. Keep the answer concise, clear, and easy to understand. Project Information: - Project Name: USDB - Type: Natively BTC-backed stablecoin. - Mechanism: Users deposit Bitcoin (BTC) into a secure, overcollateralized smart contract (a Collateralized Debt Position or CDP). They can then mint USDB Runes against this collateral. - Technology: Utilizes the Bitcoin Runes protocol for issuing the stablecoin directly on the Bitcoin network. - Key Features: Natively on Bitcoin, overcollateralized for stability, fully decentralized, capital-efficient (unlocks liquidity of BTC without selling), censorship-resistant, and designed for the DeFi ecosystem. - Stability Peg: The 1:1 peg to the US dollar is maintained through overcollateralization and market arbitrage opportunities.`;
    const fullPrompt = `${context}\n\nUser's Question: "${userPrompt}"`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    };
     const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const result = await response.json();

      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        setAiResponse(result.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Invalid API response structure.");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setAiResponse("Sorry, an error occurred. Please try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="particle-canvas"
        className="fixed top-0 left-0 w-full h-screen z-[-1]"
      ></canvas>

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
      <HeroSection/>
        {/* Protocol Stats Section */}
        <ProtocolStats/>

        {/* How It Works Section */}
        <Howitworks/>

        {/* Features Section */}
        <Features/>

        {/* AI Assistant Section */}
        <section id="ai-assistant" className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate">
                Ask the USDB AI
              </h3>
              <p
                className="text-muted max-w-2xl mx-auto scroll-animate"
                style={{ transitionDelay: "150ms" }}
              >
                Have a question about USDB? Our AI assistant can help. Ask
                anything about how it works, its security, or its place in the
                ecosystem.
              </p>
            </div>
            <div
              className="themed-card p-8 rounded-2xl scroll-animate"
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  id="ai-prompt-input"
                  placeholder="e.g., How is USDB different from other stablecoins?"
                  className="ai-input w-full p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiSubmit()}
                />
                <button
                  id="ai-submit-btn"
                  onClick={handleAiSubmit}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-8 rounded-lg transition-colors whitespace-nowrap flex items-center justify-center"
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Ask AI</span>
                  )}
                </button>
              </div>
              <div
                id="ai-response-area"
                className="text-muted mt-6 p-6 rounded-lg min-h-[50px]"
              >
                {aiResponse}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
       <Faq handleAccordionToggle={handleAccordionToggle} />

        {/* Call to Action Section */}
        <WhitepaperSection/>
      </main>

      {/* Footer */}
       <Footer />
    </div>
  );
};
export default LandingPage;
