// import Formurai from "formurai";
import Formurai from "formurai";

// declare validation rules based on LIVR (Language Independent Validation Rules)
export const rules = {
  name: ["required"],
  email: ["required", "email"],
  feedback: ["required", { min_length: [10] }]
};

// declare validation errors, its optional
export const registrationErrors = {
  name: {
    REQUIRED: "First name required"
  },
  feedback: {
    REQUIRED: "Feedback required",
    TOO_SHORT: "Feedback cannot be less than 10 characters"
  },
  email: {
    REQUIRED: "Email required",
    WRONG_EMAIL: "Email must be valid"
  }
};

const form = document.querySelector("#registration-form");
const success = document.querySelector(".send-success");

const validator = new Formurai(form, {
  notSubmit: true
});
validator.init(rules, registrationErrors);

const sendForm = async () => {
  const data = validator.formData;
  await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(data)
  });

  form.classList.add("hidden");
  success.classList.remove("hidden");
};

validator.on("formValid", sendForm);
