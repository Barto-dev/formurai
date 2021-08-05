<div align="center">
    <img src="assets/logo.svg" width="180" height="180" alt="Logo" />
</div>
<br>
<div align="center">
<strong>Formurai</strong> is a lightweight and powerfull library for declarative form validation
</div>
<br>

<div align="center">
  <a href="https://bundlephobia.com/package/formurai@0.0.11">
    <img alt="size" src="https://badgen.net/bundlephobia/minzip/formurai" />
  </a>
</div>


## Features

- 📦 Just **4.4 KB** gzipped 
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
  'login-email': ['required', 'email'],
};

// define errors for user
export const errors = {
  'login-email': {
    REQUIRED: 'Email required',
    WRONG_EMAIL: 'Email must be valid',
  }
};

const form = document.querySelector('#login');
const validator = new Formurai(form);
validator.init(rules, errors);
```

As a key for the rules, you need to pass the name of the field to be validated. The field name must be unique within this form

## css
```css
.formurai-message {
  display: none;
}

.formurai-error .formurai-message {
  display: none;
}

.formurai-error input {
  border: 1px solid red;
}

.formurai-success input {
  border: 1px solid green;
}
```

## HTML
```html
<form id="login">
  
  <section class="formurai-container">
    <input name="login-email" type="email">
    <span class="formurai-message"></span>
  </section>

  <button type="submit">Submit</button>
  
</form>
```
## Usage

## Options

## Methods

## Rules
soon...

## Examples

[Registration form](https://codesandbox.io/s/shy-sunset-nzb8u?file=/src/index.js)

