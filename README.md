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
- ⚡️ Based on LIVR(Language Independent Validation Rules)
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
Destroys the validator and all associated event listeners (custom to). Also delete all added rules.
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
Accepts object or array of objects with custom rules. Rules need to be added after initialization
```js

const rules = {
  password: 'strong_password'
}

const customRule = {
  name: 'strong_password',
  rules: [{length_between: [15, 20]}],
  error: 'WEAK_PASSWORD'
}

validator.init(rules)
validator.addRule(customRule)
```
### formData
Returns an object with data from the form
```js
validator.formData // {name: 'Leonardo', email: 'leonardo@gmail.com'}
```

### errors
Return an object with error codes
```js
validator.errors // {name: "REQUIRED", email: "WRONG_EMAIL"}
```

### isFormValid
Returns the current state of form validation
```js
validator.isFormValid // true | false
```

## Events
```js
validator.on(evt, callback);
```
### formValid
This listener is triggered when the form is fully valid, useful if you need to send it in ajax, without reloading the page.
```js

const sendForm = async () => {
  await fetch('https://example.com', {
    method: 'POST',
    body: evt.detail.data // contain all form data
  })
  console.log('Your form has been submitted successfully')
}

validator.on('formValid', sendForm);
```

## Rules
[ALL RULES](https://livr-spec.org/validation-rules.html)

All rules are based on LIVR (Language Independent Validation Rules). 
So all the rules that you find **[here](https://livr-spec.org/validation-rules.html)** you can use in this validator

Most common rules

| Rule  | Example | Error | 
| ----- | ----- | ----- |
| eq | { name: {'eq': 'Snow'} } | 'NOT_ALLOWED_VALUE'|
| one_of | { name: {'one_of': ['Snow', 'Tirion']} } | 'NOT_ALLOWED_VALUE'|
| max_length | { name: { max_length: 10 } } | 'TOO_LONG'|
| email | { login: 'email' } |  'WRONG_EMAIL'|
| like | { name: { like: ['^\w+?$', 'i'] } | 'WRONG_FORMAT'|
| integer | { age: 'integer' } } |  'NOT_INTEGER'|
| number_between | { age: { 'number_between': [18, 95] } } |  'TOO_HIGH' or 'TOO_LOW' or 'NOT_NUMBER'|


## Examples

- [Registration form](https://codesandbox.io/s/shy-sunset-nzb8u?file=/src/index.js)
- [Multi step form](https://codesandbox.io/s/multi-step-from-validation-tjzob?file=/src/index.js)
- [Ajax form](https://codesandbox.io/s/shy-sunset-nzb8u?file=/src/multistep.js)
