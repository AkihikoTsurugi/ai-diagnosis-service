import Anthropic from "@anthropic-ai/sdk";
import type {
  CareerRoadmap,
  DiagnosisAnswers,
  DiagnosisResult,
} from "@/types/diagnosis";

type AiDiagnosisPayload = {
  result: DiagnosisResult;
  careerRoadmap: CareerRoadmap;
};

const fallbackAnalysis: AiDiagnosisPayload = {
  result: {
    summary: "あなたの回答から、対話力と継続学習力を活かせるキャリアが適しています。",
    strengths: ["コミュニケーション力", "課題発見力", "学習継続力"],
    recommendedCareers: ["プロダクトマネージャー", "カスタマーサクセス", "ITコンサルタント"],
    cautions: ["短期で成果を求めすぎない", "得意領域を言語化して発信する"],
  },
  careerRoadmap: {
    shortTerm: ["1日30分の学習習慣を固定する", "週1回の振り返りを行う"],
    midTerm: ["3か月でポートフォリオを1件完成させる", "業界イベントに月1回参加する"],
    longTerm: ["1年以内に希望職種へ応募する", "専門性を軸にキャリア戦略を再設計する"],
  },
};

function buildPrompt(answers: DiagnosisAnswers) {
  return `
あなたは優秀なキャリアアドバイザーです。次の5つの回答を分析し、JSONのみを返してください。

回答:
1. ${answers.q1}
2. ${answers.q2}
3. ${answers.q3}
4. ${answers.q4}
5. ${answers.q5}

JSONスキーマ:
{
  "result": {
    "summary": "120文字以内の総評",
    "strengths": ["強み1", "強み2", "強み3"],
    "recommendedCareers": ["職種1", "職種2", "職種3"],
    "cautions": ["注意点1", "注意点2"]
  },
  "careerRoadmap": {
    "shortTerm": ["短期施策1", "短期施策2"],
    "midTerm": ["中期施策1", "中期施策2"],
    "longTerm": ["長期施策1", "長期施策2"]
  }
}
`.trim();
}

function normalizeArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const cleaned = value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
  return cleaned.length > 0 ? cleaned : fallback;
}

function parseAiResponse(rawText: string): AiDiagnosisPayload {
  const jsonStart = rawText.indexOf("{");
  const jsonEnd = rawText.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd < 0 || jsonEnd <= jsonStart) {
    return fallbackAnalysis;
  }

  try {
    const parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1)) as {
      result?: Partial<DiagnosisResult>;
      careerRoadmap?: Partial<CareerRoadmap>;
    };

    return {
      result: {
        summary:
          typeof parsed.result?.summary === "string" &&
          parsed.result.summary.trim().length > 0
            ? parsed.result.summary.trim()
            : fallbackAnalysis.result.summary,
        strengths: normalizeArray(
          parsed.result?.strengths,
          fallbackAnalysis.result.strengths,
        ),
        recommendedCareers: normalizeArray(
          parsed.result?.recommendedCareers,
          fallbackAnalysis.result.recommendedCareers,
        ),
        cautions: normalizeArray(
          parsed.result?.cautions,
          fallbackAnalysis.result.cautions,
        ),
      },
      careerRoadmap: {
        shortTerm: normalizeArray(
          parsed.careerRoadmap?.shortTerm,
          fallbackAnalysis.careerRoadmap.shortTerm,
        ),
        midTerm: normalizeArray(
          parsed.careerRoadmap?.midTerm,
          fallbackAnalysis.careerRoadmap.midTerm,
        ),
        longTerm: normalizeArray(
          parsed.careerRoadmap?.longTerm,
          fallbackAnalysis.careerRoadmap.longTerm,
        ),
      },
    };
  } catch {
    return fallbackAnalysis;
  }
}

export async function generateDiagnosis(answers: DiagnosisAnswers) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return fallbackAnalysis;
  }

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-latest";
  const response = await client.messages.create({
    model,
    max_tokens: 1200,
    temperature: 0.3,
    messages: [{ role: "user", content: buildPrompt(answers) }],
  });

  const text = response.content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n");
  return parseAiResponse(text);
}
