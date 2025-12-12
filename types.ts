
export type TemplateId = 
  | 'modern' | 'minimalist' | 'corporate' 
  | 'berlin' | 'tokyo' | 'nyc' | 'london' | 'paris'
  | 'dubai' | 'sydney' | 'sf' | 'stockholm' | 'oslo'
  | 'madrid' | 'rome' | 'amsterdam';

export type Language = 'fr' | 'en' | 'ar' | 'nl' | 'es' | 'pt' | 'ru';

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface LanguageSkill {
  id: string;
  name: string;
  level: string; // "Native", "Fluent", "A1", etc.
}

export interface ResumeData {
  id: string;
  title: string;
  language: Language;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    summary: string;
    jobTitle: string;
    photoUrl?: string;
    photoConfig?: {
      zoom: number;
      x: number;
      y: number;
    };
  };
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: LanguageSkill[];
  hobbies: string[];
  theme: {
    primaryColor: string;
    fontFamily: string;
    template: TemplateId;
  };
}

export const INITIAL_RESUME: ResumeData = {
  id: 'new',
  title: 'Nouveau CV',
  language: 'fr',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: '',
    jobTitle: '',
    summary: '',
    photoUrl: '',
    photoConfig: { zoom: 1, x: 0, y: 0 }
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  hobbies: [],
  theme: {
    primaryColor: '#2563eb',
    fontFamily: 'Inter, sans-serif',
    template: 'berlin'
  }
};
