import { Loader2 } from "lucide-react";
import type { AIAssistantSectionProps } from "../types/aiAssistant";



const AIAssistantSection: React.FC<AIAssistantSectionProps> = ({
  aiPrompt,
  setAiPrompt,
  aiResponse,
  aiLoading,
  handleAiSubmit,
}) => {
  return (
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
            Have a question about USDB? Our AI assistant can help. Ask anything about how it works, its security, or its place in the ecosystem.
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
  );
};

export default AIAssistantSection;
