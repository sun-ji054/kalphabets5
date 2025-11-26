import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NameTranslation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    hangul: {
      type: Type.STRING,
      description: "The name written in Korean Hangul characters.",
    },
    romanization: {
      type: Type.STRING,
      description: "Revised Romanization of the Korean pronunciation.",
    },
    meaning: {
      type: Type.STRING,
      description: "A brief explanation of the name's meaning or a fun fact about the name in a Korean context (written in Korean).",
    },
    origin: {
      type: Type.STRING,
      description: "The likely linguistic origin of the input name (e.g., English, French, Japanese).",
    },
  },
  required: ["hangul", "romanization", "meaning", "origin"],
};

export const translateName = async (name: string): Promise<NameTranslation> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate the foreign name "${name}" into natural Korean (Hangul). 
      If there are multiple ways to write it, choose the most standard or popular transliteration used in Korea.
      Provide the result in JSON format including the Hangul, Romanization, and a brief description/meaning in Korean.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, // Lower temperature for more deterministic/standard spellings
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(text) as NameTranslation;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("이름을 변환하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};
