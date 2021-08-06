import LIVR from 'livr';

class Formurai {

  constructor(form, {
    errorClass = 'formurai-error',
    successClass = 'formurai-success',
    wrapperClass = 'formurai-container',
    errorMessageClass = 'formurai-message',
    withWrapper = true,
    autoTrim = true,
    vibrate = true,
    notSubmit = false,
    multiStep = false
  } = {}) {
    this._form = form;
    this._isAutoTrim = autoTrim;
    this._isVibrate = vibrate;
    this._noSubmit = notSubmit;
    this._multiStep = multiStep;

    this._successClass = successClass;
    this._errorClass = errorClass;
    this._wrapperClass = wrapperClass;
    this._errorMessageClass = errorMessageClass;
    this._withWrapper = withWrapper;

    this._inputErrorsObj = {};
    this._validationFields = [];
    this._errorMessages = {};

    this._isFormValid = false;

    this._additionalEvents = ['formValid', 'changeState'];

    this._autoTrimValues();

  }

  init = (rules, messages = {}, state = false) => {
    if (!state && this._multiStep) {
      throw 'Multi step validation need initial state!'
    }

    this._rules = rules;
    this._errorMessages = messages;

    if (this._multiStep) {
      this._setRulesForCurrentState(state)
    } else {
      this.validator = new LIVR.Validator(rules);
      this._validationFields = Object.keys(rules);
      this._currentStateMessages = this._errorMessages;
    }

    this._form.addEventListener('submit', this._onFormSubmit);
  };

  destroy = () => {
    this.validator = null;
    this._validationFields = [];
    this._errorMessages = {};
    this._form.removeEventListener('submit', this._onFormSubmit);
  }

  changeState = (state) => {
    if (this._multiStep) {
      this._setRulesForCurrentState(state)
    } else if (!this._multiStep) {
      throw 'changeState method only works with multi step forms!'
    }
  }


  checkForm = () => {
    const data = this.formData
    const validData = this.validator.validate(data);
    if (validData) {
      this._inputErrorsObj = {};
      this._isFormValid = true;
      this._removeInputErrorClasses();
    } else {
      this._inputErrorsObj = this.validator.getErrors();
      this._isFormValid = false;
      this._checkInputsError();
      this._addInputSuccessClass();
    }
  };

  addRule = (rules) => {
    if (!rules) {
      return
    }

    const isArray = Array.isArray(rules);
    this._additionalRules = rules;

    if (isArray) {
      rules.forEach(rule => this.validator.registerAliasedRule({...rule}))
    } else {
      this.validator.registerAliasedRule({...rules});
    }
  }

  on = (evtName, cb) => {
    if (!this._additionalEvents.includes(evtName)) {
      return
    }
    console.log(cb)
  }

  get formData() {
    const data = new FormData(this._form);
    const values = {};
    data.forEach((value, key) => {
      values[key] = value;
    });
    return values;
  }

  get errors() {
    return this._inputErrorsObj;
  }

  get isFormValid() {
    return this._isFormValid;
  }

  _setRulesForCurrentState = (state) => {
    this.validator = null;
    this.validator = new LIVR.Validator(this._rules[state]);
    this._validationFields = Object.keys(this._rules[state]);
    this.addRule(this._additionalRules);
    this._currentStateMessages = this._errorMessages[state];
  }

  _onFormSubmit = (evt) => {
    evt.preventDefault();
    this.checkForm();
    if (this._isFormValid && !this._noSubmit) {
      this._form.submit();
    } else if (!this._isFormValid) {
      this._vibrate();
    }
  }

  _removeInputErrorClasses = () => {
    const errorFields = document.querySelectorAll(`.${this._errorClass}`);
    errorFields.forEach((input) => input.classList.remove(this._errorClass));
  };

  _addInputErrorClass = (inputWrapper) => {
    if (inputWrapper) {
      inputWrapper.classList.remove(this._successClass);
      inputWrapper.classList.add(this._errorClass);
    }
  };

  _checkInputsError = () => {
    this._removeInputErrorClasses();
    const errorsKey = Object.keys(this.errors);
    if (errorsKey.length) {
      errorsKey.forEach((inputName) => {
        const input = this._form.querySelector(`[name="${inputName}"]`);
        const inputWrapper = this._getWrapperElement(input);
        this._addInputErrorClass(inputWrapper);
        this._showErrorMessage(inputWrapper, inputName);
      });
    }
  }

  _addInputSuccessClass = () => {
    this._validationFields.forEach((inputName) => {
      const input = this._form.querySelector(`[name="${inputName}"]`);
      const inputWrapper = this._getWrapperElement(input);
      if (inputWrapper && !inputWrapper.classList.contains(this._errorClass)) {
        inputWrapper.classList.add(this._successClass);
      }
    });
  };

  _showErrorMessage = (wrapper, inputName) => {
    const defaultError = this.errors[inputName];
    const customError = this._currentStateMessages?.[inputName]?.[defaultError];
    const errorMessageBlock = wrapper?.querySelector(`.${this._errorMessageClass}`);
    if (defaultError && customError && errorMessageBlock) {
      errorMessageBlock.innerText = customError;
    }
  };

  // Возвращаем элемент в зависимости от того есть ли обертка у элемента
  _getWrapperElement = (input) => {
    if (this._withWrapper) {
      return input.closest(`.${this._wrapperClass}`);
    } else {
      return input;
    }
  }

  _vibrate = () => {
    if (window.navigator.vibrate && this._isVibrate) {
      window.navigator.vibrate([300, 100, 300]);
    }
  };

  _autoTrimValues = () => {
    if (this._isAutoTrim) {
      LIVR.Validator.defaultAutoTrim(true);
    }
  };
}

export default Formurai;
