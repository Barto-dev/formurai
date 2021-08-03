import LIVR from 'livr';

class Formurai {
  #form;
  #errorMessages;
  #isFormValid;

  #isAutoTrim;
  #isVibrate;

  #successClass;
  #errorClass;
  #wrapperClass;
  #errorMessageClass;
  #withWrapper;

  #validationFields;
  #inputErrorsObj;

  constructor(form, {
    errorClass = 'formurai-error',
    successClass = 'formurai-success',
    wrapperClass = 'formurai-container',
    errorMessageClass = 'formurai-message',
    withWrapper = true,
    autoTrim = true,
    vibrate = true
  } = {}) {
    this.#form = form;
    this.#isAutoTrim = autoTrim;
    this.#isVibrate = vibrate;

    this.#successClass = successClass;
    this.#errorClass = errorClass;
    this.#wrapperClass = wrapperClass;
    this.#errorMessageClass = errorMessageClass;
    this.#withWrapper = withWrapper;

    this.#inputErrorsObj = {};
    this.#validationFields = [];
    this.#errorMessages = {};

    this.#isFormValid = false;

    this.#autoTrimValues();

  }

  init = (rules, messages = {}) => {
    this.validator = new LIVR.Validator(rules);
    this.#validationFields = Object.keys(rules);
    this.#errorMessages = messages;
    this.#form.addEventListener('submit', this.#onFormSubmit);
  };

  destroy = () => {
    this.validator = null;
    this.#validationFields = [];
    this.#errorMessages = {};
    this.#form.removeEventListener('submit', this.#onFormSubmit);
  }

  checkForm = () => {
    const data = this.formData
    const validData = this.validator.validate(data);
    if (validData) {
      this.#inputErrorsObj = {};
      this.#isFormValid = true;
      this.#removeInputErrorClasses();
    } else {
      this.#inputErrorsObj = this.validator.getErrors();
      this.#isFormValid = false;
      this.#checkInputsError();
      this.#addInputSuccessClass();
    }
  };

  addRule = (rules) => {
    const isArray = Array.isArray(rules);
    if (isArray) {
      rules.forEach(rule => this.validator.registerAliasedRule({...rule}))
    } else {
      this.validator.registerAliasedRule({...rules});
    }
  }

  get formData() {
    const data = new FormData(this.#form);
    const values = {};
    data.forEach((value, key) => {
      values[key] = value;
    });
    return values;
  }

  get errors() {
    return this.#inputErrorsObj;
  }

  get isFormValid() {
    return this.#isFormValid;
  }

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.checkForm();
    if (this.isFormValid) {
      this.#form.submit();
    } else {
      this.#vibrate();
    }
    console.log(this.formData)
  }

  #removeInputErrorClasses = () => {
    const errorFields = document.querySelectorAll(`.${this.#errorClass}`);
    errorFields.forEach((input) => input.classList.remove(this.#errorClass));
  };

  #addInputErrorClass = (inputWrapper) => {
    if (inputWrapper) {
      inputWrapper.classList.remove(this.#successClass);
      inputWrapper.classList.add(this.#errorClass);
    }
  };

  #checkInputsError = () => {
    this.#removeInputErrorClasses();
    const errorsKey = Object.keys(this.errors);
    if (errorsKey.length) {
      errorsKey.forEach((inputName) => {
        const input = this.#form.querySelector(`[name="${inputName}"]`);
        const inputWrapper = this.#getWrapperElement(input);
        this.#addInputErrorClass(inputWrapper);
        this.#showErrorMessage(inputWrapper, inputName);
      });
    }
  }

  #addInputSuccessClass = () => {
    this.#validationFields.forEach((inputName) => {
      const input = this.#form.querySelector(`[name="${inputName}"]`);
      const inputWrapper = this.#getWrapperElement(input);
      if (!inputWrapper.classList.contains(this.#errorClass)) {
        inputWrapper.classList.add(this.#successClass);
      }
    });
  };

  #showErrorMessage = (wrapper, inputName) => {
    const defaultError = this.errors[inputName];
    const customError = this.#errorMessages?.[inputName]?.[defaultError];
    const errorMessageBlock = wrapper?.querySelector(`.${this.#errorMessageClass}`);
    if (defaultError && customError && errorMessageBlock) {
      errorMessageBlock.innerText = customError;
    }
  };


  // Возвращаем элемент в зависимости от того есть ли обертка у элемента
  #getWrapperElement = (input) => {
    if (this.#withWrapper) {
      return input.closest(`.${this.#wrapperClass}`);
    } else {
      return input;
    }
  }

  #vibrate = () => {
    if (window.navigator.vibrate && this.#isVibrate) {
      window.navigator.vibrate([300, 100, 300]);
    }
  };

  #autoTrimValues = () => {
    if (this.#isAutoTrim) {
      LIVR.Validator.defaultAutoTrim(true);
    }
  };
}

export default Formurai;
