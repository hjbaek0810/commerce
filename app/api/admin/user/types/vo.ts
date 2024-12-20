import type { UserVO } from '@api/user/types/vo';

export type AdminUserVO = Omit<UserVO, 'role'>;
