import { v } from "convex/values";
import { query, mutation, action, internalQuery, internalMutation, internalAction } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

export const uploadDocument = mutation({
  args: {
    title: v.string(),
    category: v.union(v.literal("business"), v.literal("citizen"), v.literal("student")),
    fileId: v.id("_storage"),
    originalText: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const documentId = await ctx.db.insert("documents", {
      userId,
      title: args.title,
      category: args.category,
      fileId: args.fileId,
      originalText: args.originalText,
      status: "uploaded",
    });

    // Schedule AI processing
    await ctx.scheduler.runAfter(0, internal.documents.processDocument, {
      documentId,
    });

    return documentId;
  },
});

export const getUserDocuments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return Promise.all(
      documents.map(async (doc) => ({
        ...doc,
        fileUrl: await ctx.storage.getUrl(doc.fileId),
      }))
    );
  },
});

export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }

    return {
      ...document,
      fileUrl: await ctx.storage.getUrl(document.fileId),
    };
  },
});

export const updateDocumentNotes = mutation({
  args: {
    documentId: v.id("documents"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(args.documentId, {
      notes: args.notes,
    });
  },
});

export const processDocument = internalAction({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.runQuery(internal.documents.getDocumentInternal, {
      documentId: args.documentId,
    });

    if (!document) return;

    // Update status to processing
    await ctx.runMutation(internal.documents.updateDocumentStatus, {
      documentId: args.documentId,
      status: "processing",
    });

    try {
      // AI Analysis using built-in OpenAI
      const analysis = await ctx.runAction(internal.ai.analyzeDocument, {
        text: document.originalText,
        category: document.category,
      });

      // Update document with analysis results
      await ctx.runMutation(internal.documents.updateDocumentAnalysis, {
        documentId: args.documentId,
        summary: analysis.summary,
        keyPoints: analysis.keyPoints,
        riskLevel: analysis.riskLevel,
        glossaryTerms: analysis.glossaryTerms,
        status: "completed",
      });
    } catch (error) {
      console.error("Document processing failed:", error);
      await ctx.runMutation(internal.documents.updateDocumentStatus, {
        documentId: args.documentId,
        status: "uploaded",
      });
    }
  },
});

export const getDocumentInternal = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

export const updateDocumentStatus = internalMutation({
  args: {
    documentId: v.id("documents"),
    status: v.union(v.literal("uploaded"), v.literal("processing"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      status: args.status,
    });
  },
});

export const updateDocumentAnalysis = internalMutation({
  args: {
    documentId: v.id("documents"),
    summary: v.string(),
    keyPoints: v.array(v.string()),
    riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    glossaryTerms: v.array(v.object({
      term: v.string(),
      definition: v.string()
    })),
    status: v.union(v.literal("uploaded"), v.literal("processing"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      summary: args.summary,
      keyPoints: args.keyPoints,
      riskLevel: args.riskLevel,
      glossaryTerms: args.glossaryTerms,
      status: args.status,
    });
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.storage.generateUploadUrl();
  },
});
