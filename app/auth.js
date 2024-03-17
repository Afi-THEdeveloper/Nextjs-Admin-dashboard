import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./authConfig";
import { User } from "./lib/models";
import bcrypt from "bcrypt";
import { connectTodb } from "./lib/utils";

const login = async (credentials) => {
  try {
    connectTodb()
    const user = await User.findOne({ username: credentials.username });
    if (!user) throw new Error("username is wrong");

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user?.password
    );

    if (!isPasswordCorrect) throw new Error("password is wrong");

    return user;
  } catch (error) {
    console.log(error);
    throw new Error("failed to login");
  }
};

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  // ADD ADDITIONAL INFORMATION TO SESSION
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.img = user.img;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
        session.user.img = token.img;
      }
      return session;
    },
  },
});
