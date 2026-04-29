import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import authConfig from "./auth.config";
import { getClientPromise, isMongoConfigured } from "./lib/mongodb";

const useMongoAdapter =
  isMongoConfigured() && process.env.AUTH_USE_MONGO_ADAPTER === "true";

function getClientPromiseWithErrorHandler() {
  const promise = getClientPromise();
  promise.catch((err) => {
    console.error("[auth] MongoDB client connection failed:", err);
  });
  return promise;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(useMongoAdapter
    ? { adapter: MongoDBAdapter(getClientPromiseWithErrorHandler()) }
    : {}),
});
