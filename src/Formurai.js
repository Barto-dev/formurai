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
  #errors;

  #isAutoTrim;
  #isVibrate;

  #successClass;
  #errorClass;
  #wrapperClass;
  #errorMessageClass;

  // #errors;
  // #form;
  // #validationInputsArr;
  // #successClass;
  // #errorClass;
  // #wrapperClass;
  // #errorMessageClass;
  // #errorDictionary;

  constructor(form, config = defaultValues) {
    this.#form = form;
    this.#isAutoTrim = config.autoTrim;
    this.#isVibrate = config.vibrate;
    this.#errors = {};

    this.#successClass = config.successClass;
    this.#errorClass = config.errorClass;
    this.#wrapperClass = config.wrapperClass;
    this.#errorMessageClass = config.errorMessageClass;

    // this.#validationInputsArr = [];
    // this.#errorDictionary = errorDictionary;
  }

  init = (rules) => {
    this.#validator = new LIVR.Validator(rules);
    this.#form.addEventListener('submit', this.#validationInputs);
    // this.#validationInputsArr = Object.keys(rules);
  };

  destroy = () => {
    this.#validator = null;
    this.#form.removeEventListener('submit', this.#validationInputs);
  }

  #validationInputs = (evt) => {
    evt.preventDefault();
    this.#checkErrors();
  }

  get formData() {
    const data = new FormData(this.#form);
    const values = {};
    data.forEach((value, key) => {
      values[key] = value;
    });
    return values;
  }

  #checkErrors = () => {
    const data = this.formData
    const validData = this.#validator.validate(data);
    if (validData) {
      this.#errors = {};
      // this.#clearInputErrors();
    } else {
      this.#errors = this.#validator.getErrors();
      // this.#showInputErrors();
      // this.#showInputSuccess();
    }
  };

  #vibrate = () => {
    if (window.navigator.vibrate && this.#isVibrate) {
      window.navigator.vibrate([300, 100, 300]);
    }
  };

}
