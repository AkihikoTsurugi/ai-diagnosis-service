import { MongoClient } from "mongodb";

const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
  throw new Error('環境変数 "MONGODB_URI" が設定されていません。');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(connectionString: string): Promise<MongoClient> {
  const client = new MongoClient(connectionString);
  return client.connect();
}

/** Vercel 等のサーバーレスでも同一実行環境内で接続を再利用する（公式推奨パターン） */
const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ??= createClientPromise(mongodbUri);

export default clientPromise;

export function getDbName(): string | undefined {
  const name = process.env.MONGODB_DB;
  return name && name.length > 0 ? name : undefined;
}
