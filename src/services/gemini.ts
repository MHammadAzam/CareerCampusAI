import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface UserInput {
  interests: string;
  skills: string;
  education: string;
  goals: string;
  timeAvailability: string;
  country?: string;
}

export type ChatRole = 'strategist' | 'analyst' | 'researcher' | 'coach';

const SYSTEM_INSTRUCTIONS: Record<ChatRole, string> = {
  strategist: "You are a Career Strategist. Focus on long-term growth, pivot strategies, and executive-level planning.",
  analyst: "You are a Skill Analyst. Focus on granular breakdown of technical and soft skills needed for specific roles.",
  researcher: "You are a Market Researcher. Provide insights into market trends, salary data, and emerging job opportunities.",
  coach: "You are a Productivity Coach. Focus on daily habits, time management, and maintaining high motivation."
};

export async function generateCareerRoadmap(input: UserInput) {
  // ... existing implementation ...
  const prompt = `
You are “CareerCompass AI”, an advanced AI-powered career intelligence system.
You are NOT a chatbot. You behave like a:
- Career strategist
- Skill analyst
- Market researcher
- Income planner
- Productivity coach

CRITICAL: Do NOT use markdown bolding (double asterisks **). Use plain text for headings and lists. The UI will handle the styling.
Do NOT generate any CSS, UI code, or advanced styling. Output must be clean, structured, and text-only.

USER PROFILE:
- Interests: ${input.interests}
- Skills: ${input.skills}
- Education Level: ${input.education}
- Goals: ${input.goals}
- Time Availability: ${input.timeAvailability}
- Country: ${input.country || "Not specified"}

OUTPUT STRUCTURE:

# Career Identity
- 3-line summary of who the user is professionally based on their input.

# Career Growth Tree
ROOT: User profile summary
TRUNK: Main career path
BRANCHES: 4–6 core skills (Beginner / Intermediate / Advanced)
LEAVES: 3–5 strategic projects
FRUITS: Income outcomes and job roles

# Multi-Path Simulation
Generate 2–3 alternative paths with:
- Difficulty: [Low/Medium/High]
- Time to Income: [Months]
- Risk Level: [Low/Medium/High]
- Best suited personality: [Description]
- Best Path Recommendation: [Detailed reasoning]

# Skill Gap Analysis
- Current Assets: [List what user already has]
- Missing Critical Skills: [List what is missing]
- High Impact Skills: [Skills that unlock income fastest]

# Gamification Status
- XP Points: [Estimate points]
- Current Level: [1–10]
- Next Level Requirements: [Tasks/Milestones]
- Suggested Badges: Skill Starter, Project Builder, Income Beginner, Job Ready

# Market Demand Insights
- Demand Level: [High/Medium/Low]
- Opportunities: [Global vs Local]
- Engagement: [Freelance vs Full-time]
- Future Trend: [Next 3–5 years insight]

# Income Roadmap
Step 1: Learn [X]
Step 2: Build [Y]
Step 3: Offer [Z] service
- First $10 Strategy: [Actionable step]
- First $100 Strategy: [Actionable step]
- First $1000 Strategy: [Actionable step]

# AI Daily Mentor
Today's Action Plan:
- 3 specific tasks user should do today
Weekly Focus:
- 1 main goal for this week

# 90-Day Transformation Plan
Month 1 Learning: [Clear tasks & outcomes]
Month 2 Building: [Clear tasks & outcomes]
Month 3 Earning: [Clear tasks & outcomes]

# Project Generator
Beginner (3): [Name, Desc, Tools, Impact]
Intermediate (2): [Name, Desc, Tools, Impact]
Standout Portfolio (1): [Name, Desc, Tools, Impact]

# Progress Tracking
- Tree Status: [Seed / Growing / Advanced]
- Weekly Checkpoints: [List]
- Skill Milestones: [List]
- Project Completion Goals: [List]

# Reality Check
- Difficulty Level: [Honest assessment]
- Common Mistakes: [What to avoid]
- Reality Warning: [Honest warning if path is hard]

# Personalized Motivation
Message: [Mentor-style, realistic message]
Closing Statement: “If you stay consistent for 90 days, your direction can completely change.”

# Differentiation
Briefstate why this structured plan is superior to generic AI responses.
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
