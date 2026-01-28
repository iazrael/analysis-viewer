export interface WrongQuestion {
  image_index: number;
  coordinates: number[];
  problem_types: string[];
  problem_title: string;
  problem_text: string;
  student_answer: string;
  error_tags: string[];
  error_reason: string;
  standard_answer: string;
}

export interface Analysis {
  homework_title: string;
  wrong_questions: WrongQuestion[];
}

export interface AnalysisRoot {
  analysis: Analysis;
}
