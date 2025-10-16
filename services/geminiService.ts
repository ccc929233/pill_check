import { GoogleGenAI } from "@google/genai";
import type { MedicationInfo, GroundingSource } from '../types';

// Access the API key from the `window` object, where it's set by `.env.js`.
// The `global.d.ts` file prevents TypeScript errors for this line.
if (!window.process?.env?.API_KEY) {
  const errorMsg = "API key is not configured. Please create a .env.js file with your API key.";
  alert(errorMsg);
  throw new Error(errorMsg);
}
const ai = new GoogleGenAI({ apiKey: window.process.env.API_KEY });


const SYSTEM_INSTRUCTION = `你是一位专业的药剂师助理，旨在帮助老年用户。根据提供的图片，识别药品。然后，使用你的搜索工具查找关于该药品的经过验证的信息。
仅以一个JSON对象字符串的形式回应。该JSON对象必须包含以下确切的键：'name' (string), 'dosage' (string), 和 'contraindications' (string)。
对于'dosage'（用量）和'contraindications'（禁忌），请使用极其简单、清晰、简洁的语言，适合非医疗专业人士。
在JSON对象字符串之前或之后不要添加任何文本。

例如: {"name": "阿司匹林 81mg", "dosage": "每天口服一片。", "contraindications": "如果你有出血性疾病或对阿司匹林过敏，请勿服用。"}`;

const PROMPT = "请识别图片中的药品。";

export async function identifyMedication(
    base64Image: string,
    mimeType: string
): Promise<{ medicationInfo: MedicationInfo; sources: GroundingSource[] }> {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: PROMPT,
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;

    // Clean the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData: MedicationInfo = JSON.parse(cleanedText);

    if (!parsedData.name || !parsedData.dosage || !parsedData.contraindications) {
        throw new Error("API返回的格式不正确。");
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
        .map(chunk => chunk.web)
        .filter((web): web is { uri: string, title: string } => !!web && !!web.uri && !!web.title);


    return { medicationInfo: parsedData, sources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
        throw new Error("无法解析从API返回的数据。请再试一次。");
    }
    throw new Error("调用药品识别服务时出错。");
  }
}