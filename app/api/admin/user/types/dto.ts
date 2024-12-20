import type { UserSortType } from '@utils/constants/user';

export type AdminSearchUser = {
  name?: string;
  loginId?: string;
  email?: string;
  telephone?: string;
  sort?: UserSortType;
};
