import { auth } from "@/auth";
import { generateDiagnosis } from "@/lib/diagnosis-ai";
import { connectMongoose } from "@/lib/mongoose";
import { DiagnosisModel, type DiagnosisDocument } from "@/models/Diagnosis";
import type { DiagnosisAnswers, DiagnosisDocumentShape } from "@/types/diagnosis";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

function toResponse(doc: DiagnosisDocument): DiagnosisDocumentShape {
  return {
    _id: doc._id.toHexString(),
    userId: doc.userId.toHexString(),
    answers: doc.answers,
    result: doc.result,
    careerRoadmap: doc.careerRoadmap,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function validateAnswers(body: unknown): DiagnosisAnswers | null {
  if (typeof body !== "object" || body === null) return null;
  const candidate = body as Record<string, unknown>;
  const keys = ["q1", "q2", "q3", "q4", "q5"] as const;
  const result = {} as DiagnosisAnswers;

  for (const key of keys) {
    const value = candidate[key];
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (trimmed.length === 0 || trimmed.length > 500) return null;
    result[key] = trimmed;
  }
  return result;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON が不正です" }, { status: 400 });
  }

  const answers = validateAnswers(body);
  if (!answers) {
    return NextResponse.json(
      { error: "q1〜q5 の各回答（1〜500文字）が必要です" },
      { status: 400 },
    );
  }

  await connectMongoose();
  const userId = new Types.ObjectId(session.user.id);
  const analysis = await generateDiagnosis(answers);

  const created = await DiagnosisModel.create({
    userId,
    answers,
    result: analysis.result,
    careerRoadmap: analysis.careerRoadmap,
  });

  return NextResponse.json(toResponse(created.toObject() as DiagnosisDocument), {
    status: 201,
  });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  await connectMongoose();
  const userId = new Types.ObjectId(session.user.id);
  const rows = await DiagnosisModel.find({ userId })
    .sort({ createdAt: -1 })
    .lean<DiagnosisDocument[]>();

  return NextResponse.json(rows.map(toResponse));
}
