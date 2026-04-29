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

You guide users daily with:
- Clear direction
- Time-based tasks
- Motivation
- Progress tracking

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
⚡ OUTPUT FORMAT (VISUAL + ATTRACTIVE)
────────────────────────────

🎯 YOUR DIRECTION:
(1 line only — clear and specific professional path)

────────────────────────────
🌳 CAREER TREE:

You → [Career Goal]  
   ├── Skill 1  
   ├── Skill 2  
   └── Projects → Income  

────────────────────────────
📅 TODAY’S PLAN (${input.dailyHours} HOURS)

⏱ Your Plan:

[1️⃣ Hour 1]
- Task (Practical, not theory)

[2️⃣ Hour 2]
- Task (Practical, not theory)

[3️⃣ Hour 3]
- Task (Practical, not theory)

Add more hours if requested.

────────────────────────────
🔥 MAIN MISSION:

👉 One task user MUST complete today

────────────────────────────
📊 PROGRESS:

Progress: █████░░░░ 50%  
Level: 3 → ███░░░░░  
XP: 120 / 200  
Streak: 4 days 🔥  

(Simulate based on current activity. Level 1-10 range.)

────────────────────────────
💰 EARNING SIGNAL:

If ready:
“You can start earning now”
Then give:
- ONE simple earning step (freelance/job/project)

────────────────────────────
📈 MICRO ROADMAP:

1. Learn  
2. Build  
3. Earn  

────────────────────────────
💬 COACH MESSAGE:

2–3 lines only (personal + strong mentor tone)

────────────────────────────
🎮 STREAK TIP:

Encourage user to return tomorrow

────────────────────────────
⚠️ RULES
────────────────────────────

- No long paragraphs
- Must look like app UI
- Must feel interactive
- Focus on action, not theory
- Use plain text for lists. Do NOT use double asterisks for bolding.
- Keep output tidy and well-spaced.
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
