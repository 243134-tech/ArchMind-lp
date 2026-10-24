import { SpaceAnalysis, DesignConcept } from '../types';

export class AiService {
  /**
   * Check if backend AI engine is operational
   */
  async checkHealth(): Promise<{ operational: boolean; hasGeminiKey: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return { operational: false, hasGeminiKey: false };
      const data = await res.json();
      return {
        operational: data.status === 'operational',
        hasGeminiKey: Boolean(data.hasGeminiKey),
      };
    } catch {
      return { operational: false, hasGeminiKey: false };
    }
  }

  /**
   * Run Gemini multimodal visual analysis on uploaded room photo
   */
  async analyzeSpace(
    imageBase64: string,
    roomType: string,
    preferences: string
  ): Promise<{ analysis: SpaceAnalysis; source: 'gemini-live' | 'curated-fallback' }> {
    const res = await fetch('/api/ai/analyze-space', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, roomType, preferences }),
    });

    if (!res.ok) {
      throw new Error(`AI Analysis failed with status ${res.status}`);
    }

    const data = await res.json();
    return {
      analysis: data.analysis,
      source: data.source,
    };
  }

  /**
   * Generate architectural design concepts from user inputs
   */
  async generateDesign(params: {
    imageBase64: string;
    roomType: string;
    style: string;
    colorPreferences: string[];
    budgetMin: number;
    budgetMax: number;
    functionalNeeds: string[];
    itemsToRetain: string[];
    additionalInstructions: string;
    projectId: string;
  }): Promise<{ concept: Partial<DesignConcept>; source: 'gemini-live' | 'curated-high-res' }> {
    const res = await fetch('/api/ai/generate-design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Design Generation failed with status ${res.status}`);
    }

    const data = await res.json();
    return {
      concept: data.concept,
      source: data.source,
    };
  }

  /**
   * Conversational design refinement using natural language modifications
   */
  async refineDesign(params: {
    baseImageUrl: string;
    refinementPrompt: string;
    variationName: string;
    currentVersionNumber: number;
  }): Promise<{
    newImageUrl: string;
    newVersionNumber: number;
    refinedNotes: string;
  }> {
    const res = await fetch('/api/ai/refine-design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Design Refinement failed with status ${res.status}`);
    }

    return await res.json();
  }

  /**
   * Ask ArchMind AI Copilot
   */
  async askCopilot(
    messages: { role: string; content: string }[],
    projectContext?: any
  ): Promise<{ reply: string; actionSuggestion?: any }> {
    const res = await fetch('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, projectContext }),
    });

    if (!res.ok) {
      throw new Error('Copilot inquiry failed');
    }

    return await res.json();
  }
}

export const aiService = new AiService();
