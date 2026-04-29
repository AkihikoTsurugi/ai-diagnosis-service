import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectMongoose() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('環境変数 "MONGODB_URI" が設定されていません。');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (process.env.NODE_ENV === "development") {
    global._mongooseConn ??= mongoose.connect(uri);
    return global._mongooseConn;
  }

  return mongoose.connect(uri);
}
