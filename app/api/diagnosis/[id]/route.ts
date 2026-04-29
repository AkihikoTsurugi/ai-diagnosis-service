import { auth } from "@/auth";
import { connectMongoose } from "@/lib/mongoose";
import { DiagnosisModel, type DiagnosisDocument } from "@/models/Diagnosis";
import type {
  CareerRoadmap,
  DiagnosisDocumentShape,
  DiagnosisResult,
} from "@/types/diagnosis";
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

function isStringArray(input: unknown): input is string[] {
  return (
    Array.isArray(input) &&
    input.every((v) => typeof v === "string" && v.trim().length > 0)
  );
}

function validateUpdateBody(body: unknown) {
  if (typeof body !== "object" || body === null) return null;
  const src = body as Record<string, unknown>;

  const summary = src.result && (src.result as { summary?: unknown }).summary;
  const strengths = src.result && (src.result as { strengths?: unknown }).strengths;
  const recommendedCareers =
    src.result && (src.result as { recommendedCareers?: unknown }).recommendedCareers;
  const cautions = src.result && (src.result as { cautions?: unknown }).cautions;

  const shortTerm =
    src.careerRoadmap && (src.careerRoadmap as { shortTerm?: unknown }).shortTerm;
  const midTerm =
    src.careerRoadmap && (src.careerRoadmap as { midTerm?: unknown }).midTerm;
  const longTerm =
    src.careerRoadmap && (src.careerRoadmap as { longTerm?: unknown }).longTerm;

  if (
    typeof summary !== "string" ||
    !isStringArray(strengths) ||
    !isStringArray(recommendedCareers) ||
    !isStringArray(cautions) ||
    !isStringArray(shortTerm) ||
    !isStringArray(midTerm) ||
    !isStringArray(longTerm)
  ) {
    return null;
  }

  const result: DiagnosisResult = {
    summary: summary.trim(),
    strengths: strengths.map((v) => v.trim()),
    recommendedCareers: recommendedCareers.map((v) => v.trim()),
    cautions: cautions.map((v) => v.trim()),
  };

  const careerRoadmap: CareerRoadmap = {
    shortTerm: shortTerm.map((v) => v.trim()),
    midTerm: midTerm.map((v) => v.trim()),
    longTerm: longTerm.map((v) => v.trim()),
  };

  if (
    result.summary.length === 0 ||
    result.summary.length > 500 ||
    result.strengths.length === 0 ||
    result.recommendedCareers.length === 0 ||
    result.cautions.length === 0 ||
    careerRoadmap.shortTerm.length === 0 ||
    careerRoadmap.midTerm.length === 0 ||
    careerRoadmap.longTerm.length === 0
  ) {
    return null;
  }

  return { result, careerRoadmap };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID が不正です" }, { status: 400 });
  }

  await connectMongoose();
  const doc = await DiagnosisModel.findOne({
    _id: new Types.ObjectId(id),
    userId: new Types.ObjectId(session.user.id),
  }).lean<DiagnosisDocument | null>();

  if (!doc) {
    return NextResponse.json({ error: "診断結果が見つかりません" }, { status: 404 });
  }

  return NextResponse.json(toResponse(doc));
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID が不正です" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON が不正です" }, { status: 400 });
  }

  const payload = validateUpdateBody(body);
  if (!payload) {
    return NextResponse.json({ error: "更新データが不正です" }, { status: 400 });
  }

  await connectMongoose();
  const updated = await DiagnosisModel.findOneAndUpdate(
    {
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(session.user.id),
    },
    {
      $set: {
        result: payload.result,
        careerRoadmap: payload.careerRoadmap,
      },
    },
    { new: true },
  ).lean<DiagnosisDocument | null>();

  if (!updated) {
    return NextResponse.json({ error: "診断結果が見つかりません" }, { status: 404 });
  }

  return NextResponse.json(toResponse(updated));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID が不正です" }, { status: 400 });
  }

  await connectMongoose();
  const deleted = await DiagnosisModel.findOneAndDelete({
    _id: new Types.ObjectId(id),
    userId: new Types.ObjectId(session.user.id),
  });

  if (!deleted) {
    return NextResponse.json({ error: "診断結果が見つかりません" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
