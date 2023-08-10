import NextAuth from 'next-auth';
import { Roles } from '../enums/roles';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      role: Roles;
      is_email_verified: boolean;
    };
  }

  interface JWT {
    id: number;
    email: string;
    role: Roles;
    is_email_verified: boolean;
  }
}
