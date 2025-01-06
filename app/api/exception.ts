export const SessionErrorException = {
  SESSION_NOT_FOUND: {
    code: 'S-01',
    message: 'Session not found.',
    status: 401,
  },
  EXPIRED_SESSION: {
    code: 'S-02',
    message: 'Session has expired.',
    status: 401,
  },
  UNKNOWN_ERROR: {
    code: 'S-03',
    message: 'An unknown session error occurred.',
    status: 500,
  },
  FORBIDDEN_ACCESS: {
    code: 'S-04',
    message: 'Access is forbidden for this session.',
    status: 403,
  },
};

export const CommonErrorException = {
  DATE_RANGE_INVALID: {
    code: 'C-01',
    message: 'The start date cannot be greater than the end date.',
    status: 400,
  },
  NOT_FOUND: {
    code: 'C-02',
    message: 'The requested resource was not found.',
    status: 404,
  },
  REFERENCED: {
    code: 'C-03',
    message: 'This resource is referenced by another entity.',
    status: 422,
  },
  UNKNOWN_ERROR: {
    code: 'C-04',
    message: 'An unknown error occurred.',
    status: 500,
  },
};

export const CategoryErrorException = {
  REFERENCED_BY_PRODUCT: {
    code: 'CAT-01',
    message: 'This category is referenced by a product and cannot be deleted.',
    status: 422,
  },
};

export const OrderErrorException = {
  EXCEED_QUANTITY: {
    code: 'O-01',
    message: 'The requested quantity exceeds the available stock.',
    status: 400,
  },
};

export const UserErrorException = {
  USER_ALREADY_EXISTS: {
    code: 'U-01',
    message: 'A user with this information already exists.',
    status: 409,
  },
  EMAIL_ALREADY_EXISTS: {
    code: 'U-02',
    message: 'A user with this email address already exists.',
  },
};
