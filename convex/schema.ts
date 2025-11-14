import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quizzes: defineTable({
    id: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    difficulty: v.string(),
    duration: v.number(),
    questions: v.array(
      v.object({
        id: v.string(),
        question: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.number(),
        explanation: v.string(),
      })
    ),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_quiz_id", ["id"])
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"]),
});
