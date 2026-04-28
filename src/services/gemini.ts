import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface UserInput {
  interests: string;
  skillLevel: 'Beginner' | 'Intermediate';
  dailyHours: string;
  yesterdayProgress: 'Done' | 'Not Done';
  mood?: string;
}

export type ChatRole = 'strategist' | 'analyst' | 'researcher' | 'coach';

const SYSTEM_INSTRUCTIONS: Record<ChatRole, string> = {
  strategist: "You are a Career Strategist. Focus on long-term growth, pivot strategies, and executive-level planning.",
  analyst: "You are a Skill Analyst. Focus on granular breakdown of technical and soft skills needed for specific roles.",
  researcher: "You are a Market Researcher. Provide insights into market trends, salary data, and emerging job opportunities.",
  coach: "You are a Productivity Coach. Focus on daily habits, time management, and maintaining high motivation."
};

export interface ResumeAnalysis {
  rating: number;
  suggestions: string[];
  strengths: string[];
  summary: string;
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  const prompt = `
You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Analyze the following resume text and provide a detailed analysis in JSON format.

RESUME TEXT:
${resumeText}

JSON STRUCTURE:
{
  "rating": (number between 0 and 100),
  "suggestions": (array of specific points to improve, empty if perfect),
  "strengths": (array of callouts for what is done well),
  "summary": (2-3 sentence overview of the resume quality)
}

CRITICAL: Return ONLY the JSON object. No other text.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text || "{}";
    console.log("Raw Gemini Response:", text);
    // Remove markdown code blocks if present
    const jsonStr = text.replace(/```json\s*|```\s*/g, "").trim();
    
    try {
      const parsed = JSON.parse(jsonStr);
      // Ensure it has the required fields
      return {
        rating: typeof parsed.rating === 'number' ? parsed.rating : 75,
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        summary: typeof parsed.summary === 'string' ? parsed.summary : "Analysis completed."
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output:", parseError);
      throw new Error("The AI failed to format the analysis correctly. Please try again.");
    }
  } catch (error) {
    console.error("Gemini Resume Analysis Error:", error);
    throw new Error("Failed to analyze resume.");
  }
}

export interface InterviewMessage {
  role: 'interviewer' | 'candidate';
  content: string;
}

export async function conductInterview(messages: InterviewMessage[], context: string): Promise<string> {
  const conversation = messages.map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n');
  
  const prompt = `
You are a Senior Technical Recruiter at a top-tier tech company.
Context: ${context}

Current Conversation:
${conversation}

Your task is to continue the interview. 
- Ask one deep, probing technical or behavioral question.
- Keep the tone professional but demanding.
- If it's the first message, start the interview.
- If the conversation has gone for 5-6 rounds, conclude the interview and signal it by saying "This concludes our session."

Response:`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "I apologize, I lost the connection. Could you repeat that?";
  } catch (error) {
    console.error("Gemini Interview Error:", error);
    throw new Error("Failed to continue interview simulation.");
  }
}

export async function analyzeInterview(messages: InterviewMessage[]): Promise<{ score: number; feedback: string }> {
  const conversation = messages.map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n');
  
  const prompt = `
Analyze the following mock interview transcript and provide a score (0-100) and actionable feedback.

TRANSCRIPT:
${conversation}

JSON STRUCTURE:
{
  "score": (number),
  "feedback": (string with 3-4 bullet points)
}

CRITICAL: Return ONLY the JSON object.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text || "{}";
    const jsonStr = text.replace(/```json\s*|```\s*/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Interview Analysis Error:", error);
    return { score: 50, feedback: "Analysis engine failed. However, keep practicing on clarity and structure." };
  }
}

export async function generateCareerRoadmap(input: UserInput) {
  const prompt = `
────────────────────────────
🧠 SYSTEM ROLE
────────────────────────────

You are “CareerCompass AI”, an advanced AI Career Growth Coach.

You are NOT a basic career advisor.

You are a system that:
- Guides users daily
- Tracks their growth
- Pushes them toward real skills and income

Your goal is:
👉 Help user go from confusion → clarity → consistency → earning

────────────────────────────
🎯 USER INPUT
────────────────────────────

User provides:
- Career interest: ${input.interests}
- Skill level: ${input.skillLevel}
- Daily available hours: ${input.dailyHours}
- Yesterday progress: ${input.yesterdayProgress}
- Mood: ${input.mood || "Internal calibration stable"}

────────────────────────────
⚡ CORE OUTPUT STRUCTURE
────────────────────────────

# 🎯 Your Direction
(1 line only — clear and specific)

────────────────────────────
# 📅 Today’s Plan (Based on ${input.dailyHours} hours)

Break into time blocks:

⏱ Hour 1:
- Task

⏱ Hour 2:
- Task

⏱ Hour 3:
- Task

Rules:
- Tasks must be practical (NOT theory)
- Tasks must match user level
- Tasks must feel achievable

────────────────────────────
🧠 ADAPTIVE LOGIC
────────────────────────────

If yesterday tasks:
- Completed → increase difficulty slightly
- Not completed → simplify tasks

────────────────────────────
🔥 TODAY’S MAIN MISSION

👉 One task the user MUST complete today

────────────────────────────
📊 PROGRESS SYSTEM

- XP Earned Today: (simulate based on plan difficulty)
- Current Level: (1–10)
- Streak Count: (simulate count based on progress)

────────────────────────────
💰 EARNING SIGNAL

If user is ready:

👉 Show:
“You are ready to start earning”

Then give:
- ONE simple earning step (freelance/job/project)

────────────────────────────
📈 MICRO ROADMAP (SHORT)

Only 3 steps:

1. Learn basics  
2. Build projects  
3. Start earning  

(No long explanations)

────────────────────────────
🌟 DAILY MOTIVATION

- 2–3 lines only
- Personal and realistic
- Mentor tone (not generic quotes)

────────────────────────────
🎮 STREAK TIP

Encourage user to return tomorrow

Example:
“Come back tomorrow — I’ll upgrade your plan based on your progress.”

────────────────────────────
⚠️ RULES
────────────────────────────

- No long paragraphs
- No boring explanations
- Focus on ACTION
- Make it feel like a productivity app
- Keep user engaged
- Use plain text for lists. Do NOT use double asterisks for bolding.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate roadmap. Please check your API key and try again.");
  }
}

export type ModelSpeed = 'fast' | 'general' | 'complex';

const MODEL_MAP: Record<ModelSpeed, string> = {
  fast: 'gemini-3.1-flash-lite-preview',
  general: 'gemini-3-flash-preview',
  complex: 'gemini-3.1-pro-preview'
};

export function createCareerChat(role: ChatRole = 'strategist', speed: ModelSpeed = 'general') {
  const model = MODEL_MAP[speed];
  const systemInstruction = `
${SYSTEM_INSTRUCTIONS[role]}
You are part of the “CareerCompass AI” system. Your goal is to provide specific, actionable career intelligence.
Maintain a professional, strategic, and mentor-like tone.
NEVER use double asterisks for bolding. Use plain text and structured lists.
Stay in character based on your assigned role.
`;

  return ai.chats.create({
    model: model,
    config: {
      systemInstruction,
    }
  });
}
