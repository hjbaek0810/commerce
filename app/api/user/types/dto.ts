import type { UserRoleType } from '@utils/constants/user';

export type CreateUser = {
  name: string;
  email: string;
  loginId: string;
  password: string;
  role: UserRoleType;
  telephone: string;
  postCode?: string;
  address?: string;
  subAddress?: string;
};

export type UpdateUser = {
  _id: string;
  name: string;
  password: string;
  telephone?: string;
  address?: string;
};
