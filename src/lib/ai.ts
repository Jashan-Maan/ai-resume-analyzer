import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Resume Analysis — Gemini 2.5 Flash (fast)
export async function analyzeResume(
  resumeText: string,
  jobDescription?: string,
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an expert ATS (Applicant Tracking System) and resume reviewer 
with 10+ years of experience in technical recruiting.

Analyze the following resume against the job description provided.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription || "No job description provided. Do a general analysis."}

Return ONLY a valid JSON object with this exact structure, no extra text:
{
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "suggestions": [
    {
      "priority": "high",
      "suggestion": "<specific actionable improvement>"
    }
  ],
  "sectionsFound": {
    "experience": <boolean>,
    "education": <boolean>,
    "skills": <boolean>,
    "projects": <boolean>,
    "summary": <boolean>
  }
}

Scoring criteria:
- 80-100: Excellent match
- 60-79: Good match, minor improvements needed
- 40-59: Average match, significant improvements needed
- 0-39: Poor match, major revision required

Be specific and actionable. Return ONLY the JSON, no markdown, no backticks.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) {
    throw new Error("AI returned invalid response. Please try again.");
  }

  // Clean response — remove markdown if Gemini adds it
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse Gemini response:", cleaned);
    throw new Error("AI returned invalid response. Please try again.");
  }
}

// Mock Interview Questions — Gemini 2.5 Pro (better reasoning)
export async function generateInterviewQuestions(
  resumeText: string,
  jobDescription?: string,
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
  });

  const prompt = `
You are an expert technical interviewer with 10+ years of experience.

Based on the resume and job description below, generate realistic interview questions.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription || "Generate general technical interview questions based on the resume."}

Return ONLY a valid JSON object, no extra text:
{
  "technical": [
    {
      "question": "<technical question>",
      "difficulty": "easy|medium|hard",
      "topic": "<topic area>"
    }
  ],
  "behavioral": [
    {
      "question": "<behavioral question>",
      "tip": "<what interviewer is looking for>"
    }
  ],
  "projectBased": [
    {
      "question": "<question about their specific projects>",
      "project": "<which project this relates to>"
    }
  ]
}

Generate 5 technical, 3 behavioral, and 3 project-based questions.
Return ONLY the JSON, no markdown, no backticks.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) {
    throw new Error("AI returned invalid response. Please try again.");
  }

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse Gemini response:", cleaned);
    throw new Error("AI returned invalid response. Please try again.");
  }
}
