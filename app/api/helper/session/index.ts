import { type AuthOptions, getServerSession } from 'next-auth';

enum SessionErrorType {
  SESSION_NOT_FOUND = 'ES-001',
  EXPIRED_SESSION = 'ES-002',
  UNKNOWN_ERROR = 'ES-003',
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
): Promise<CheckSessionResponse> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return {
        isValid: false,
        message: 'No active session or user ID not found.',
        status: 401, // Unauthorized
        code: SessionErrorType.EXPIRED_SESSION,
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
