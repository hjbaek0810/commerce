import type { UserRoleType } from '@utils/constants/user';

export interface UserVO {
  _id: string;
  loginId: string;
  name: string;
  email: string;
  contactEmail: string;
  telephone: string;
  postCode: string;
  address: string;
  subAddress: string;
  role: UserRoleType;
  image: string;
}
