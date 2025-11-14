import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Quiz } from "@/utils/quiz-utils-convex";

export function useAllQuizzes() {
  const quizzes = useQuery(api.mobile.quizzes.getAllQuizzes);
  return quizzes as Quiz[] | undefined;
}

export function useQuizById(id: string | undefined) {
  const quiz = useQuery(
    api.mobile.quizzes.getQuizById,
    id ? { id } : "skip"
  );
  return quiz as Quiz | undefined | null;
}

export function useQuizzesByCategory(category: string | undefined) {
  const quizzes = useQuery(
    api.mobile.quizzes.getQuizzesByCategory,
    category ? { category } : "skip"
  );
  return quizzes as Quiz[] | undefined;
}

export function useAllCategories() {
  const categories = useQuery(api.mobile.quizzes.getAllCategories);
  return categories as string[] | undefined;
}

export function useSearchQuizzes(searchTerm: string) {
  const quizzes = useQuery(
    api.mobile.quizzes.searchQuizzes,
    searchTerm ? { searchTerm } : "skip"
  );
  return quizzes as Quiz[] | undefined;
}
