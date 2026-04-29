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

function pickKeywords(answers: DiagnosisAnswers) {
  const all = Object.values(answers)
    .join(" ")
    .replace(/[。、,\.\n]/g, " ")
    .split(/\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length >= 2);
  const uniq = Array.from(new Set(all));
  return uniq.slice(0, 6);
}

function buildFallbackAnalysis(answers: DiagnosisAnswers): AiDiagnosisPayload {
  const keywords = pickKeywords(answers);
  const k1 = keywords[0] ?? "現在の経験";
  const k2 = keywords[1] ?? "挑戦したい領域";
  const k3 = keywords[2] ?? "将来目標";
  return {
    result: {
      summary: `${k1}と${k2}を軸に、${k3}へ近づく実践型キャリア戦略が有効です。`,
      strengths: [
        `${k1}に関する継続力`,
        `${k2}に対する学習意欲`,
        "自己分析を言語化できる力",
      ],
      recommendedCareers: [
        `${k2}を活かせる実務職`,
        "プロジェクト推進に関わる職種",
        "顧客価値を設計する職種",
      ],
      cautions: [
        "短期で完璧を目指しすぎない",
        "目標を週次タスクへ分解して継続する",
      ],
    },
    careerRoadmap: {
      shortTerm: [
        `${k2}の基礎学習を2週間で整理する`,
        `${k1}の実績をポートフォリオ化する`,
      ],
      midTerm: [
        "2〜3か月で成果物を1件公開する",
        "メンターやコミュニティから月1回フィードバックを得る",
      ],
      longTerm: [
        `${k3}に直結する職務へ応募・異動する`,
        "実務経験を積みつつ専門領域を明確化する",
      ],
    },
  };
}

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

function parseAiResponse(
  rawText: string,
  fallbackAnalysis: AiDiagnosisPayload,
): AiDiagnosisPayload {
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
  const fallbackAnalysis = buildFallbackAnalysis(answers);
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return fallbackAnalysis;
  }

  const client = new Anthropic({ apiKey });
  const envModel = process.env.ANTHROPIC_MODEL?.trim();
  const deprecatedModels = new Set([
    "claude-3-5-haiku-latest",
    "claude-3-5-haiku-20241022",
    "claude-3-haiku-20240307",
  ]);
  const modelCandidates = [
    "claude-4-5-haiku-latest",
    ...(envModel && !deprecatedModels.has(envModel) ? [envModel] : []),
  ];

  for (const model of modelCandidates) {
    try {
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
      return parseAiResponse(text, fallbackAnalysis);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (
        msg.includes("not_found_error") ||
        msg.includes("model:") ||
        msg.includes("404")
      ) {
        continue;
      }
      return fallbackAnalysis;
    }
  }

  return fallbackAnalysis;
}
