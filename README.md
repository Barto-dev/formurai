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
    <img alt="size" src="https://badgen.net/bundlephobia/minzip/formurai@0.1.6" />
  </a>
</div>

- [Features](#Features)
- [Setup](#Setup)
- [Usage](#Usage)
- [Options](#Options)
- [Methods](#Methods)
- [Rules](#Rules)
- [Examples](#Examples)

## Features

- 📦 Just **4.2 KB** gzipped 
- 👩🏻‍💻 Rules are declarative 
- 📜 Easy to create and reuse your own rules
- ✨ Any number of rules for each field
- 🗜 Has possibility to validate multistep forms
- ⚙️ Configurable check queue
- ❌ Flexible error handling and their display
- 👍 Don't need Jquery.

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

### CSS
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

### HTML
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
Basic usage, you need to pass the form and rules.
```js
/**
 * @param {HTMLFormElement} form 
 * @param {Object} options 
 * @type {Formurai}
 */
const validator = new Formurai(form, options);
validator.init(rules);
```

## Options

| Option  | Type | Default value | Description |
| ----- | ----- | ----- | ----- |
| errorClass | string | 'formurai-error' | The class that will be added to the field with an error |
| successClass | string | 'formurai-success' | The class that will be added to the field with an success |
| wrapperClass | string | 'formurai-container' | The wrapper class to which the error or success class will be added |
| errorMessageClass | string | 'formurai-message' | The class of the element into which the error will be displayed must be inside the wrapperClass |
| withWrapper | boolean | true | If you do not need to show error messages and it will be enough for you to add an error or success class to the field, set false |
| autoTrim | boolean | true | Soon... |
| vibrate | boolean | true | Soon... |
| notSubmit | boolean | false | Soon... |
| multiStep | boolean | false | Soon... |


## Methods
```js
const validator = new Formurai(form);
```

### init(rules, messages?, initialState?)

Initializes validator, error object and initialState, optional parameters, initialState work only in multi step forms.
```js
validator.init(rules)
```

### destroy()
Destroys the validator and all associated event listeners. Also delete all added rules.
```js
validator.destroy()
```
### changeState(state)
Change current state in multi step form. The value must be a key with the rules for the current step
```js
const rules = {
  'step-1': {...stepRules},
  'step-2': {...stepRules},
}

validator.changeState('step-2')
```

### checkForm()
Manually run a form validation like
```js

const nextStepButton = document.querySelector('.next-step');

nextStepButton.addEventListener('click', () => {
  validator.checkForm();
  
  if (validator.isFormValid) {
    // go to the next step
  }
})

```

### addRule(rule)
```js
validator.addRule()
```
### formData
```js
validator.formData
```

### errors
```js
validator.errors
```

### isFormValid
Returns the current state of form validation
```js
validator.isFormValid // true | false
```

## Rules
| Rule  | Example | Error | 
| ----- | ----- | ----- |
| eq | { name: {'eq': 'Anton'} } | 'NOT_ALLOWED_VALUE'|
| one_of | { name: {'one_of': ['Anton', 'Igor']} } | 'NOT_ALLOWED_VALUE'|
| max_length | { name: { max_length: 10 } } | 'TOO_LONG'|
| eq | { name: {'eq': 'Anton'} } | 'NOT_ALLOWED_VALUE'|
| eq | { name: {'eq': 'Anton'} } | 'NOT_ALLOWED_VALUE'|
| eq | { name: {'eq': 'Anton'} } | 'NOT_ALLOWED_VALUE'|
| eq | { name: {'eq': 'Anton'} } | 'NOT_ALLOWED_VALUE'|


## Examples

[Registration form](https://codesandbox.io/s/shy-sunset-nzb8u?file=/src/index.js)

