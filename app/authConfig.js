export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login", //if we are logined , it will redirect to this route
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl)); //second arg is the base url
      }
      return true;
    },
  },
};
