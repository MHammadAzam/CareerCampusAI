import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MentorContext {
  goals: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  struggles?: string;
  stage: string;
  displayName: string;
}

export async function generateDailyMotivation(context: MentorContext) {
  const personalizationFocus = {
    beginner: "focus on starting and consistency",
    intermediate: "focus on discipline and building projects",
    advanced: "focus on execution and earning/income"
  }[context.skillLevel];

  const systemPrompt = `
You are “CareerCompass AI Mentor”, a highly intelligent motivational career coach.
Your job is to generate a DAILY personalized motivational message for the user.

USER CONTEXT:
- Name: ${context.displayName}
- Goals: ${context.goals}
- Skill Level: ${context.skillLevel} (${personalizationFocus})
- Struggles: ${context.struggles || "None specified"}
- Stage: ${context.stage}

RULES:
- Must feel PERSONAL (not generic quotes)
- Must feel like a REAL mentor speaking
- Must be SHORT (4–8 lines max)
- Must include emotional + practical motivation
- Avoid cliché quotes like “believe in yourself”
- TONE: Calm but powerful, Mentor-like, Realistic, Slightly emotional but not dramatic.

STRUCTURE:
# 🌟 Daily Motivation
- 1 strong opening line (impactful)
- 2–3 lines of guidance
- 1 actionable task for today (labeled as 👉 “Today’s Focus Task:”)
- 1 closing powerful line

Return ONLY the motivational message.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: systemPrompt,
    });
    return response.text || "Keep moving forward, your path is being mapped.";
  } catch (error) {
    console.error("Mentor Service Error:", error);
    return "Focus on the next step. Consistency is the architect of mastery.";
  }
}
