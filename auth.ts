import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import authConfig from "./auth.config";
import { getClientPromise, isMongoConfigured } from "./lib/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(isMongoConfigured()
    ? { adapter: MongoDBAdapter(getClientPromise()) }
    : {}),
});
