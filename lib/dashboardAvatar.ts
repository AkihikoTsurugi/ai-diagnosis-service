import { ObjectId } from "mongodb";

import { getUsersCollection } from "@/lib/usersCollection";

/** ダッシュボード SSR 用。JWT の OAuth 画像より DB の avatarUrl を優先する */
export async function getDashboardDisplayImage(
  userId: string,
): Promise<string | null | undefined> {
  let oid: ObjectId;
  try {
    oid = new ObjectId(userId);
  } catch {
    return undefined;
  }

  const users = await getUsersCollection();
  const doc = await users.findOne(
    { _id: oid },
    { projection: { image: 1, avatarUrl: 1 } },
  );
  if (!doc) return undefined;

  const avatarUrl = doc.avatarUrl as string | null | undefined;
  const oauth = doc.image as string | null | undefined;
  return (avatarUrl && avatarUrl.length > 0 ? avatarUrl : null) ?? oauth ?? null;
}
