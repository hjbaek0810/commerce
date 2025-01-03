import { type AuthOptions, getServerSession } from 'next-auth';

import { SessionErrorException } from '@api/exception';
import { UserRoleType } from '@utils/constants/user';

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
        message: SessionErrorException.SESSION_NOT_FOUND.message,
        status: 401, // Unauthorized
        code: SessionErrorException.SESSION_NOT_FOUND.code,
      };
    }

    if (!adminOnly && session.user.role !== UserRoleType.USER) {
      return {
        isValid: false,
        message: SessionErrorException.FORBIDDEN_ACCESS.message,
        status: 403,
        code: SessionErrorException.FORBIDDEN_ACCESS.code,
      };
    }

    if (adminOnly && session.user.role !== UserRoleType.ADMIN) {
      return {
        isValid: false,
        message: SessionErrorException.FORBIDDEN_ACCESS.message,
        status: 403,
        code: SessionErrorException.FORBIDDEN_ACCESS.code,
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
      message: SessionErrorException.UNKNOWN_ERROR.message,
      status: 500,
      code: SessionErrorException.UNKNOWN_ERROR.code,
    };
  }
};
