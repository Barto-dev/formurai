import LIVR from 'livr';

const defaultValues = {
  errorDictionary: {},
  errorClass: 'formurai-error',
  successClass: 'formurai-success',
  wrapperClass: 'formurai-container',
  errorMessageClass: 'formurai-message',
  autoTrim: true
}

export default class Formurai {
  #validator;
  #form;

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
    // this._isAutoTrim = autoTrim;
    // this.#errors = {};
    // this.#validationInputsArr = [];
    // this.#successClass = successClass;
    // this.#errorClass = errorClass;
    // this.#wrapperClass = wrapperClass;
    // this.#errorMessageClass = errorMessageClass;
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
    console.log('validation')
  }

  get formData() {
    const data = new FormData(this.#form);
    const values = {};
    data.forEach((value, key) => {
      values[key] = value;
    });
    return values;
  }
}
