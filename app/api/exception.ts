export const SessionErrorException = {
  SESSION_NOT_FOUND: {
    code: 'S-01',
    message: 'Session not found.',
  },
  EXPIRED_SESSION: {
    code: 'S-02',
    message: 'Session has expired.',
  },
  UNKNOWN_ERROR: {
    code: 'S-03',
    message: 'An unknown session error occurred.',
  },
  FORBIDDEN_ACCESS: {
    code: 'S-04',
    message: 'Access is forbidden for this session.',
  },
};

export const CommonErrorException = {
  DATE_RANGE_INVALID: {
    code: 'C-01',
    message: 'The start date cannot be greater than the end date.',
  },
  NOT_FOUND: {
    code: 'C-02',
    message: 'The requested resource was not found.',
  },
  REFERENCED: {
    code: 'C-03',
    message: 'This resource is referenced by another entity.',
  },
  UNKNOWN_ERROR: {
    code: 'C-04',
    message: 'An unknown error occurred.',
  },
};

export const CategoryErrorException = {
  REFERENCED_BY_PRODUCT: {
    code: 'CAT-01',
    message: 'This category is referenced by a product and cannot be deleted.',
  },
};

export const OrderErrorException = {
  EXCEED_QUANTITY: {
    code: 'O-01',
    message: 'The requested quantity exceeds the available stock.',
  },
};

export const UserErrorException = {
  USER_ALREADY_EXISTS: {
    code: 'U-01',
    message: 'A user with this information already exists.',
  },
  EMAIL_ALREADY_EXISTS: {
    code: 'U-02',
    message: 'A user with this email address already exists.',
  },
};
