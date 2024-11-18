import type { UserRoleType } from '@utils/constants/user';

export type CreateUser = {
  credential: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRoleType;
};

export type UpdateUser = {
  _id: string;
  credential: string;
  name: string;
  email: string;
  telephone?: string;
  address?: string;
  role: UserRoleType;
  active?: boolean;
};
