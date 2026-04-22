export type DashboardStat = {
  title: string;
  value: string;
  delta?: string;
};

export type GroqAnalysis = {
  summary: string;
  category_scores: {
    phishing: number;
    propaganda: number;
    extremist_content: number;
    disinformation: number;
    manipulation: number;
  };
  narrative_label: string;
  explanation: string;
  risk_score: number;
  extracted_entities: string[];
};

export type HFClassification = {
  label: string;
  score: number;
};

export type PostListItem = {
  id: string;
  source_platform: string;
  content: string;
  narrative_label: string | null;
  created_at: string;
  accounts: {
    handle: string;
    platform: string;
  } | null;
  analysis_results:
    | {
        final_risk_score: number | null;
      }
    | {
        final_risk_score: number | null;
      }[]
    | null;
};

export type PostDetail = {
  id: string;
  source_platform: string;
  content: string;
  narrative_label: string | null;
  created_at: string;
  accounts: {
    handle: string;
    platform: string;
  } | null;
  analysis_results:
    | {
        groq_summary: string | null;
        groq_risk_score: number | null;
        hf_label: string | null;
        hf_score: number | null;
        coordination_score: number | null;
        final_risk_score: number | null;
        explanation: string | null;
      }
    | null;
};

export type PostHashtagRow = {
  hashtags: {
    tag: string;
  } | null;
};

export type PostUrlRow = {
  urls: {
    url: string;
  } | null;
};
