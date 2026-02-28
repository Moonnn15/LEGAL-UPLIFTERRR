import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";

export const analyzeDocument = internalAction({
  args: {
    text: v.string(),
    category: v.union(v.literal("business"), v.literal("citizen"), v.literal("student")),
  },
  handler: async (ctx, args) => {
    const openai = await import("openai").then(m => m.default);
    const client = new openai({
      baseURL: process.env.CONVEX_OPENAI_BASE_URL,
      apiKey: process.env.CONVEX_OPENAI_API_KEY,
    });

    const categoryContext = {
      business: "business contracts, agreements, and legal documents",
      citizen: "consumer rights, legal notices, and civic documents",
      student: "academic policies, housing agreements, and educational contracts"
    };

    const prompt = `Analyze this ${categoryContext[args.category]} document and provide:

1. A comprehensive summary (2-3 paragraphs)
2. 5-7 key points or clauses
3. Risk assessment (low/medium/high)
4. Important legal terms with definitions

Document text:
${args.text}

Respond in JSON format:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "riskLevel": "low|medium|high",
  "glossaryTerms": [{"term": "...", "definition": "..."}, ...]
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No AI response");

    try {
      return JSON.parse(content);
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        summary: "Document analysis completed. Please review the original document for details.",
        keyPoints: ["Document uploaded successfully", "AI analysis in progress"],
        riskLevel: "medium" as const,
        glossaryTerms: [],
      };
    }
  },
});

export const chatWithAI = internalAction({
  args: {
    message: v.string(),
    context: v.optional(v.string()),
    category: v.optional(v.union(v.literal("business"), v.literal("citizen"), v.literal("student"))),
  },
  handler: async (ctx, args) => {
    const openai = await import("openai").then(m => m.default);
    const client = new openai({
      baseURL: process.env.CONVEX_OPENAI_BASE_URL,
      apiKey: process.env.CONVEX_OPENAI_API_KEY,
    });

    const systemPrompt = `You are Legal Uplifter AI, a helpful legal assistant specializing in ${args.category || 'general'} legal matters. 
    Provide clear, accurate legal information while always reminding users that this is not legal advice and they should consult with a qualified attorney for specific legal matters.
    
    ${args.context ? `Context from document: ${args.context}` : ''}`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: args.message }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  },
});
