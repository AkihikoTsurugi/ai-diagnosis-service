import { auth } from "@/auth";
import { getClientPromise, getDbName, isMongoConfigured } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

async function getUsersCollection() {
  const client = await getClientPromise();
  const dbName = getDbName();
  return client.db(dbName).collection("users");
}

function serializeUser(doc: Record<string, unknown>) {
  return {
    id: (doc._id as ObjectId).toHexString(),
    name: doc.name as string | null,
    email: doc.email as string | null,
    image: doc.image as string | null,
    emailVerified: doc.emailVerified
      ? new Date(doc.emailVerified as Date).toISOString()
      : null,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt as Date).toISOString()
      : null,
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt as Date).toISOString()
      : null,
  };
}

function fallbackProfile(session: {
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null };
}) {
  return {
    id: session.user.id ?? "unknown",
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    emailVerified: null,
    createdAt: null,
    updatedAt: new Date().toISOString(),
    warning: "MongoDB未接続のため、セッション情報を表示しています。",
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(fallbackProfile(session));
  }

  let oid: ObjectId;
  try {
    oid = new ObjectId(session.user.id);
  } catch {
    return NextResponse.json(fallbackProfile(session));
  }

  try {
    const users = await getUsersCollection();
    const doc = await users.findOne({ _id: oid });
    if (!doc) {
      return NextResponse.json(fallbackProfile(session));
    }

    const now = new Date();
    const patch: Record<string, Date> = {};
    if (!doc.createdAt) patch.createdAt = now;
    if (!doc.updatedAt) patch.updatedAt = now;
    if (Object.keys(patch).length > 0) {
      await users.updateOne({ _id: oid }, { $set: patch });
      Object.assign(doc, patch);
    }

    return NextResponse.json(serializeUser(doc));
  } catch {
    return NextResponse.json(fallbackProfile(session));
  }
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
    return NextResponse.json({
      ...fallbackProfile(session),
      name,
      warning: "MongoDB未接続のため、変更は一時反映です。",
    });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({
      ...fallbackProfile(session),
      name,
      warning: "MongoDB未接続のため、変更は一時反映です。",
    });
  }

  try {
    const users = await getUsersCollection();
    const now = new Date();
    const patch: Record<string, unknown> = { name, updatedAt: now };
    const existing = await users.findOne({ _id: oid });
    if (!existing) {
      return NextResponse.json({
        ...fallbackProfile(session),
        name,
        warning: "MongoDB未接続のため、変更は一時反映です。",
      });
    }
    if (!existing.createdAt) {
      patch.createdAt = now;
    }

    await users.updateOne({ _id: oid }, { $set: patch });
    const updated = await users.findOne({ _id: oid });
    if (!updated) {
      return NextResponse.json({
        ...fallbackProfile(session),
        name,
        warning: "MongoDB未接続のため、変更は一時反映です。",
      });
    }

    return NextResponse.json(serializeUser(updated as Record<string, unknown>));
  } catch {
    return NextResponse.json({
      ...fallbackProfile(session),
      name,
      warning: "MongoDB未接続のため、変更は一時反映です。",
    });
  }
}
