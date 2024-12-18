import "next-auth";
import "next-auth/jwt";



declare module "next-auth" {
  interface User {
    id: string; // google
    _id: string; // db
    loginId: string;
    email: string;
    name: string;
    role: string;
    picture: string;
    exp: number;
    iat: number;
    jti: string;
  }

  interface Session extends DefaultSession {
    user: User;
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: User;

    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
  }
}

