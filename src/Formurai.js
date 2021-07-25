import LIVR from 'livr';

const defaultValues = {
  errorDictionary: {},
  errorClass: 'formurai-error',
  successClass: 'formurai-success',
  wrapperClass: 'formurai-container',
  errorMessageClass: 'formurai-message',
  withWrapper: true,
  autoTrim: true,
  vibrate: true
}

export default class Formurai {
  #validator;
  #form;
  #errorsDictionary;
  #isFormValid;

  #isAutoTrim;
  #isVibrate;

  #successClass;
  #errorClass;
  #wrapperClass;
  #errorMessageClass;
  #withWrapper;

  #validationFields;
  #errorDictionary;

  constructor(form, config = defaultValues) {
    this.#form = form;
    this.#isAutoTrim = config.autoTrim;
    this.#isVibrate = config.vibrate;
    this.#errorDictionary = config.errorDictionary;

    this.#successClass = config.successClass;
    this.#errorClass = config.errorClass;
    this.#wrapperClass = config.wrapperClass;
    this.#errorMessageClass = config.errorMessageClass;
    this.#withWrapper = config.withWrapper;

    this.#errorsDictionary = {};
    this.#validationFields = [];

    this.#isFormValid = false;

  }

  init = (rules) => {
    this.#validator = new LIVR.Validator(rules);
    this.#validationFields = Object.keys(rules);
    this.#form.addEventListener('submit', this.#onFormSubmit);
  };

  destroy = () => {
    this.#validator = null;
    this.#validationFields = [];
    this.#form.removeEventListener('submit', this.#onFormSubmit);
  }

  checkForm = () => {
    const data = this.formData
    const validData = this.#validator.validate(data);
    if (validData) {
      this.#errorsDictionary = {};
      this.#isFormValid = true;
      this.#removeInputErrorClasses();
    } else {
      this.#errorsDictionary = this.#validator.getErrors();
      this.#isFormValid = false;
      this.#checkInputsError();
      this.#addInputSuccessClass();
    }
  };

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.checkForm();
    if (this.#isFormValid) {
      this.#form.submit();
    } else {
      this.#vibrate();
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
    return this.#errorsDictionary;
  }

  get isFormValid() {
    return this.#isFormValid;
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
        const inputWrapper = input.closest(`.${this.#wrapperClass}`);
        this.#addInputErrorClass(inputWrapper);
        this.#showErrorMessage(inputWrapper, inputName);
      });
    }
  }

  #addInputSuccessClass = () => {
    const inputs = this.#form.querySelectorAll(`.${this.#wrapperClass}`);
    inputs.forEach((input) => {
      if (!input.classList.contains(this.#errorClass)) {
        input.classList.add(this.#successClass);
      }
    });
  };

  #showErrorMessage = (wrapper, inputName) => {
    const defaultError = this.errors[inputName];
    const customError = this.#errorDictionary?.[inputName]?.[defaultError];
    const errorMessageBlock = wrapper?.querySelector(`.${this.#errorMessageClass}`);
    if (defaultError && customError && wrapper) {
      errorMessageBlock.innerText = customError;
    }
  };

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

}
