import LIVR from 'livr';

class Formurai {

  /**
   * @param {HTMLFormElement} form
   * @param {string} errorClass
   * @param {string} successClass
   * @param {string} wrapperClass
   * @param {string} errorMessageClass
   * @param {boolean} withWrapper
   * @param {boolean} autoTrim
   * @param {boolean} vibrate
   * @param {boolean} notSubmit
   * @param {boolean} multiStep
   */
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

    this._events = {};

    this._autoTrimValues();

    this._onFormSubmit = this._onFormSubmit.bind(this);

  }

  /**
   * @param {Object} rules
   * @param {Object} messages
   * @param {(string|boolean)} state
   */
  init(rules, messages = {}, state = false) {
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

  destroy() {
    this.validator = null;
    this._validationFields = [];
    this._errorMessages = {};
    this._form.removeEventListener('submit', this._onFormSubmit);
    const customEvents = Object.keys(this._events);
    if (customEvents.length) {
      customEvents.forEach((event) => this._form.removeEventListener(event, this._events[event].cb))
    }
  }

  /**
   * @param {string} state
   */
  changeState(state) {
    if (this._multiStep) {
      this._setRulesForCurrentState(state)
    } else if (!this._multiStep) {
      throw 'changeState method only works with multi step forms!'
    }
  }


  checkForm() {
    const data = this.formData
    const validData = this.validator.validate(data);
    if (validData) {
      this._inputErrorsObj = {};
      this._isFormValid = true;
      this._removeInputErrorClasses();
      this._addInputSuccessClass();
    } else {
      this._inputErrorsObj = this.validator.getErrors();
      this._isFormValid = false;
      this._checkInputsError();
      this._addInputSuccessClass();
    }
  };

  /**
   * @param {Object|Array.<Object>|undefined} rules
   */
  addRule(rules) {
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

  /**
   * @param {'formValid'|'changeState'} evtName
   * @param {function} cb
   */
  on(evtName, cb) {
    if (!this._additionalEvents.includes(evtName)) {
      throw `No such event exists: ${evtName}`
    }

    if (typeof cb !== 'function') {
      return;
    }

    this._events[evtName] = {};
    this._events[evtName].event = new CustomEvent(evtName, {detail: {data: this.formData}});
    this._events[evtName].cb = cb;
    this._form.addEventListener(evtName, cb);
  }

  /**
   * @returns {Object}
   */
  get formData() {
    const data = new FormData(this._form);
    const values = {};
    data.forEach((value, key) => {
      values[key] = value;
    });
    return values;
  }

  /**
   * @returns {*|{}}
   */
  get errors() {
    return this._inputErrorsObj;
  }

  /**
   * @returns {boolean}
   */
  get isFormValid() {
    return this._isFormValid;
  }

  /**
   * @param {string}state
   * @private
   */
  _setRulesForCurrentState(state) {
    this.validator = null;
    this.validator = new LIVR.Validator(this._rules[state]);
    this._validationFields = Object.keys(this._rules[state]);
    this.addRule(this._additionalRules);
    this._currentStateMessages = this._errorMessages[state];
  }

  /**
   * @param {HTMLFormElement<Event>} evt
   * @private
   */
  _onFormSubmit(evt) {
    evt.preventDefault();
    this.checkForm();
    if (this._isFormValid) {
      this._dispatchFormValidEvent();
    }

    if (this._isFormValid && !this._noSubmit) {
      this._form.submit();
    } else if (!this._isFormValid) {
      this._vibrate();
    }
  }

  _removeInputErrorClasses() {
    const errorFields = document.querySelectorAll(`.${this._errorClass}`);
    errorFields.forEach((input) => input.classList.remove(this._errorClass));
  };

  /**
   * @param {HTMLElement|null} inputWrapper
   * @private
   */
  _addInputErrorClass(inputWrapper) {
    if (inputWrapper) {
      inputWrapper.classList.remove(this._successClass);
      inputWrapper.classList.add(this._errorClass);
    }
  };

  /**
   * Removes error classes from all fields, and re-add them where needed
   * @private
   */
  _checkInputsError() {
    this._removeInputErrorClasses();
    const errorsKey = Object.keys(this.errors) || [];

    errorsKey.forEach((inputName) => {
      try {
        const input = this._form.querySelector(`[name="${inputName}"]`);
        const inputWrapper = this._getWrapperElement(input);
        this._addInputErrorClass(inputWrapper);
        this._showErrorMessage(inputWrapper, inputName);
      } catch (e) {
        console.error(`The ${inputName} field does not exist on this form`);
      }
    })

  }

  /**
   * Add a success class if there is no error class on this field
   * @private
   */
  _addInputSuccessClass() {
    this._validationFields.forEach((inputName) => {
      try {
        const input = this._form.querySelector(`[name="${inputName}"]`);
        const inputWrapper = this._getWrapperElement(input);
        if (inputWrapper && !inputWrapper.classList.contains(this._errorClass)) {
          inputWrapper.classList.add(this._successClass);
        }
      } catch (e) {
        console.error(`The ${inputName} field does not exist on this form`);
      }
    });
  };

  /**
   * @param {HTMLElement|null} wrapper
   * @param {string} inputName
   * @private
   */
  _showErrorMessage(wrapper, inputName) {
    const defaultError = this.errors[inputName];
    const customError = this._currentStateMessages?.[inputName]?.[defaultError];
    const errorMessageBlock = wrapper?.querySelector(`.${this._errorMessageClass}`);
    if (defaultError && customError && errorMessageBlock) {
      errorMessageBlock.innerText = customError;
    }
  };

  /**
   * return the element on which we will hang up the error or success classes
   * @param {HTMLInputElement} input
   * @returns {HTMLElement|HTMLInputElement}
   * @private
   */
  _getWrapperElement(input) {
    if (this._withWrapper) {
      return input.closest(`.${this._wrapperClass}`);
    } else {
      return input;
    }
  }

  /**
   * @private
   */
  _vibrate() {
    if (window.navigator.vibrate && this._isVibrate) {
      window.navigator.vibrate([300, 100, 300]);
    }
  };

  /**
   * @private
   */
  _autoTrimValues() {
    if (this._isAutoTrim) {
      LIVR.Validator.defaultAutoTrim(true);
    }
  };

  _dispatchFormValidEvent() {
    if ('formValid' in this._events) {
      this._events['formValid'].event.detail.data = this.formData;
      this._form.dispatchEvent(this._events['formValid']?.event);
    }
  }
}

export default Formurai;
