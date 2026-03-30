import { createAgent, gemini } from "@inngest/agent-kit";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

const analyzerAgent = createAgent({
  name: "AI Question Analyzer",
  description:
    "For analyzing the question tickets and adding the skills needed to solve the question and moderate it for a platform that is for students.",
  model: gemini({
    model: "gemini-3-flash-preview",
    apiKey: process.env.GEMINI_API_KEY,
  }),
  system: `You are an expert ai assistant that processes question tickets. Only return a strict JSON object with no extra text, headers or markdowns.
    Your job is to:
    1.provide helpful concise notes for human moderators on how to properly answer the query
    2.list relavant technical skills required to answer the query in the ticket
    3.check if the content doesn't meet the platform requirements, i.e. it's not related to study, or something completely irrelevant/vulgar/spam/etc.

    IMPORTANT:
    -Respond with *only* valid raw JSON data
    -do not include any comments, markdown, code fences, or any extra formatting
    -the format must be a raw json object

    Repeat: do not wrap your output in markdown or code fences or with any extra formatting

    Analyze the support ticket and provide a JSON object with:
    -supportNotes: A helpful, concise yet detailed enough explaination of 3-4 points that a moderator can use on how to properly approach and answer the question step by step, covering core topics and ensuring clean and well structured answers.
    -requiredSkills: An array of skills needed to solve the issue, (e.g. ["React", "MongoDB", "NodeJs", "Python"])
    -moderationStatus: Any value out of ONLY these three values: ["clean", "flagged", "blocked"], 

    Your response structure should look something like this e.g.:

    {
    "supportNotes": "Approach this question with first explaining the concept..",
    "requiredSkills": ["React", "NodeJs"],
    "moderationStatus": "clean"
    }
    `,
});

export const analyzeQuestion = async (question) => {
  try {
    const response = await analyzerAgent.run(`
        Question Ticket information:
       -Title: ${question.title}
       -Body: ${question.body}
       `);

    const raw = response.output[0].content;
    // const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    // const jsonString = match ? match[1] : raw.trim();
    return JSON.parse(raw.trim());
  } catch (error) {
    console.error("failed to generate proper response,", error);
    return null;
  }
};
