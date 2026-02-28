import { v } from "convex/values";
import { query, mutation, action, internalQuery, internalMutation, internalAction } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const createChatSession = mutation({
  args: {
    title: v.string(),
    documentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("chatSessions", {
      userId,
      title: args.title,
      documentId: args.documentId,
    });
  },
});

export const getUserChatSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getChatMessages = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found");
    }

    return await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found");
    }

    // Add user message
    await ctx.db.insert("chatMessages", {
      sessionId: args.sessionId,
      role: "user",
      content: args.content,
      timestamp: Date.now(),
    });

    // Schedule AI response
    await ctx.scheduler.runAfter(0, internal.chat.generateAIResponse, {
      sessionId: args.sessionId,
      userMessage: args.content,
    });
  },
});

export const generateAIResponse = internalAction({
  args: {
    sessionId: v.id("chatSessions"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.runQuery(internal.chat.getChatSessionInternal, {
      sessionId: args.sessionId,
    });

    if (!session) return;

    let context = "";
    let category: "business" | "citizen" | "student" | undefined;

    // Get document context if available
    if (session.documentId) {
      const document = await ctx.runQuery(internal.documents.getDocumentInternal, {
        documentId: session.documentId,
      });
      if (document) {
        context = `Document: ${document.title}\nSummary: ${document.summary || "No summary available"}`;
        category = document.category;
      }
    }

    const aiResponse = await ctx.runAction(internal.ai.chatWithAI, {
      message: args.userMessage,
      context,
      category,
    });

    // Add AI response
    await ctx.runMutation(internal.chat.addAIMessage, {
      sessionId: args.sessionId,
      content: aiResponse,
    });
  },
});

export const getChatSessionInternal = internalQuery({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

export const addAIMessage = internalMutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", {
      sessionId: args.sessionId,
      role: "assistant",
      content: args.content,
      timestamp: Date.now(),
    });
  },
});
