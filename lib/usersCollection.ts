import clientPromise, { getDbName } from "@/lib/mongodb";
import type { Collection } from "mongodb";

export async function getUsersCollection(): Promise<
  Collection<Record<string, unknown>>
> {
  const client = await clientPromise;
  const dbName = getDbName();
  return client.db(dbName).collection("users");
}
