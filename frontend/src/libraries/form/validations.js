export const patterns = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  // password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
  password: /^(?=.*[a-z]).{8,15}$/,
  number: /^[0-9]*$/,
  ipAddress: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  url: /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
  // "dateTime":
};

const validations = {
  required: {
    message: () => "This field is required",
  },
  minLength: {
    message: (length) => "Min length limit is " + length,
  },
  maxLength: {
    message: (length) => "Max length limit is " + length,
  },
  number: {
    message: () => "Value must be a number",
  },
  minValue: {
    message: (minValue) => "Value must be atleast greater than or equal to " + minValue,
  },
  maxValue: {
    message: (maxValue) => "Value must not be greater than " + maxValue,
  },
  // "dateTime": {
  //     message: () => "Date is invalid"
  // },
  // todo: Add match validation
  // "match": {
  //     message: (label) => label + " mismatch",
  // },
  pattern: {
    message: () => "This pattern is invalid",
  },
  email: {
    message: () => "This email address is invalid",
  },
  url: {
    message: () => "The provided url is invalid",
  },
  password: {
    message: () =>
      "Password must be between 8-15 characters",
    // "Password must be between 8-15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
  },
  custom: {
    message: () => "This custom pattern is invalid",
  },
};

/*
input:
{
  message: Optional (if not provided, default message will be used)
}
*/
export const getRequiredValidation = (message) => {
  let type = "required";
  let validation = {
    type: type,
    message: message && typeof message === "string" ? message : validations[type].message(),
  };
  return validation;
};

/*
input:
{
  threshold: number (required)
  message: Optional (if not provided, default message will be used)
}
*/
export const getMinLengthValidation = (threshold, message) => {
  let type = "minLength";
  let validation =
    threshold && typeof threshold === "number"
      ? {
        type: type,
        threshold: threshold,
        message: message && typeof message === "string" ? message : validations[type].message(threshold),
      }
      : {
        /** empty */
      };

  return validation;
};

/*
input:
{
  threshold: number (required)
  message: Optional (if not provided, default message will be used)
}
*/
export const getMaxLengthValidation = (threshold, message) => {
  let type = "maxLength";
  let validation =
    threshold && typeof threshold === "number"
      ? {
        type: type,
        threshold: threshold,
        message: message && typeof message === "string" ? message : validations[type].message(threshold),
      }
      : {
        /** empty */
      };

  return validation;
};

/*
input:
{
  message: Optional (if not provided, default message will be used)
}
*/
const getNumberValidation = (settings) => {
  let validation = {
    type: settings.type,
    regEx: patterns[settings.type],
    message: settings.message && typeof settings.message === "string" ? settings.message : validations[settings.type].message(),
  };

  return validation;
};

/*
input:
{
  threshold: number (required)
  message: Optional (if not provided, default message will be used)
}
*/
export const getMinValueValidation = (threshold, message) => {
  let type = "minValue";
  let validation =
    threshold && typeof threshold === "number"
      ? {
        type: type,
        threshold: threshold,
        message: message && typeof message === "string" ? message : validations[type].message(threshold),
      }
      : {
        /** empty */
      };

  return validation;
};

/*
input:
{
  threshold: number (required)
  message: Optional (if not provided, default message will be used)
}
*/
export const getMaxValueValidation = (threshold, message) => {
  let type = "maxValue";
  let validation =
    threshold && typeof threshold === "number"
      ? {
        type: type,
        threshold: threshold,
        message: message && typeof message === "string" ? message : validations[type].message(threshold),
      }
      : {
        /** empty */
      };

  return validation;
};

/*
input:
{
  label: Label of the field (required)
  message: Optional (if not provided, default message will be used)
}
*/
const getMatchValidation = (settings) => {
  let type = "match";
  let validation = settings.label
    ? {
      type: type,
      label: settings.label,
      message: settings.message ? settings.message : validations[type].message(settings.label),
    }
    : {
      /** empty */
    };

  return validation;
};

