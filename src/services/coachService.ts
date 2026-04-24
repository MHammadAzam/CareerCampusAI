import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CoachInput {
  careerInterest: string;
  skillLevel: 'beginner' | 'intermediate';
  dailyHours: number;
}

export async function generateDailyCoachPlan(input: CoachInput) {
  const intensity = input.dailyHours <= 2 ? "light daily tasks" : 
                    input.dailyHours <= 4 ? "balanced learning + practice" : 
                    "deep work + project building";

  const prompt = `
You are “CareerCompass AI Coach”, a smart daily career guide inside a SaaS app.
Your goal is NOT to give long roadmaps.
Your goal is to guide the user DAILY based on their available time.

USER INPUT:
- Career Interest: ${input.careerInterest}
- Skill Level: ${input.skillLevel}
- Available Hours: ${input.dailyHours} (${intensity})

⚡ OUTPUT FORMAT (STRICT):

# 🎯 Your Career Direction
(1–2 lines max)

# 📅 Today’s Plan (Based on ${input.dailyHours} hours)
Break time into blocks:
⏱ Hour 1:
- [specific task]
${input.dailyHours > 1 ? `⏱ Hour 2:\n- [specific task]` : ''}
${input.dailyHours > 2 ? `⏱ Hour 3:\n- [specific task]` : ''}
${input.dailyHours > 3 ? `⏱ Hour 4:\n- [specific task]` : ''}
${input.dailyHours > 4 ? `⏱ Hour 5+:\n- [specific task]` : ''}

🔥 MICRO ROADMAP (SHORT ONLY)
1. Learn basics
2. Build small projects
3. Start earning
(Strictly NO explanations)

🎯 TODAY’S FOCUS TASK
👉 “[Give ONE powerful task user must complete today at any cost]”

🌟 MOTIVATION (SHORT & ATTRACTIVE)
- 2–3 lines only
- Personal, mentor-like tone

🎮 ENGAGEMENT ELEMENT
👉 “Streak Tip”
Example: “Come back tomorrow and I’ll upgrade your plan.”

RULES:
- Keep everything short and structured
- No long paragraphs
- No boring explanations
- Make it feel like a productivity app
- Focus on ACTION, not theory
- Do NOT use markdown bolding (double asterisks **).
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Focus on the next step. Consistency is the architect of mastery.";
  } catch (error) {
    console.error("Coach Service Error:", error);
    return "Error generating plan. Please try again.";
  }
}
