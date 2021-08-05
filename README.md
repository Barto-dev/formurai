<div align="center">
    <img src="assets/logo.svg" width="180" height="180" alt="Logo" />
</div>

<div align="center">
  <a href="https://bundlephobia.com/package/formurai@0.0.11">
    <img alt="size" src="https://badgen.net/bundlephobia/minzip/formurai" />
  </a>
</div>

<div align="center">
  <strong>Formurai</strong> is a lightweight library for declarative form validation
</div>


## Features

- 📦 **Small**: Just **4.4 KB** gzipped 
- 👩🏻‍💻 Rules are declarative 
- 📜 Easy to create and reuse your own rules
- ✨ Any number of rules for each field
- 🗜 Has possibility to validate multistep forms
- ⚙️ Configurable check queue
- ❌ Flexible error handling and their display

## Setup
### Install the package
```js
npm install formurai
```

```js
yarn add formurai
```

### JS
```js
import Formurai from 'formurai';

// define rules
const rules = {
  'email': ['required', 'email'],
};

// define errors for user
export const errors = {
  'email': {
    REQUIRED: 'Email required',
    WRONG_EMAIL: 'Email must be valid',
  }
};

const form = document.querySelector('#login');
const validator = new Formurai(form);
validator.init(rules, errors);
```

## Usage
soon...
## Methods

## Examples
- https://codesandbox.io/s/shy-sunset-nzb8u?file=/src/index.js

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
