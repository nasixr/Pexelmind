import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult } from '../types';

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    // Return mock data if no API key is present (for development safety/demo)
    console.warn("No API Key found, returning mock data.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: "الهيكل العام للتصميم جيد، ولكن تم اكتشاف بعض التداخلات في العناصر العلوية وضعف في تباين النصوص الثانوية.",
          saudiSummary: "هلا بك، شوف طال عمرك التصميم بشكل عام ممتاز، بس عندك زر 'تسجيل الدخول' مرة لاصق فوق، والخط الرمادي تحت باهت شوي ما ينشاف زين. يبي له تظبيط.",
          spatialIssues: [
            "تحذير: الزر 'تسجيل الدخول' قريب جداً من الحافة العلوية (أقل من 10 بكسل).",
            "تنبيه: صورة الشعار تتداخل قليلاً مع عنوان الصفحة الرئيسي عند العرض على شاشات صغيرة."
          ],
          contrastIssues: [
            "خطأ: النص الرمادي الفاتح في التذييل لا يحقق نسبة التباين 4.5:1 (النسبة الحالية 2.8:1).",
            "تنبيه: لون أيقونات القائمة الجانبية باهت جداً مقارنة بالخلفية."
          ],
          suggestions: [
            "قم بزيادة الهامش العلوي (Margin-top) للزر الرئيسي.",
            "استخدم درجة رمادي أغمق (#374151) للنصوص الفرعية لتحسين القراءة."
          ]
        });
      }, 2000);
    });
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    أنت خبير في إمكانية الوصول (Accessibility) وتصميم واجهات المستخدم.
    قم بتحليل صورة واجهة المستخدم هذه لمطور مكفوف.
    
    قم بإنتاج تقرير بصيغة JSON يحتوي على الحقول التالية:
    - summary: ملخص عام عن الواجهة باللغة العربية الفصحى.
    - saudiSummary: ملخص باللهجة السعودية العامية، يكون ودوداً ومباشراً، ويشرح أهم المشاكل الموجودة في الواجهة وكأنك تتحدث مع صديق.
    - spatialIssues: قائمة بمشاكل المسافات والتداخل والمحاذاة (بالعربية).
    - contrastIssues: قائمة بمشاكل الألوان والتباين (WCAG) (بالعربية).
    - suggestions: قائمة باقتراحات سريعة للتحسين (بالعربية).

    كن دقيقاً وصريحاً ومحترماً. استخدم لغة مهنية في الحقول الفصحى، ولغة محكية طبيعية في الحقل السعودي.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            saudiSummary: { type: Type.STRING },
            spatialIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            contrastIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("لم يتم استلام رد صحيح من الخادم");
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.");
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API Key found for TTS.");
    return "";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("No audio data received");
    return audioData;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};