import type { UserRoleType } from '@utils/constants/user';

export interface UserVO {
  _id: string;
  name: string;
  email: string;
  telephone: string;
  address: string;
  avatar: string;
  role: UserRoleType;
  active: boolean;
}
