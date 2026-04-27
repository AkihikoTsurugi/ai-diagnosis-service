import { auth } from "@/auth";
import { serializeUser } from "@/lib/userProfileSerialize";
import { getUsersCollection } from "@/lib/usersCollection";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  let oid: ObjectId;
  try {
    oid = new ObjectId(session.user.id);
  } catch {
    return NextResponse.json({ error: "無効なユーザー ID です" }, { status: 400 });
  }

  const users = await getUsersCollection();
  const doc = await users.findOne({ _id: oid });
  if (!doc) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  const now = new Date();
  const patch: Record<string, Date> = {};
  if (!doc.createdAt) patch.createdAt = now;
  if (!doc.updatedAt) patch.updatedAt = now;
  if (Object.keys(patch).length > 0) {
    await users.updateOne({ _id: oid }, { $set: patch });
    Object.assign(doc, patch);
  }

  return NextResponse.json(serializeUser(doc as Record<string, unknown>));
}

export async function PUT(req: Request) {
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

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as { name?: unknown }).name !== "string"
  ) {
    return NextResponse.json(
      { error: "name（文字列）が必要です" },
      { status: 400 },
    );
  }

  const name = (body as { name: string }).name.trim();
  if (name.length === 0 || name.length > 80) {
    return NextResponse.json(
      { error: "表示名は 1〜80 文字で入力してください" },
      { status: 400 },
    );
  }

  let oid: ObjectId;
  try {
    oid = new ObjectId(session.user.id);
  } catch {
    return NextResponse.json({ error: "無効なユーザー ID です" }, { status: 400 });
  }

  const users = await getUsersCollection();
  const now = new Date();
  const patch: Record<string, unknown> = { name, updatedAt: now };
  const existing = await users.findOne({ _id: oid });
  if (!existing) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }
  if (!existing.createdAt) {
    patch.createdAt = now;
  }

  await users.updateOne({ _id: oid }, { $set: patch });
  const updated = await users.findOne({ _id: oid });
  if (!updated) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  return NextResponse.json(serializeUser(updated as Record<string, unknown>));
}
