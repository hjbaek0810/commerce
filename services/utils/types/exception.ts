// TODO: update

export enum CategoryExceptionCode {
  ADMIN_CATEGORY_NOT_FOUND = 'A-CA-001',
  ADMIN_CATEGORY_NOT_UPDATED = 'A-CA-002',
  ADMIN_CATEGORY_REFERENCED = 'A-CA-003',
  CATEGORY_NOT_FOUND = 'CA-001',
}

export enum SessionExceptionCode {
  SESSION_NOT_FOUND = 'ES-001',
  EXPIRED_SESSION = 'ES-002',
  UNKNOWN_ERROR = 'ES-003',
}

export enum UserExceptionCode {
  USER_ALREADY_EXISTS = 'U-001',
  EMAIL_ALREADY_EXISTS = 'U-002',
}
