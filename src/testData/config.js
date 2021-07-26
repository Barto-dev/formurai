export const rules = {
  'text': ['required'],
  'code': ['required'],
  'email': ['required', 'email', 'strong_password'],
  'phone': ['required', 'integer', {length_between: [1, 3]}],
  'password': ['required', 'integer', {length_between: [5, 7]}],
  'country': ['required', {min_length: 6}],
};

export const registrationErrors = {
  'text': {
    REQUIRED: 'Last name required',
  },
  'code': {
    REQUIRED: 'First name required',
  },
  'email': {
    REQUIRED: 'Email required',
    WRONG_EMAIL: 'Email must be valid',
  },
  'phone': {
    NOT_INTEGER: 'Phone code must be a number',
    REQUIRED: 'Phone code required',
    TOO_LONG: 'Phone code must contain no more than 3 digits',
    TOO_SHORT: 'Phone code must contain at least 1 digits',
  },
  'password': {
    NOT_INTEGER: 'Phone must be a number',
    REQUIRED: 'Phone number required',
    TOO_LONG: 'Phone must contain no more than 7 digits',
    TOO_SHORT: 'Phone must contain at least 5 digits',
  },
  'country': {
    REQUIRED: 'Password required',
    TOO_SHORT: 'Password must be at least 6 characters long',
  },
};


