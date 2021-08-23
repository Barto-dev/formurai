(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/formurai/node_modules/livr/lib/util.js
  var require_util = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/util.js"(exports, module) {
      module.exports = {
        isPrimitiveValue(value) {
          if (typeof value == "string")
            return true;
          if (typeof value == "number" && isFinite(value))
            return true;
          if (typeof value == "boolean")
            return true;
          return false;
        },
        looksLikeNumber(value) {
          if (!isNaN(+value))
            return true;
          return false;
        },
        isObject(obj) {
          return Object(obj) === obj && Object.getPrototypeOf(obj) === Object.prototype;
        },
        isEmptyObject(map) {
          for (const key in map) {
            if (map.hasOwnProperty(key)) {
              return false;
            }
          }
          return true;
        },
        escapeRegExp(str) {
          return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        isNoValue(value) {
          return value === void 0 || value === null || value === "";
        }
      };
    }
  });

  // node_modules/formurai/node_modules/livr/lib/Validator.js
  var require_Validator = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/Validator.js"(exports, module) {
      "use strict";
      var util = require_util();
      var DEFAULT_RULES = {};
      var IS_DEFAULT_AUTO_TRIM = 0;
      var Validator = class {
        constructor(livrRules, isAutoTrim) {
          this.isPrepared = false;
          this.livrRules = livrRules;
          this.validators = {};
          this.validatorBuilders = {};
          this.errors = null;
          if (isAutoTrim !== null && isAutoTrim !== void 0) {
            this.isAutoTrim = isAutoTrim;
          } else {
            this.isAutoTrim = IS_DEFAULT_AUTO_TRIM;
          }
          this.registerRules(DEFAULT_RULES);
        }
        static getDefaultRules() {
          return DEFAULT_RULES;
        }
        static registerAliasedDefaultRule(alias) {
          if (!alias.name)
            throw "Alias name required";
          DEFAULT_RULES[alias.name] = this._buildAliasedRule(alias.rules, alias.error);
        }
        static registerDefaultRules(rules2) {
          for (const ruleName in rules2) {
            DEFAULT_RULES[ruleName] = rules2[ruleName];
          }
        }
        static defaultAutoTrim(isAutoTrim) {
          IS_DEFAULT_AUTO_TRIM = !!isAutoTrim;
        }
        static _buildAliasedRule(rules2, errorCode) {
          if (!rules2)
            throw "Alias rules required";
          const livr = { value: rules2 };
          return (ruleBuilders) => {
            const validator2 = new Validator(livr).registerRules(ruleBuilders).prepare();
            return (value, undefined2, outputArr) => {
              const result = validator2.validate({ value });
              if (result) {
                outputArr.push(result.value);
                return;
              } else {
                return errorCode || validator2.getErrors().value;
              }
            };
          };
        }
        prepare() {
          const allRules = this.livrRules;
          for (const field in allRules) {
            let fieldRules = allRules[field];
            if (!Array.isArray(fieldRules)) {
              fieldRules = [fieldRules];
            }
            const validators = [];
            for (const fieldRule of fieldRules) {
              const parsed = this._parseRule(fieldRule);
              validators.push(this._buildValidator(parsed.name, parsed.args));
            }
            this.validators[field] = validators;
          }
          this.isPrepared = true;
          return this;
        }
        validate(data) {
          if (!this.isPrepared)
            this.prepare();
          if (!util.isObject(data)) {
            this.errors = "FORMAT_ERROR";
            return;
          }
          if (this.isAutoTrim) {
            data = this._autoTrim(data);
          }
          const errors = {};
          const result = {};
          for (const fieldName in this.validators) {
            const validators = this.validators[fieldName];
            if (!validators || !validators.length)
              continue;
            const value = data[fieldName];
            for (const validator2 of validators) {
              const fieldResultArr = [];
              const errCode = validator2(result.hasOwnProperty(fieldName) ? result[fieldName] : value, data, fieldResultArr);
              if (errCode) {
                errors[fieldName] = errCode;
                break;
              } else if (fieldResultArr.length) {
                result[fieldName] = fieldResultArr[0];
              } else if (data.hasOwnProperty(fieldName) && !result.hasOwnProperty(fieldName)) {
                result[fieldName] = value;
              }
            }
          }
          if (util.isEmptyObject(errors)) {
            this.errors = null;
            return result;
          } else {
            this.errors = errors;
            return false;
          }
        }
        getErrors() {
          return this.errors;
        }
        registerRules(rules2) {
          for (const ruleName in rules2) {
            this.validatorBuilders[ruleName] = rules2[ruleName];
          }
          return this;
        }
        registerAliasedRule(alias) {
          if (!alias.name)
            throw "Alias name required";
          this.validatorBuilders[alias.name] = this.constructor._buildAliasedRule(alias.rules, alias.error);
          return this;
        }
        getRules() {
          return this.validatorBuilders;
        }
        _parseRule(livrRule) {
          let name;
          let args;
          if (util.isObject(livrRule)) {
            name = Object.keys(livrRule)[0];
            args = livrRule[name];
            if (!Array.isArray(args))
              args = [args];
          } else {
            name = livrRule;
            args = [];
          }
          return { name, args };
        }
        _buildValidator(name, args) {
          if (!this.validatorBuilders[name]) {
            throw "Rule [" + name + "] not registered";
          }
          const allArgs = [];
          allArgs.push.apply(allArgs, args);
          allArgs.push(this.getRules());
          return this.validatorBuilders[name].apply(null, allArgs);
        }
        _autoTrim(data) {
          const dataType = typeof data;
          if (dataType !== "object" && data) {
            if (data.replace) {
              return data.replace(/^\s*/, "").replace(/\s*$/, "");
            } else {
              return data;
            }
          } else if (dataType == "object" && Array.isArray(data)) {
            const trimmedData = [];
            for (const item of data) {
              trimmedData.push(this._autoTrim(item));
            }
            return trimmedData;
          } else if (dataType == "object" && util.isObject(data)) {
            const trimmedData = {};
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                trimmedData[key] = this._autoTrim(data[key]);
              }
            }
            return trimmedData;
          }
          return data;
        }
      };
      module.exports = Validator;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/common/required.js
  var require_required = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/common/required.js"(exports, module) {
      var util = require_util();
      function required() {
        return (value) => {
          if (util.isNoValue(value)) {
            return "REQUIRED";
          }
          return;
        };
      }
      module.exports = required;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/common/not_empty.js
  var require_not_empty = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/common/not_empty.js"(exports, module) {
      function not_empty() {
        return (value) => {
          if (value !== null && value !== void 0 && value === "") {
            return "CANNOT_BE_EMPTY";
          }
          return;
        };
      }
      module.exports = not_empty;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/common/not_empty_list.js
  var require_not_empty_list = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/common/not_empty_list.js"(exports, module) {
      function not_empty_list() {
        return (list) => {
          if (list === void 0 || list === "")
            return "CANNOT_BE_EMPTY";
          if (!Array.isArray(list))
            return "FORMAT_ERROR";
          if (list.length < 1)
            return "CANNOT_BE_EMPTY";
          return;
        };
      }
      module.exports = not_empty_list;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/common/any_object.js
  var require_any_object = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/common/any_object.js"(exports, module) {
      var util = require_util();
      function any_object() {
        return (value) => {
          if (util.isNoValue(value))
            return;
          if (!util.isObject(value)) {
            return "FORMAT_ERROR";
          }
        };
      }
      module.exports = any_object;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/string/string.js
  var require_string = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/string/string.js"(exports, module) {
      var util = require_util();
      function string() {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          outputArr.push(value + "");
          return;
        };
      }
      module.exports = string;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/string/eq.js
  var require_eq = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/string/eq.js"(exports, module) {
      var util = require_util();
      function eq(allowedValue) {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          if (value + "" === allowedValue + "") {
            outputArr.push(allowedValue);
            return;
          }
          return "NOT_ALLOWED_VALUE";
        };
      }
      module.exports = eq;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/string/one_of.js
  var require_one_of = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/string/one_of.js"(exports, module) {
      var util = require_util();
      function one_of(allowedValues) {
        if (!Array.isArray(allowedValues)) {
          allowedValues = Array.prototype.slice.call(arguments);
          allowedValues.pop();
        }
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          for (const allowedValue of allowedValues) {
            if (value + "" === allowedValue + "") {
              outputArr.push(allowedValue);
              return;
            }
          }
          return "NOT_ALLOWED_VALUE";
        };
      }
      module.exports = one_of;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/string/max_length.js
  var require_max_length = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/string/max_length.js"(exports, module) {
      var util = require_util();
      function max_length(maxLength) {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          value += "";
          if (value.length > maxLength)
            return "TOO_LONG";
          outputArr.push(value);
        };
      }
      module.exports = max_length;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/string/min_length.js
  var require_min_length = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/string/min_length.js"(exports, module) {
      var util = require_util();
      function min_length(minLength) {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          value += "";
          if (value.length < minLength)
            return "TOO_SHORT";
          outputArr.push(value);
        };
      }
      module.exports = min_length;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/string/length_equal.js
  var require_length_equal = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/string/length_equal.js"(exports, module) {
      var util = require_util();
      function length_equal(length) {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          value += "";
          if (value.length < length)
            return "TOO_SHORT";
          if (value.length > length)
            return "TOO_LONG";
          outputArr.push(value);
        };
      }
      module.exports = length_equal;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/string/length_between.js
  var require_length_between = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/string/length_between.js"(exports, module) {
      var util = require_util();
      function length_between(minLength, maxLength) {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          value += "";
          if (value.length < minLength)
            return "TOO_SHORT";
          if (value.length > maxLength)
            return "TOO_LONG";
          outputArr.push(value);
        };
      }
      module.exports = length_between;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/string/like.js
  var require_like = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/string/like.js"(exports, module) {
      var util = require_util();
      function like(reStr, flags) {
        const isIgnoreCase = arguments.length === 3 && flags.match("i");
        const re = new RegExp(reStr, isIgnoreCase ? "i" : "");
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          value += "";
          if (!value.match(re))
            return "WRONG_FORMAT";
          outputArr.push(value);
        };
      }
      module.exports = like;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/numeric/integer.js
  var require_integer = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/numeric/integer.js"(exports, module) {
      var util = require_util();
      function integer() {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          if (!util.looksLikeNumber(value))
            return "NOT_INTEGER";
          if (!Number.isInteger(+value))
            return "NOT_INTEGER";
          outputArr.push(+value);
        };
      }
      module.exports = integer;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/numeric/positive_integer.js
  var require_positive_integer = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/numeric/positive_integer.js"(exports, module) {
      var util = require_util();
      function positive_integer() {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          if (!util.looksLikeNumber(value))
            return "NOT_POSITIVE_INTEGER";
          if (!Number.isInteger(+value) || +value < 1)
            return "NOT_POSITIVE_INTEGER";
          outputArr.push(+value);
        };
      }
      module.exports = positive_integer;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/numeric/decimal.js
  var require_decimal = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/numeric/decimal.js"(exports, module) {
      var util = require_util();
      function decimal() {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          if (!util.looksLikeNumber(value))
            return "NOT_DECIMAL";
          value += "";
          if (!/^(?:\-?(?:(?:[0-9]+\.[0-9]+)|(?:[0-9]+)))$/.test(value))
            return "NOT_DECIMAL";
          outputArr.push(+value);
        };
      }
      module.exports = decimal;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/numeric/positive_decimal.js
  var require_positive_decimal = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/numeric/positive_decimal.js"(exports, module) {
      var util = require_util();
      function positive_decimal() {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          if (!util.looksLikeNumber(value))
            return "NOT_POSITIVE_DECIMAL";
          if (Number.isNaN(+value) || +value <= 0)
            return "NOT_POSITIVE_DECIMAL";
          outputArr.push(+value);
        };
      }
      module.exports = positive_decimal;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/numeric/max_number.js
  var require_max_number = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/numeric/max_number.js"(exports, module) {
      var util = require_util();
      function max_number(maxNumber) {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          if (!util.looksLikeNumber(value))
            return "NOT_NUMBER";
          if (+value > +maxNumber)
            return "TOO_HIGH";
          outputArr.push(+value);
        };
      }
      module.exports = max_number;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/numeric/min_number.js
  var require_min_number = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/numeric/min_number.js"(exports, module) {
      var util = require_util();
      function min_number(minNumber) {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          if (!util.looksLikeNumber(value))
            return "NOT_NUMBER";
          if (+value < +minNumber)
            return "TOO_LOW";
          outputArr.push(+value);
        };
      }
      module.exports = min_number;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/numeric/number_between.js
  var require_number_between = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/numeric/number_between.js"(exports, module) {
      var util = require_util();
      function number_between(minNumber, maxNumber) {
        return (value, params, outputArr) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          if (!util.looksLikeNumber(value))
            return "NOT_NUMBER";
          if (+value < +minNumber)
            return "TOO_LOW";
          if (+value > +maxNumber)
            return "TOO_HIGH";
          outputArr.push(+value);
        };
      }
      module.exports = number_between;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/special/email.js
  var require_email = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/special/email.js"(exports, module) {
      var util = require_util();
      function email() {
        var emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (value) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          value += "";
          if (!emailRe.test(value))
            return "WRONG_EMAIL";
          if (/\@.*\@/.test(value))
            return "WRONG_EMAIL";
          if (/\@.*_/.test(value))
            return "WRONG_EMAIL";
          return;
        };
      }
      module.exports = email;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/special/equal_to_field.js
  var require_equal_to_field = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/special/equal_to_field.js"(exports, module) {
      var util = require_util();
      function equal_to_field(field) {
        return (value, params) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          if (value != params[field])
            return "FIELDS_NOT_EQUAL";
          return;
        };
      }
      module.exports = equal_to_field;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/special/url.js
  var require_url = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/special/url.js"(exports, module) {
      var util = require_util();
      function url() {
        const urlReStr = "^(?:(?:http|https)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[0-1]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))\\.?|localhost)(?::\\d{2,5})?(?:[/?#]\\S*)?$";
        const urlRe = new RegExp(urlReStr, "i");
        return (value) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          if (value.length < 2083 && urlRe.test(value))
            return;
          return "WRONG_URL";
        };
      }
      module.exports = url;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/special/iso_date.js
  var require_iso_date = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/special/iso_date.js"(exports, module) {
      var util = require_util();
      function iso_date() {
        return (value) => {
          if (util.isNoValue(value))
            return;
          if (!util.isPrimitiveValue(value))
            return "FORMAT_ERROR";
          const matched = value.match(/^(\d{4})-([0-1][0-9])-([0-3][0-9])$/);
          if (matched) {
            const epoch = Date.parse(value);
            if (!epoch && epoch !== 0)
              return "WRONG_DATE";
            const d = new Date(epoch);
            d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1e3);
            if (d.getFullYear() == matched[1] && d.getMonth() + 1 == +matched[2] && d.getDate() == +matched[3]) {
              return;
            }
          }
          return "WRONG_DATE";
        };
      }
      module.exports = iso_date;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/meta/nested_object.js
  var require_nested_object = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/meta/nested_object.js"(exports, module) {
      var Validator = require_Validator();
      var util = require_util();
      function nested_object(livr, ruleBuilders) {
        const validator2 = new Validator(livr).registerRules(ruleBuilders).prepare();
        return (nestedObject, params, outputArr) => {
          if (util.isNoValue(nestedObject))
            return;
          if (!util.isObject(nestedObject))
            return "FORMAT_ERROR";
          const result = validator2.validate(nestedObject);
          if (result) {
            outputArr.push(result);
            return;
          } else {
            return validator2.getErrors();
          }
        };
      }
      module.exports = nested_object;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/meta/variable_object.js
  var require_variable_object = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/meta/variable_object.js"(exports, module) {
      var Validator = require_Validator();
      var util = require_util();
      function variable_object(selectorField, livrs, ruleBuilders) {
        const validators = {};
        for (const selectorValue in livrs) {
          const validator2 = new Validator(livrs[selectorValue]).registerRules(ruleBuilders).prepare();
          validators[selectorValue] = validator2;
        }
        return (object, params, outputArr) => {
          if (util.isNoValue(object))
            return;
          if (!util.isObject(object) || !object[selectorField] || !validators[object[selectorField]]) {
            return "FORMAT_ERROR";
          }
          const validator2 = validators[object[selectorField]];
          const result = validator2.validate(object);
          if (result) {
            outputArr.push(result);
            return;
          } else {
            return validator2.getErrors();
          }
        };
      }
      module.exports = variable_object;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/meta/list_of.js
  var require_list_of = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/meta/list_of.js"(exports, module) {
      var Validator = require_Validator();
      var util = require_util();
      function list_of(rules2, ruleBuilders) {
        if (!Array.isArray(rules2)) {
          rules2 = Array.prototype.slice.call(arguments);
          ruleBuilders = rules2.pop();
        }
        const livr = { field: rules2 };
        const validator2 = new Validator(livr).registerRules(ruleBuilders).prepare();
        return (values, params, outputArr) => {
          if (util.isNoValue(values))
            return;
          if (!Array.isArray(values))
            return "FORMAT_ERROR";
          const results = [];
          const errors = [];
          let hasErrors = false;
          for (const value of values) {
            const result = validator2.validate({ field: value });
            if (result) {
              results.push(result.field);
              errors.push(null);
            } else {
              hasErrors = true;
              errors.push(validator2.getErrors().field);
              results.push(null);
            }
          }
          if (hasErrors) {
            return errors;
          } else {
            outputArr.push(results);
            return;
          }
        };
      }
      module.exports = list_of;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/meta/list_of_objects.js
  var require_list_of_objects = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/meta/list_of_objects.js"(exports, module) {
      var Validator = require_Validator();
      var util = require_util();
      function list_of_objects(livr, ruleBuilders) {
        const validator2 = new Validator(livr).registerRules(ruleBuilders).prepare();
        return (objects, params, outputArr) => {
          if (util.isNoValue(objects))
            return;
          if (!Array.isArray(objects))
            return "FORMAT_ERROR";
          const results = [];
          const errors = [];
          let hasErrors = false;
          for (const object of objects) {
            const result = validator2.validate(object);
            if (result) {
              results.push(result);
              errors.push(null);
            } else {
              hasErrors = true;
              errors.push(validator2.getErrors());
              results.push(null);
            }
          }
          if (hasErrors) {
            return errors;
          } else {
            outputArr.push(results);
            return;
          }
        };
      }
      module.exports = list_of_objects;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/meta/or.js
  var require_or = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/meta/or.js"(exports, module) {
      var Validator = require_Validator();
      function or() {
        const ruleSets = Array.prototype.slice.call(arguments);
        const ruleBuilders = ruleSets.pop();
        const validators = ruleSets.map((rules2) => {
          const livr = { field: rules2 };
          const validator2 = new Validator(livr).registerRules(ruleBuilders).prepare();
          return validator2;
        });
        return (value, params, outputArr) => {
          let lastError;
          for (const validator2 of validators) {
            const result = validator2.validate({ field: value });
            if (result) {
              outputArr.push(result.field);
              return;
            } else {
              lastError = validator2.getErrors().field;
            }
          }
          return lastError;
        };
      }
      module.exports = or;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/meta/list_of_different_objects.js
  var require_list_of_different_objects = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/meta/list_of_different_objects.js"(exports, module) {
      var Validator = require_Validator();
      var util = require_util();
      function list_of_different_objects(selectorField, livrs, ruleBuilders) {
        const validators = {};
        for (const selectorValue in livrs) {
          const validator2 = new Validator(livrs[selectorValue]).registerRules(ruleBuilders).prepare();
          validators[selectorValue] = validator2;
        }
        return (objects, params, outputArr) => {
          if (util.isNoValue(objects))
            return;
          if (!Array.isArray(objects))
            return "FORMAT_ERROR";
          const results = [];
          const errors = [];
          let hasErrors = false;
          for (const object of objects) {
            if (typeof object != "object" || !object[selectorField] || !validators[object[selectorField]]) {
              errors.push("FORMAT_ERROR");
              continue;
            }
            const validator2 = validators[object[selectorField]];
            const result = validator2.validate(object);
            if (result) {
              results.push(result);
              errors.push(null);
            } else {
              hasErrors = true;
              errors.push(validator2.getErrors());
              results.push(null);
            }
          }
          if (hasErrors) {
            return errors;
          } else {
            outputArr.push(results);
            return;
          }
        };
      }
      module.exports = list_of_different_objects;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/modifiers/default.js
  var require_default = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/modifiers/default.js"(exports, module) {
      var util = require_util();
      module.exports = (defaultValue) => {
        return (value, params, outputArr) => {
          if (util.isNoValue(value)) {
            outputArr.push(defaultValue);
          }
        };
      };
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/modifiers/trim.js
  var require_trim = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/modifiers/trim.js"(exports, module) {
      var util = require_util();
      function trim() {
        return (value, params, outputArr) => {
          if (util.isNoValue(value) || typeof value === "object")
            return;
          value += "";
          outputArr.push(value.replace(/^\s*/, "").replace(/\s*$/, ""));
        };
      }
      module.exports = trim;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/modifiers/to_lc.js
  var require_to_lc = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/modifiers/to_lc.js"(exports, module) {
      var util = require_util();
      function to_lc() {
        return (value, params, outputArr) => {
          if (util.isNoValue(value) || typeof value === "object")
            return;
          value += "";
          outputArr.push(value.toLowerCase());
        };
      }
      module.exports = to_lc;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/modifiers/to_uc.js
  var require_to_uc = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/modifiers/to_uc.js"(exports, module) {
      var util = require_util();
      function to_uc() {
        return (value, params, outputArr) => {
          if (util.isNoValue(value) || typeof value === "object")
            return;
          value += "";
          outputArr.push(value.toUpperCase());
        };
      }
      module.exports = to_uc;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/modifiers/remove.js
  var require_remove = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/modifiers/remove.js"(exports, module) {
      var util = require_util();
      function remove(chars) {
        chars = util.escapeRegExp(chars);
        const re = new RegExp("[" + chars + "]", "g");
        return (value, params, outputArr) => {
          if (util.isNoValue(value) || typeof value === "object")
            return;
          value += "";
          outputArr.push(value.replace(re, ""));
        };
      }
      module.exports = remove;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/rules/modifiers/leave_only.js
  var require_leave_only = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/rules/modifiers/leave_only.js"(exports, module) {
      var util = require_util();
      function leave_only(chars) {
        chars = util.escapeRegExp(chars);
        const re = new RegExp("[^" + chars + "]", "g");
        return (value, params, outputArr) => {
          if (util.isNoValue(value) || typeof value === "object")
            return;
          value += "";
          outputArr.push(value.replace(re, ""));
        };
      }
      module.exports = leave_only;
    }
  });

  // node_modules/formurai/node_modules/livr/lib/LIVR.js
  var require_LIVR = __commonJS({
    "node_modules/formurai/node_modules/livr/lib/LIVR.js"(exports, module) {
      var Validator = require_Validator();
      var util = require_util();
      var rules2 = {
        required: require_required(),
        not_empty: require_not_empty(),
        not_empty_list: require_not_empty_list(),
        any_object: require_any_object(),
        string: require_string(),
        eq: require_eq(),
        one_of: require_one_of(),
        max_length: require_max_length(),
        min_length: require_min_length(),
        length_equal: require_length_equal(),
        length_between: require_length_between(),
        like: require_like(),
        integer: require_integer(),
        positive_integer: require_positive_integer(),
        decimal: require_decimal(),
        positive_decimal: require_positive_decimal(),
        max_number: require_max_number(),
        min_number: require_min_number(),
        number_between: require_number_between(),
        email: require_email(),
        equal_to_field: require_equal_to_field(),
        url: require_url(),
        iso_date: require_iso_date(),
        nested_object: require_nested_object(),
        variable_object: require_variable_object(),
        list_of: require_list_of(),
        list_of_objects: require_list_of_objects(),
        or: require_or(),
        list_of_different_objects: require_list_of_different_objects(),
        default: require_default(),
        trim: require_trim(),
        to_lc: require_to_lc(),
        to_uc: require_to_uc(),
        remove: require_remove(),
        leave_only: require_leave_only()
      };
      Validator.registerDefaultRules(rules2);
      module.exports = { Validator, rules: rules2, util };
    }
  });

  // node_modules/formurai/dist/index.js
  var import_livr = __toModule(require_LIVR());
  var __defProp2 = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp2.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var Formurai = class {
    constructor(form2, {
      errorClass = "formurai-error",
      successClass = "formurai-success",
      wrapperClass = "formurai-container",
      errorMessageClass = "formurai-message",
      withWrapper = true,
      autoTrim = true,
      vibrate = true,
      notSubmit = false,
      multiStep = false
    } = {}) {
      this._form = form2;
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
      this._additionalEvents = ["formValid", "changeState"];
      this._events = {};
      this._autoTrimValues();
      this._onFormSubmit = this._onFormSubmit.bind(this);
    }
    init(rules2, messages = {}, state = false) {
      if (!state && this._multiStep) {
        throw TypeError("Multi step validation need initial state!");
      }
      this._rules = rules2;
      this._errorMessages = messages;
      if (this._multiStep) {
        this._setRulesForCurrentState(state);
      } else {
        this.validator = new import_livr.default.Validator(rules2);
        this._validationFields = Object.keys(rules2);
        this._currentStateMessages = this._errorMessages;
      }
      this._form.addEventListener("submit", this._onFormSubmit);
    }
    destroy() {
      this.validator = null;
      this._validationFields = [];
      this._errorMessages = {};
      this._form.removeEventListener("submit", this._onFormSubmit);
      const customEvents = Object.keys(this._events);
      if (customEvents.length) {
        customEvents.forEach((event) => this._form.removeEventListener(event, this._events[event].cb));
      }
    }
    changeState(state) {
      if (this._multiStep) {
        this._setRulesForCurrentState(state);
      } else if (!this._multiStep) {
        throw TypeError("changeState method only works with multi step forms!");
      }
    }
    checkForm() {
      const data = this.formData;
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
    }
    addRule(rules2) {
      if (!rules2) {
        return;
      }
      const isArray = Array.isArray(rules2);
      this._additionalRules = rules2;
      if (isArray) {
        rules2.forEach((rule) => this.validator.registerAliasedRule(__spreadValues({}, rule)));
      } else {
        this.validator.registerAliasedRule(__spreadValues({}, rules2));
      }
    }
    on(evtName, cb) {
      if (!this._additionalEvents.includes(evtName)) {
        throw TypeError(`No such event exists: ${evtName}`);
      }
      if (typeof cb !== "function") {
        return;
      }
      this._events[evtName] = {};
      this._events[evtName].event = new CustomEvent(evtName, { detail: { data: this.formData } });
      this._events[evtName].cb = cb;
      this._form.addEventListener(evtName, cb);
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
    get errorList() {
      const names = Object.keys(this._inputErrorsObj);
      const errorList = {};
      names.forEach((name) => {
        var _a;
        const errorCode = this._inputErrorsObj[name];
        errorList[name] = (_a = this._errorMessages[name]) == null ? void 0 : _a[errorCode];
      });
      return errorList;
    }
    _setRulesForCurrentState(state) {
      this.validator = null;
      this.validator = new import_livr.default.Validator(this._rules[state]);
      this._validationFields = Object.keys(this._rules[state]);
      this.addRule(this._additionalRules);
      this._currentStateMessages = this._errorMessages[state];
    }
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
    }
    _addInputErrorClass(inputWrapper) {
      if (inputWrapper) {
        inputWrapper.classList.remove(this._successClass);
        inputWrapper.classList.add(this._errorClass);
      }
    }
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
          console.log(e);
          console.error(`The ${inputName} field does not exist on this form`);
        }
      });
    }
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
    }
    _showErrorMessage(wrapper, inputName) {
      var _a, _b;
      const defaultError = this.errors[inputName];
      const customError = (_b = (_a = this._currentStateMessages) == null ? void 0 : _a[inputName]) == null ? void 0 : _b[defaultError];
      const errorMessageBlock = wrapper == null ? void 0 : wrapper.querySelector(`.${this._errorMessageClass}`);
      if (defaultError && customError && errorMessageBlock) {
        errorMessageBlock.innerText = customError;
      }
    }
    _getWrapperElement(input) {
      if (this._withWrapper) {
        return input.closest(`.${this._wrapperClass}`);
      } else {
        return input;
      }
    }
    _vibrate() {
      if (window.navigator.vibrate && this._isVibrate) {
        window.navigator.vibrate([300, 100, 300]);
      }
    }
    _autoTrimValues() {
      if (this._isAutoTrim) {
        import_livr.default.Validator.defaultAutoTrim(true);
      }
    }
    _dispatchFormValidEvent() {
      var _a;
      if ("formValid" in this._events) {
        this._events["formValid"].event.detail.data = this.formData;
        this._form.dispatchEvent((_a = this._events["formValid"]) == null ? void 0 : _a.event);
      }
    }
  };
  var dist_default = Formurai;

  // demo/ajax-form/index.js
  var rules = {
    name: ["required"],
    email: ["required", "email"],
    feedback: ["required", { min_length: [10] }]
  };
  var registrationErrors = {
    name: {
      REQUIRED: "First name required"
    },
    feedback: {
      REQUIRED: "Feedback required",
      TOO_SHORT: "Feedback cannot be less than 10 characters"
    },
    email: {
      REQUIRED: "Email required",
      WRONG_EMAIL: "Email must be valid"
    }
  };
  var form = document.querySelector("#registration-form");
  var success = document.querySelector(".send-success");
  var validator = new dist_default(form, {
    notSubmit: true
  });
  validator.init(rules, registrationErrors);
  var sendForm = async () => {
    const data = validator.formData;
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(data)
    });
    form.classList.add("hidden");
    success.classList.remove("hidden");
  };
  validator.on("formValid", sendForm);
})();
