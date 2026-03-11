export interface OptionDTO {
  id: number;
  text: string;
  value: string; // "SI"/"NO"/etc.
}

export interface QuestionDTO {
  id: number;
  text: string;
  order: number;
  options: OptionDTO[];
}

export interface AnswerDTO {
  questionId: number;
  optionValue: string;
}

export interface DiagnosisRequest {
  domainCode: string;      // "SALUD" | "VEHICULOS" | ...
  answers: AnswerDTO[];
}

export interface TraceItem {
  ruleName: string;
  matched: boolean;
  certaintyContribution?: number | null;
  reason?: string;
}

export interface DiagnosisResponse {
  domainCode: string;
  diagnosis: string;
  ruleMatched: string;
  certainty?: number;          // <- opcional
  trace?: TraceItem[] | null;  // <- opcional
}

