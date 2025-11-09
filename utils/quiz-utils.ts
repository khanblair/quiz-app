import quizzesData from '@/assets/data/quizzes.json';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  questions: Question[];
}

export function getAllQuizzes(): Quiz[] {
  return quizzesData as Quiz[];
}

export function getQuizById(id: string): Quiz | undefined {
  return getAllQuizzes().find((quiz) => quiz.id === id);
}

export function getQuizzesByCategory(category: string): Quiz[] {
  return getAllQuizzes().filter((quiz) => quiz.category === category);
}

export function getCategories(): string[] {
  const categories = new Set(getAllQuizzes().map((quiz) => quiz.category));
  return Array.from(categories);
}

export function calculateScore(
  quiz: Quiz,
  answers: Record<string, number>
): { score: number; percentage: number } {
  let correct = 0;
  quiz.questions.forEach((question) => {
    if (answers[question.id] === question.correctAnswer) {
      correct += 1;
    }
  });
  return {
    score: correct,
    percentage: Math.round((correct / quiz.questions.length) * 100),
  };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    Beginner: '#10B981',
    Intermediate: '#F59E0B',
    Advanced: '#EF4444',
  };
  return colors[difficulty] || '#6B7280';
}
