import type { ObjectId } from "mongodb";

/** アップロード画像 URL があれば OAuth の画像より優先して返す（API・SSR で共通利用） */
export function serializeUser(doc: Record<string, unknown>) {
  const oauthImage = doc.image as string | null | undefined;
  const avatarUrl = doc.avatarUrl as string | null | undefined;
  const displayImage =
    (avatarUrl && avatarUrl.length > 0 ? avatarUrl : null) ??
    oauthImage ??
    null;

  return {
    id: (doc._id as ObjectId).toHexString(),
    name: doc.name as string | null,
    email: doc.email as string | null,
    image: displayImage,
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
