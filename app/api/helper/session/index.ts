import { type AuthOptions, getServerSession } from 'next-auth';

import { UserRoleType } from '@utils/constants/user';

enum SessionErrorType {
  SESSION_NOT_FOUND = 'ES-001',
  EXPIRED_SESSION = 'ES-002',
  UNKNOWN_ERROR = 'ES-003',
  FORBIDDEN_ACCESS = 'ES-004',
}

type CheckSessionResponse =
  | {
      isValid: true;
      // session: Awaited<ReturnType<typeof getServerSession>>;
      userId: string;
    }
  | { isValid: false; message: string; status: number; code: string };

export const checkSession = async (
  authOptions: AuthOptions,
  adminOnly?: boolean,
): Promise<CheckSessionResponse> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
      return {
        isValid: false,
        message: 'No active session or user ID not found.',
        status: 401, // Unauthorized
        code: SessionErrorType.SESSION_NOT_FOUND,
      };
    }

    if (!adminOnly && session.user.role !== UserRoleType.USER) {
      return {
        isValid: false,
        message: 'Access denied. User role is required.',
        status: 403,
        code: SessionErrorType.FORBIDDEN_ACCESS,
      };
    }

    if (adminOnly && session.user.role !== UserRoleType.ADMIN) {
      return {
        isValid: false,
        message: 'Access denied. Admin role is required.',
        status: 403,
        code: SessionErrorType.FORBIDDEN_ACCESS,
      };
    }

    return {
      isValid: true,
      userId: session.user.id,
      // session,
    };
  } catch (error) {
    console.error('Error checking session:', error);

    return {
      isValid: false,
      message: 'An error occurred while checking the session.',
      status: 500,
      code: SessionErrorType.UNKNOWN_ERROR,
    };
  }
};
