export type TopicClusterId =
  | 'foundations'
  | 'relational'
  | 'sql'
  | 'storage'
  | 'transactions'
  | 'modern'
  | 'revision';

export interface TopicCluster {
  id: TopicClusterId;
  name: string;
  color: string;
  hex: string;
  weeks: number[];
}

export interface SlideDeck {
  id: string;
  title: string;
  pdf: string;
  pptx: string;
  thumb: string;
  /** Base path of the exported per-slide PNG images, e.g. /slides/images/Week_1_Introduction_to_DBMS */
  images?: string;
  slides: number;
  size: string;
  sections: string[];
}

export interface QuizQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number; // 0-indexed
  explain: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic?: string;
}

export interface Week {
  id: number;
  slug: string;
  label: string;
  title: string;
  co: ('CO1' | 'CO2' | 'CO3' | 'CO4')[];
  cluster: TopicClusterId;
  color: string;
  summary: string;
  topics: string[];
  decks: SlideDeck[];
  notes: string[]; // Note IDs
  labs: string[]; // Lab IDs
  keyTakeaways: string[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
}

export interface CourseNote {
  id: string;
  title: string;
  fileName: string;
  file: string;
  pages: number;
  size: string;
  weeks: number[];
  tags: string[];
  description: string;
  isScanned?: boolean;
}

export interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  weekId: number;
  formula?: string;
}

export interface ExamQuestionMapping {
  id: string;
  year: string;
  exam: string;
  questionNo: string;
  topic: string;
  weekId: number;
  co: string;
  marks?: number;
}

export interface CourseData {
  code: string;
  title: string;
  credit: string;
  levelTerm: string;
  semester: string;
  department: string;
  university: string;
  instructor: {
    name: string;
    designation: string;
    department: string;
    email: string;
    room: string;
    hours: string[];
  };
  textbooks: {
    title: string;
    authors: string;
    edition: string;
    publisher: string;
    isPrimary?: boolean;
    url?: string;
  }[];
  assessment: {
    component: string;
    weight: number;
    description: string;
  }[];
  outcomes: {
    co: 'CO1' | 'CO2' | 'CO3' | 'CO4';
    statement: string;
    po: string;
    bloom: string;
  }[];
  clusters: Record<TopicClusterId, TopicCluster>;
  weeks: Week[];
  notes: CourseNote[];
  glossary: GlossaryTerm[];
  examQuestions: ExamQuestionMapping[];
}

export interface LabDefinition {
  id: string;
  title: string;
  week: number;
  weekLabel: string;
  category: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}
