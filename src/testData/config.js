// export const rules = {
//   'text': [{ remove: '0123456789' }, 'required'],
//   'code': ['required'],
//   'email': ['strong_password'],
//   'phone': ['required', 'integer', {length_between: [1, 3]}],
//   'password': ['required', 'integer', {length_between: [5, 7]}],
//   'country': ['required', {min_length: 6}],
// };

export const rules = {
  'name': ['required'],
/*  'surname': ['required'],
  'email': ['required', 'email'],
  'phone': ['required', 'integer', {length_equal: 11}],
  'password': ['required', {min_length: 6}],
  'password2': ['required', {'equal_to_field': 'password'}],*/
};

export const rules2 = {
  'text': [{remove: '0123456789'}, 'required'],
  'code': ['required'],
};

export const registrationErrors = {
  'name': {
    REQUIRED: 'Last name required',
  },
  'surname': {
    REQUIRED: 'First name required',
  },
  'email': {
    REQUIRED: 'Email required',
    WRONG_EMAIL: 'Email must be valid',
  },
  'phone': {
    NOT_INTEGER: 'Phone must be a number',
    REQUIRED: 'Phone required',
    TOO_LONG: 'Phone must contain no more than 11 digits',
    TOO_SHORT: 'Phone must contain at least 11 digits',
  },
  'password': {
    REQUIRED: 'Password required',
    TOO_SHORT: 'Password must contain at least 6 symbols',
  },
  'password2': {
    REQUIRED: 'Password repeat required',
    FIELDS_NOT_EQUAL: 'Repeat password must match password',
  },
};


