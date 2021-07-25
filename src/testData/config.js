export const rules = {
  'text': ['required'],
  'code': ['required'],
  'email': ['required', 'email'],
  'phone': ['required', 'integer', { length_between: [1, 3] }],
  'password': ['required', 'integer', { length_between: [5, 7] }],
  'country': ['required', { min_length: 6 }],
};

