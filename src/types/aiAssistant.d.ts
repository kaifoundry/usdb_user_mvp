
export type AIAssistantSectionProps = {
  aiPrompt: string;
  setAiPrompt: React.Dispatch<React.SetStateAction<string>>;
  aiResponse: string;
  setAiResponse: React.Dispatch<React.SetStateAction<string>>;
  aiLoading: boolean;
  handleAiSubmit: () => void;
};