import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  const uri = process.env.MONGODB_URI;
  return typeof uri === "string" && uri.length > 0;
}

function createClientPromise(connectionString: string): Promise<MongoClient> {
  const client = new MongoClient(connectionString);
  return client.connect();
}

function getOrCreateClientPromise(): Promise<MongoClient> {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error('環境変数 "MONGODB_URI" が設定されていません。');
  }
  return (global._mongoClientPromise ??= createClientPromise(mongodbUri));
}

/** Vercel 等のサーバーレスでも同一実行環境内で接続を再利用する（公式推奨パターン） */
const clientPromise = getOrCreateClientPromise();

export default clientPromise;

export function getClientPromise(): Promise<MongoClient> {
  return getOrCreateClientPromise();
}

export function getDbName(): string | undefined {
  const name = process.env.MONGODB_DB;
  return name && name.length > 0 ? name : undefined;
}
