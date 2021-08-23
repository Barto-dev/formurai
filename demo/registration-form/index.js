import Formurai from '../../src/Formurai';

// declare validation rules based on LIVR (Language Independent Validation Rules)
export const rules = {
  name: ["required"],
  surname: ["required"],
  email: ["required", "email"],
  phone: ["required", "integer", { length_equal: 11 }],
  password: ["required", { min_length: 6 }],
  password2: ["required", { equal_to_field: "password" }]
};

// declare validation errors, its optional
export const registrationErrors = {
  name: {
    REQUIRED: "First name required"
  },
  surname: {
    REQUIRED: "Surname required"
  },
  email: {
    REQUIRED: "Email required",
    WRONG_EMAIL: "Email must be valid"
  },
  phone: {
    NOT_INTEGER: "The phone must be numbers",
    REQUIRED: "Phone required",
    TOO_LONG: "Phone must contain no more than 11 digits",
    TOO_SHORT: "Phone must contain at least 11 digits"
  },
  password: {
    REQUIRED: "Password required",
    TOO_SHORT: "Password must contain at least 6 symbols"
  },
  password2: {
    REQUIRED: "Password repeat required",
    FIELDS_NOT_EQUAL: "Repeat password must match password"
  }
};

const form = document.querySelector("#registration-form");

if (form) {
  const validator = new Formurai(form);
  validator.init(rules, registrationErrors);
}
