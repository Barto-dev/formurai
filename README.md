<div align="center">
    <img src="https://raw.githubusercontent.com/Barto-dev/formurai/master/assets/logo.svg" width="180" height="180" alt="Logo" />
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

// define errors for user, its optional
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

## CSS
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
When the form is submitted, or the checkForm method is called, the wrapper(.formurai-container) is assigned an error or success class.

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

If you need to show errors in the interface, add the formurai-container class to the element to which you want to assign the error or success class (optional step).

To display an error, inside the container, define an element with the class formurai-message, errors that you pass during initialization will be displayed here (optional step).
## Usage

## Options

| Option  | Type | Default value | Description |
| ----- | ----- | ----- | ----- |
| errorClass | string | 'formurai-error' | The class that will be added to the field with an error |
| successClass | string | 'formurai-success' | The class that will be added to the field with an success |
| wrapperClass | string | 'formurai-container' | The wrapper class to which the error or success class will be added |
| withWrapper | boolean | true | If you do not need to show error messages and it will be enough for you to add an error or success class to the field, set false |
| autoTrim | boolean | true | Soon... |
| vibrate | boolean | true | Soon... |
| notSubmit | boolean | false | Soon... |
| multiStep | boolean | false | Soon... |


## Methods

## Rules
soon...

## Examples

[Registration form](https://codesandbox.io/s/shy-sunset-nzb8u?file=/src/index.js)

