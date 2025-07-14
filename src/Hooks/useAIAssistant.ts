import { useState } from "react";

export const useAIAssistant = () => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("Your answer will appear here...");
  const [aiLoading, setAiLoading] = useState(false);

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
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setAiResponse(text);
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

  return {
    aiPrompt,
    setAiPrompt,
    aiResponse,
    setAiResponse,
    aiLoading,
    handleAiSubmit,
  };
};
