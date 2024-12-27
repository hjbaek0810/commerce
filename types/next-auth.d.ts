import "next-auth";
import "next-auth/jwt";



declare module "next-auth" {
  interface User {
    _id: ObjectId | string;
    loginId: string;
    password: string | null;
    email: string;
    contactEmail: string;
    name: string;
    role: 'ADMIN'  | 'USER';
    image: string;
    loginType: 'CREDENTIALS' | 'GOOGLE';
    telephone: string;
    postCode: string;
    address: string;
    subAddress: string;
    createdAt: Date;
    updatedAt: Date;
    exp: number;
    iat: number;
    jti: string;
  }

  interface Session extends DefaultSession {
    user: User;
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    provider: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: User;

    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    provider: string;
  }
}

