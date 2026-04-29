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

/** MongoDB 接続。未設定のときは呼び出し時にエラー。 */
export function getClientPromise(): Promise<MongoClient> {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error('環境変数 "MONGODB_URI" が設定されていません。');
  }
  if (process.env.NODE_ENV === "development") {
    return (global._mongoClientPromise ??= createClientPromise(mongodbUri));
  }
  return createClientPromise(mongodbUri);
}

export function getDbName(): string | undefined {
  const name = process.env.MONGODB_DB;
  return name && name.length > 0 ? name : undefined;
}
