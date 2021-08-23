# Formurai

<div>
    <img align="right" src="https://raw.githubusercontent.com/Barto-dev/formurai/master/assets/logo.svg" width="120" height="120" alt="Logo" />
</div>

<br>

<div align="left">
<strong>Formurai</strong> is a <strong>lightweight</strong> and powerfull library for <strong>declarative</strong> form validation.
</div>

Validating forms has never been so <strong>easy</strong>. A few lines of code and your form is validated

<div align="left">
  <a href="https://bundlephobia.com/package/formurai@0.0.11">
    <img alt="size" src="https://badgen.net/bundlephobia/minzip/formurai@0.2.2" />
  </a>
</div>

<br>

```js
import Formurai from 'formurai';

const rules = {'login-email': ['email']};

const errors = {
  'login-email': {WRONG_EMAIL: 'Email must be valid'}
};

const form = document.querySelector('#login');

const validator = new Formurai(form);
validator.init(rules, errors);
```




## Table of Contents

- [Features](#Features)
- [Setup](#Setup)
- [Usage](#Usage)
- [Options](#Options)
- [Methods](#Methods)
- [Rules](#Rules)
- [Examples](#Examples)
- [Roadmap](#Roadmap)

## Features

- 📦 Just **4.4 KB** gzipped 
- 👩🏻‍💻 Rules are **declarative**
- ✨ Any number of **rules for each field**
- ❌ Flexible **error handling** and their display
- 🗜 Has possibility to validate **multi-step forms**
- ⚙️ Configurable check queue
- 📜 Easy to create and reuse your **own rules**
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
const errors = {
  'login-email': {
    REQUIRED: 'Email required',
    WRONG_EMAIL: 'Email must be valid',
  }
};

const form = document.querySelector('#login');
const validator = new Formurai(form);
validator.init(rules, errors);
```
**[ALL RULES AND ERROR CODES](https://livr-spec.org/validation-rules.html)**

As a key for the rules, you need to pass the name of the field to be validated. The field name must be unique within this form

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
| autoTrim | boolean | true | Removes spaces before and after validated values |
| vibrate | boolean | true | If an error occurs while submitting the form, a vibration is triggered. [Support devices](https://caniuse.com/vibration) | |
| notSubmit | boolean | false | If you don't need to reload the page, after submitting the form, set true |
| multiStep | boolean | false | If you need to validate a form with many steps, and each step needs to be validated separately. [See multi-step example](https://codesandbox.io/s/multi-step-from-validation-tjzob?file=/src/index.js) |


## Methods
```js
const validator = new Formurai(form);
```

### init(rules, messages?, initialState?)

Initializes validator, error object and initialState, optional parameters, initialState work only in multi-step forms.
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
Returns an object with error codes
```js
validator.errors // {name: "REQUIRED", email: "WRONG_EMAIL"}
```

### errorList
Returns human-readable error list. For example, if you need to show all errors somewhere in one place
```js
validator.errorList // {name: "First name required", email: "Email must be valid"}
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
    body: validator.formData // contain all form data
  })
  console.log('Your form has been submitted successfully')
}

validator.on('formValid', sendForm);
```
[See full example](https://codesandbox.io/s/kind-pike-smzkx?file=/src/index.js)


## Rules
**[ALL RULES](https://livr-spec.org/validation-rules.html)**

All rules are based on LIVR (Language Independent Validation Rules). 
So all the rules that you find **[here](https://livr-spec.org/validation-rules.html)** you can use in this validator

**Most common rules**

| Rule  | Example | Error | 
| ----- | ----- | ----- |
| eq |  name: {'eq': 'Snow'}  | 'NOT_ALLOWED_VALUE'|
| one_of |  name: {'one_of': ['Snow', 'Tirion']}  | 'NOT_ALLOWED_VALUE'|
| email |  login: 'email'  |  'WRONG_EMAIL'|
| integer |  age: 'integer'   |  'NOT_INTEGER'|
| min_length |  login: { min_length: 2 }  | 'TOO_SHORT'|
| max_length |  name: { max_length: 10 }  | 'TOO_LONG'|
| length_between |  code: { length_between: [2, 10]  |  'TOO_LONG' or 'TOO_SHORT'|
| number_between |  age: { 'number_between': [18, 95] }  |  'TOO_HIGH' or 'TOO_LOW' or 'NOT_NUMBER'|
| like |  price: { like: ['^\w+?$', 'i'] }  | 'WRONG_FORMAT'|


## Examples

- [Registration form](https://codesandbox.io/s/shy-sunset-nzb8u?file=/src/index.js)
- [Multi step form](https://codesandbox.io/s/multi-step-from-validation-tjzob?file=/src/index.js)
- [Ajax form](https://codesandbox.io/s/kind-pike-smzkx?file=/src/index.js)

## Roadmap

- [x] Add a getter with a list of error messages
- [ ] Add a scroll method to error input
- [ ] Add a showError method to show errors from backend
- [ ] Implement 'formInvalid' and 'changeState' events
- [ ] Treeshaking
- [ ] Сover the code with tests
