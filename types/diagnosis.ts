export type DiagnosisAnswers = {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
};

export type DiagnosisResult = {
  summary: string;
  strengths: string[];
  recommendedCareers: string[];
  cautions: string[];
};

export type CareerRoadmap = {
  shortTerm: string[];
  midTerm: string[];
  longTerm: string[];
};

export type DiagnosisDocumentShape = {
  _id: string;
  userId: string;
  answers: DiagnosisAnswers;
  result: DiagnosisResult;
  careerRoadmap: CareerRoadmap;
  createdAt: string;
  updatedAt: string;
};
