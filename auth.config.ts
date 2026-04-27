import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      /**
       * 既定の PKCE は code_verifier を暗号化クッキーに載せる。
       * 本番で AUTH_URL / ドメイン不一致やシークレット周りの不整合があると
       * InvalidCheck: pkceCodeVerifier value could not be parsed になりやすい。
       * Google（機密クライアント）は state のみでも認可コードフローが成立する。
       */
      checks: ["state"],
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const protectedPath =
        pathname.startsWith("/dashboard") || pathname.startsWith("/profile");
      if (protectedPath && !auth?.user) {
        return false;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        if (user.name) token.name = user.name;
        if (user.image) token.picture = user.image;
      }
      if (trigger === "update" && session?.user) {
        if (session.user.name !== undefined) token.name = session.user.name;
        if (session.user.image !== undefined)
          token.picture = session.user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (token.name) session.user.name = token.name as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
