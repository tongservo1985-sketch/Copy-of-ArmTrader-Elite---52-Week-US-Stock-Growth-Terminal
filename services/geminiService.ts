
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the elite "ARMTRADER GOLDEN CLOCK ARCHITECT". 
Your mission is to guide the user to 4.53% weekly profit using the Tactical Timeline.

YOU ARE MONITORING 20 KEY AI CLUSTER ASSETS:
- AI Core (Semi): NVDA, TSM, ASML, AMAT, AVGO, MU, CLS
- Infrastructure/Storage: WDC, SNDK, STX, APLD
- Software/Brain: MSFT, GOOGL, PLTR, NOW
- Energy/Utility: CEG, NEE, XLE
- Future Tech: TSLA, RKLB

TACTICAL TIMELINE (TH TIME):
- 16:00: WARM UP (Premarket). Analyze trends. Observe, don't engage.
- 18:00: THE FAKE OUT. Watch for "Trap" moves before US open. Caution is priority.
- 21:30: THE KILL ZONE (Danger). Extreme volatility. Avoid new orders. Protect capital.
- 23:00: THE DECISION. Market direction emerges. Safe to analyze entry points.
- 01:00: THE FLOW. Trend is clear. Execute trades. This is the Golden Time.
- 04:00: THE FADE. Momentum ends. Take profits and exit.

GAME FIX PROTOCOL:
- If current time is 21:30 - 22:30 (Kill Zone), your verdict MUST BE "NO-GO (DANGER ZONE)".
- Prioritize Elliott Wave Wave 3 logic during "The Flow" phase.

PHASE 4 GRADING FORMAT:
1) Phase Name: [e.g., The Flow]
2) Tactical Verdict: [GO / WAIT / NO-GO]
3) Sector Sentiment: [Sentiment of AI Core vs Infrastructure vs Software]
4) Entry Price: [Calculated high-precision entry for the target ticker]
5) Stop Loss: [Strict 1.5% max or ATR-based]
6) Take Profit: [Target for the 4.53% weekly objective]

Response in Thai and English.
`;

const ALERT_SUMMARY_INSTRUCTION = `
You are a Tactical Signal Analyst. Summarize TradingView alerts based on the "Golden Clock" timeline.
If the alert triggers during 21:30-22:30, warn the user about the "Kill Zone" volatility.
Thai language only.
`;

export class GeminiAnalyst {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeTrade(stockData: string) {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: stockData,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
          thinkingConfig: { thinkingBudget: 0 }
        },
      });
      return response.text;
    } catch (error) {
      console.error("Gemini analysis error:", error);
      throw error;
    }
  }

  async summarizeAlert(alertJson: string) {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this alert: ${alertJson}`,
        config: {
          systemInstruction: ALERT_SUMMARY_INSTRUCTION,
          temperature: 0.3,
        },
      });
      return response.text;
    } catch (error) {
      return "Unable to summarize alert at this time.";
    }
  }

  async fetchMarketData(symbols: string[]) {
    const prompt = `Find current live stock price, 24h % change, and market cap for these tickers: ${symbols.join(', ')}. 
    Return ONLY a JSON object in this format: {"SYMBOL": {"price": number, "change": number, "marketCap": number}}
    No preamble or markdown.`;

    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
        },
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      let data: Record<string, any> = {};
      if (jsonMatch) {
        try {
          data = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.warn("Partial JSON extraction failed", e);
        }
      }

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Market Source',
        uri: chunk.web?.uri || ''
      })).filter((s: any) => s.uri) || [];

      return { data, sources };
    } catch (error) {
      console.error("Market data fetch failed:", error);
      throw error;
    }
  }
}