/*
input:
{
  message: Optional (if not provided, default message will be used)
}
*/
// const getDateTimeValidation = (settings) => {
//   let validation = settings.threshold
//     ? {
//         type: settings.type,
//         regEx: patterns[settings.type],
//         message: settings.message && typeof settings.message === "string" ? settings.message : validations[settings.type].message(),
//       }
//     : {
//         /** empty */
//       };

//   return validation;
// };

/*
input:
{
  regEx: regular expression string (required)
  message: Optional (if not provided, default message will be used)
}
*/
const getPatternValidation = (settings) => {
  let regExIsValid = true;
  let regEx = settings.regEx ? settings.regEx : "";
  try {
    new RegExp(regEx);
  } catch (e) {
    regExIsValid = false;
  }
  let validation = regExIsValid
    ? {
      type: settings.type,
      regEx: regEx,
      message: settings.message && typeof settings.message === "string" ? settings.message : validations[settings.type].message(),
    }
    : {
      /* empty */
    };
  return validation;
};

/*
input:
{
  message: Optional (if not provided, default message will be used)
}
*/
const getPasswordValidation = (settings) => {

  let validation = {
    type: settings.type,
    regEx: patterns[settings.type],
    disabled: settings.disabled,
    message: settings.message && typeof settings.message === "string" ? settings.message : validations[settings.type].message()
  }
  return validation;
}

/*
input:
{
  message: Optional (if not provided, default message will be used)
}
*/
const getEmailValidation = (settings) => {
  let validation = {
    type: settings.type,
    regEx: patterns[settings.type],
    message: settings.message && typeof settings.message === "string" ? settings.message : validations[settings.type].message(),
  };
  return validation;
};

/*
input:
{
  message: Optional (if not provided, default message will be used)
}
*/
const getUrlValidation = (settings) => {
  let type = 'url';
  let validation = {
    type: type,
    regEx: patterns[type],
    message: settings.message && typeof settings.message === "string" ? settings.message : validations[type].message(),
  };
  return validation;
};

/*
input:
{
  callback(): must be a valid function (required)
  message: Optional (if not provided, default message will be used)
}
*/
const getCustomValidation = (settings) => {
  let callbackIsValid = settings.callback && typeof settings.callback === "function";
  let validation = callbackIsValid
    ? {
      type: settings.type,
      callback: settings.callback,
      message: settings.message && typeof settings.message === "string" ? settings.message : validations[settings.type].message(),
    }
    : {
      /* empty */
    };

  return validation;
};

// Check Validations

const checkRequiredValidation = (settings, value) => {
  let passed = true;
  passed = passed && value !== null;
  passed = passed && value !== undefined;
  if (typeof value === "string") {
    passed = passed && value !== "";
  } else if (Array.isArray(value)) {
    passed = passed && value.length !== 0;
  }

  return passed;
};

const checkMinLengthValidation = (settings, value) => {
  let passed = true;
  passed = passed && value !== null;
  passed = passed && value !== undefined;
  if (typeof value === "string") {
    passed = value.length >= settings.threshold;
  }

  return passed;
};

const checkMaxLengthValidation = (settings, value) => {
  let passed = true;
  passed = passed && value !== null;
  passed = passed && value !== undefined;
  if (typeof value === "string") {
    passed = value.length <= settings.threshold;
  }

  return passed;
};

const checkNumberValidation = (settings, value) => {
  return !isNaN(value);
};

const checkMinValueValidation = (settings, value) => {
  let passed = true;
  passed = passed && value !== null;
  passed = passed && value !== undefined;
  if (value !== "") {
    value = parseFloat(value);
  }
  if (typeof value === "number") {
    passed = value >= settings.threshold;
  }

  return passed;
};

const checkMaxValueValidation = (settings, value) => {
  let passed = true;
  passed = passed && value !== null;
  passed = passed && value !== undefined;
  if (value !== "") {
    value = parseFloat(value);
  }
  if (typeof value === "number") {
    passed = value <= settings.threshold;
  }

  return passed;
};

