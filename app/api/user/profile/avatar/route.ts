import { auth } from "@/auth";
import { serializeUser } from "@/lib/userProfileSerialize";
import { getUsersCollection } from "@/lib/usersCollection";
import { mkdir, unlink, writeFile } from "fs/promises";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { basename, join } from "path";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

const MAX_BYTES = 300 * 1024;

const MIME_TO_EXT = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

async function removePriorUpload(publicRelativeUrl: string | null | undefined) {
  if (
    !publicRelativeUrl ||
    typeof publicRelativeUrl !== "string" ||
    !publicRelativeUrl.startsWith("/uploads/avatars/")
  ) {
    return;
  }
  const safeName = basename(publicRelativeUrl);
  if (!safeName || safeName.includes("..")) return;
  const abs = join(process.cwd(), "public", "uploads", "avatars", safeName);
  await unlink(abs).catch(() => undefined);
}

export async function POST(req: Request) {
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

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "フォームデータが不正です" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file が必要です" }, { status: 400 });
  }

  const mime = file.type?.toLowerCase() ?? "";
  const ext = MIME_TO_EXT.get(mime);
  if (!ext) {
    return NextResponse.json(
      { error: "JPEG / PNG / WebP / GIF のみ対応しています" },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.byteLength === 0) {
    return NextResponse.json({ error: "画像が空です" }, { status: 400 });
  }
  if (buf.byteLength > MAX_BYTES) {
    return NextResponse.json(
      { error: "ファイルサイズは 300KB 以下にしてください" },
      { status: 400 },
    );
  }

  const users = await getUsersCollection();
  const existing = await users.findOne({ _id: oid });
  if (!existing) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  await removePriorUpload(existing.avatarUrl as string | null | undefined);

  const dir = join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(dir, { recursive: true });

  const filename = `${oid.toHexString()}.${ext}`;
  const absPath = join(dir, filename);
  await writeFile(absPath, buf);

  const publicUrl = `/uploads/avatars/${filename}`;
  const now = new Date();
  const patch: Record<string, unknown> = {
    avatarUrl: publicUrl,
    updatedAt: now,
  };
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
