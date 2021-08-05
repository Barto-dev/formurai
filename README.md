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
    <input name="email" type="email">
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
- https://codesandbox.io/s/shy-sunset-nzb8u?file=/src/index.js