// const checkMatchValidation = (settings, value, targetValue) => {
//     let passed = true;
//     passed = passed && (value !== null)
//     passed = passed && (value !== undefined)
//     if (value !== "" ) {
//         value = parseFloat(value);
//     }
//     if (typeof value === "number") {
//         passed = value <= settings.threshold;
//     }

//     return passed;
// }

// const checkDateTimeValidation = (settings) => {

//     let validation = settings.threshold ? {
//         type: settings.type,
//         regEx: patterns[settings.type],
//         message: settings.message ? settings.message : validations[settings.type].message()
//     } : { /** empty */ }

//   return validation;
// }

const checkPatternValidation = (settings, value) => {
  let passed = true;
  if (!settings.disabled) {
    try {
      passed = settings.regEx.test(value);
    }
    catch (e) {
      passed = false;
    }
  }
  return passed;
}

const checkPasswordValidation = (settings, value) => {
  return checkPatternValidation(settings, value);
};

const checkEmailValidation = (settings, value) => {
  return checkPatternValidation(settings, value);
};

const checkUrlValidation = (settings, value) => {
  return checkPatternValidation(settings, value);
};

const checkCustomValidation = (settings, value) => {
  return settings.callback(value);
};

export function getValidation(settings) {
  let validation = {};

  if (settings.type in validations) {
    switch (settings.type) {
      case "number": {
        validation = getNumberValidation(settings);
        break;
      }
      case "match": {
        validation = getMatchValidation(settings);
        break;
      }
      // case "dateTime":
      //     validation = getDateTimeValidation(settings);
      //     break;
      case "pattern": {
        validation = getPatternValidation(settings);
        break;
      }
      case "email": {
        validation = getEmailValidation(settings);
        break;
      }
      case "url": {
        validation = getUrlValidation(settings);
        break;
      }
      case "password": {
        validation = getPasswordValidation(settings);
        break;
      }
      case "custom": {
        validation = getCustomValidation(settings);
        break;
      }
      default: {
        break;
      }
    }
  }

  return validation;
}

export function checkAllValidations(validations, value, fieldType) {
  let message = null;
  let valid = true;
  for (let i = 0; i < validations.length; i++) {
    if (fieldType === 'file') {
      if (value && value.url) {
        if (!checkValidation(validations[i], value.url)) {
          message = validations[i].message;
          valid = false;
          break;
        }
      }
    }
    else if (!checkValidation(validations[i], value)) {
      message = validations[i].message;
      valid = false;
      break;
    }
  }

  return { validationMessage: message, fieldValid: valid };
}

export function checkValidation(settings, value) {
  let passed = true;

  if (settings.type in validations) {
    switch (settings.type) {
      case "required": {
        passed = checkRequiredValidation(settings, value);
        break;
      }
      case "minLength": {
        passed = checkMinLengthValidation(settings, value);
        break;
      }
      case "maxLength": {
        passed = checkMaxLengthValidation(settings, value);
        break;
      }
      case "number": {
        passed = checkNumberValidation(settings, value);
        break;
      }
      case "minValue": {
        passed = checkMinValueValidation(settings, value);
        break;
      }
      case "maxValue": {
        passed = checkMaxValueValidation(settings, value);
        break;
      }
      // case "match":
      // {
      //     passed = checkMatchValidation(settings, value);
      //     break;
      // }
      // case "dateTime":
      //     passed = checkDateTimeValidation(settings);
      //     break;
      case "pattern": {
        passed = checkPatternValidation(settings, value);
        break;
      }
      case "email": {
        passed = checkEmailValidation(settings, value);
        break;
      }
      case "url": {
        passed = checkUrlValidation(settings, value);
        break;
      }
      case "password": {
        passed = checkPasswordValidation(settings, value);
        break;
      }
      case "custom": {
        passed = checkCustomValidation(settings, value);
        break;
      }
      default: {
        break;
      }
    }
  }

  return passed;
}
