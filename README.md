# Lightweight form validation library
## basic usage
### HTML
```
<form id="login">

  <section class="formurai-container">
    <input name="name" type="text">
    <span class="formurai-message"></span>
  </section>

  <section class="formurai-container">
    <input name="code" type="text">
    <span class="formurai-message"></span>
  </section>

  <section class="formurai-container">
    <input name="email" type="text">
    <span class="formurai-message"></span>
  </section>

  <button type="submit">Submit</button>
  
</form>
```

### JS
```
import Formurai from 'Formurai';

const rules = {
  'name': ['required'],
  'code': ['required', 'integer', {length_between: [1, 3]}],
  'email': ['required', 'email'],
};

export const registrationErrors = {
  'name': {
    REQUIRED: 'Name required',
  },
  'code': {
    REQUIRED: 'First name required',
    TOO_LONG: 'Phone code must contain no more than 3 digits',
    TOO_SHORT: 'Phone code must contain at least 1 digits',
  },
  'email': {
    REQUIRED: 'Email required',
    WRONG_EMAIL: 'Email must be valid',
  }
};

const form = document.querySelector('#login');
const validator = new Formurai(form);
validator.init(rules, registrationErrors);
```
