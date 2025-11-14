import { mutation } from "./_generated/server";
import quizzesData from "../assets/data/quizzes.json";

export const seedQuizzes = mutation({
  handler: async (ctx) => {
    // Check if quizzes already exist
    const existingQuizzes = await ctx.db.query("quizzes").collect();
    
    if (existingQuizzes.length > 0) {
      return { 
        success: false, 
        message: "Database already has quizzes. Clear the database first if you want to reseed.",
        existingCount: existingQuizzes.length 
      };
    }

    const now = Date.now();
    const results = [];

    for (const quiz of quizzesData) {
      const _id = await ctx.db.insert("quizzes", {
        ...quiz,
        createdAt: now,
        updatedAt: now,
      });
      results.push(_id);
    }

    return { 
      success: true, 
      message: `Successfully seeded ${results.length} quizzes`,
      count: results.length 
    };
  },
});

export const clearAllQuizzes = mutation({
  handler: async (ctx) => {
    const allQuizzes = await ctx.db.query("quizzes").collect();
    
    for (const quiz of allQuizzes) {
      await ctx.db.delete(quiz._id);
    }

    return { 
      success: true, 
      message: `Deleted ${allQuizzes.length} quizzes`,
      count: allQuizzes.length 
    };
  },
});
