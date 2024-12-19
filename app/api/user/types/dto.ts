import type { UserRoleType } from '@utils/constants/user';

export type CreateUser = {
  name: string;
  contactEmail: string;
  loginId: string;
  password: string;
  role: UserRoleType;
  telephone: string;
  postCode?: string;
  address?: string;
  subAddress?: string;
};

export type UpdateUser = {
  contactEmail?: string;
  password?: string;
  telephone?: string;
  postCode?: string;
  address?: string;
  subAddress?: string;
};
