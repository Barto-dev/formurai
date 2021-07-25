import LIVR from 'livr';

const defaultValues = {
  errorDictionary: {},
  errorClass: 'formurai-error',
  successClass: 'formurai-success',
  wrapperClass: 'formurai-container',
  errorMessageClass: 'formurai-message',
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

    this.#errorsDictionary = {};
    this.#validationFields = [];

  }

  init = (rules) => {
    this.#validator = new LIVR.Validator(rules);
    this.#validationFields = Object.keys(rules);
    this.#form.addEventListener('submit', this.#validationInputs);
  };

  destroy = () => {
    this.#validator = null;
    this.#form.removeEventListener('submit', this.#validationInputs);
    this.#validationFields = [];
  }

  #validationInputs = (evt) => {
    evt.preventDefault();
    this.#checkErrors();
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

  #checkErrors = () => {
    const data = this.formData
    const validData = this.#validator.validate(data);
    if (validData) {
      this.#errorsDictionary = {};
      this.#isFormValid = true;
      this.#removeInputErrorClasses();
    } else {
      this.#errorsDictionary = this.#validator.getErrors();
      this.#isFormValid = false;
      this.#addInputErrorClass();
      // this.#showInputSuccess();
    }
  };

  #removeInputErrorClasses = () => {
    const errorFields = document.querySelectorAll(`.${this.#errorClass}`);
    errorFields.forEach((input) => input.classList.remove(this.#errorClass));
  };

  #addInputErrorClass = () => {
    this.#removeInputErrorClasses();
    const errorsKey = Object.keys(this.errors);
    if (errorsKey.length) {
      errorsKey.forEach((inputName) => {
        const input = this.#form.querySelector(`[name="${inputName}"]`);
        const field = input.closest(`.${this.#wrapperClass}`);
        // const errorMessageBlock = field?.querySelector(`.${this.#errorMessageClass}`);
        // this.#showErrorMessage(errorMessageBlock, inputName);
        field?.classList.remove(this.#successClass);
        field?.classList.add(this.#errorClass);
      });
    }
  };

  #vibrate = () => {
    if (window.navigator.vibrate && this.#isVibrate) {
      window.navigator.vibrate([300, 100, 300]);
    }
  };

}
