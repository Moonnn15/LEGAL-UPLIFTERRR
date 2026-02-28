import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    category: v.union(v.literal("business"), v.literal("citizen"), v.literal("student")),
    fileId: v.id("_storage"),
    originalText: v.string(),
    summary: v.optional(v.string()),
    keyPoints: v.optional(v.array(v.string())),
    riskLevel: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    glossaryTerms: v.optional(v.array(v.object({
      term: v.string(),
      definition: v.string()
    }))),
    notes: v.optional(v.string()),
    status: v.union(v.literal("uploaded"), v.literal("processing"), v.literal("completed")),
  }).index("by_user", ["userId"]),

  chatSessions: defineTable({
    userId: v.id("users"),
    documentId: v.optional(v.id("documents")),
    title: v.string(),
  }).index("by_user", ["userId"]),

  chatMessages: defineTable({
    sessionId: v.id("chatSessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.number(),
  }).index("by_session", ["sessionId"]),

  userProfiles: defineTable({
    userId: v.id("users"),
    category: v.union(v.literal("business"), v.literal("citizen"), v.literal("student")),
    preferences: v.object({
      theme: v.union(v.literal("light"), v.literal("dark")),
      notifications: v.boolean(),
    }),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
