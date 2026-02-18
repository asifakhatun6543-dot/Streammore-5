
import { GoogleGenAI, Type } from "@google/genai";
import { Content } from "../types";

// Initialized using the required named parameter and environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getCache = (): Record<string, string[]> => {
  try {
    const saved = localStorage.getItem('streammore_ai_cache');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const setCache = (id: string, ids: string[]) => {
  try {
    const cache = getCache();
    cache[id] = ids;
    localStorage.setItem('streammore_ai_cache', JSON.stringify(cache));
  } catch (e) {
    console.warn("Failed to update AI cache");
  }
};

let isFetchingRecommendations = false;

const fetchWithRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 3000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error?.message?.toLowerCase() || "";
    const isRateLimit = error?.status === 429 || errorMsg.includes('limit') || errorMsg.includes('quota');
                       
    if (retries > 0 && isRateLimit) {
      const totalDelay = delay + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, totalDelay));
      return fetchWithRetry(fn, retries - 1, delay * 2); 
    }
    throw error;
  }
};

export const getAIRecommendations = async (currentContent: Content, allContent: Content[]): Promise<Content[]> => {
  const cache = getCache();
  if (cache[currentContent.id]) {
    const cachedIds = cache[currentContent.id];
    const filtered = allContent.filter(c => cachedIds.includes(c.id));
    if (filtered.length > 0) return filtered;
  }

  if (isFetchingRecommendations) {
    return allContent.filter(c => c.id !== currentContent.id).slice(0, 3);
  }

  try {
    isFetchingRecommendations = true;
    const librarySummary = allContent
      .filter(c => c.id !== currentContent.id)
      .map(c => ({ i: c.id, t: c.title, g: c.category }));

    const prompt = `Based on "${currentContent.title}" (${currentContent.category}), pick 3 similar from this library: ${JSON.stringify(librarySummary)}. Return only a JSON array of the "i" values (IDs).`;

    const responseIds = await fetchWithRetry(async () => {
      // Using gemini-3-flash-preview for basic text processing tasks.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      // response.text is a getter property.
      return JSON.parse(response.text || '[]');
    });

    if (Array.isArray(responseIds) && responseIds.length > 0) {
      setCache(currentContent.id, responseIds);
    }
    
    isFetchingRecommendations = false;
    return allContent.filter(c => responseIds.includes(c.id) && c.id !== currentContent.id);
  } catch (error) {
    isFetchingRecommendations = false;
    return allContent.filter(c => c.id !== currentContent.id).slice(0, 3);
  }
};

export const chatWithAssistant = async (message: string, allContent: Content[]): Promise<string> => {
  try {
    const context = allContent.map(c => `- ${c.title} (${c.category})`).join('\n');
    const prompt = `You are "StreamBuddy", an AI assistant. Library:\n${context}\nUser: "${message}"\nRecommend titles from library. Friendly and concise.`;
    const response = await fetchWithRetry(async () => {
      // Standard generateContent call using gemini-3-flash-preview.
      return await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: prompt 
      });
    });
    // response.text property directly returns the extracted string.
    return response.text || "Check out our trending section!";
  } catch (error) {
    return "I'm having a little trouble connecting right now.";
  }
};
