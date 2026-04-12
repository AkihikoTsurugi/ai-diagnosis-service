import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import authConfig from "./auth.config";
import clientPromise from "./lib/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
});
