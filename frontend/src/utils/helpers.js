import {languageService} from "../Language/language.service";

export const processFromFields = formData => {
    let dataToSubmit = {};
    for (let key in formData){
        if (!formData[key].hide) {
            if (formData[key].element === 'multiSelect' && formData[key].value !== 'string') {
                if (formData[key].value) {
                    dataToSubmit[key] = Array.isArray(formData[key].value) ? formData[key].value.map(v => v.value) : formData[key].value;
                } else {
                    dataToSubmit[key] = '';
                }

            } else {
                dataToSubmit[key] = formData[key].value;
            }

            let error = validate(formData[key], formData);
            formData[key].valid = error[0];
            formData[key].validationMessage = error[1];
        }
    }

    return dataToSubmit;
};

export const calculateAlertTime = (date, timeDifference, unitOfTime, event) => {
    let alertTime = '';
    if (event === "before") {
        alertTime = date.subtract(timeDifference, unitOfTime);
    } else {
        alertTime = date.add(timeDifference, unitOfTime);
    }

    return alertTime;
};

export const checkFormIsValid = formData => {
    let formIsValid = true;
    for(let key in formData) {
        if (!formData[key].hide)
            formIsValid = formData[key].valid && formIsValid;
    }

    return formIsValid;
};

export const touchInvalids = formData => {

    for(let key in formData) {
        formData[key].touched = !formData[key].valid;
    }
};
export const doBasicValidation = (element, formData, error=[true, ""])=>{
  if (element.validation.required) {

      if (Array.isArray(element.value)) {
          const valid = element.value.length > 0;

          const message = `${!valid ? languageService("This field is required") : ""}`;

          error = !valid ? [valid, message] : error;
      } else {
          const valid = typeof element.value==='string' ? element.value.trim() !== "": element.value===undefined ? false: true;

          const message = `${!valid ? languageService("This field is required") : ""}`;

          error = !valid ? [valid, message] : error;
      }
    }

    return error;
};
export const validate = (element, formData)=>{
    let error = [true, ""];

    error = doBasicValidation(element, formData, error);

    if (!element.value && !element.validation.required) {
      return error;
    }

    if (element.validation.minLen) {
      const valid = element.value.length >= element.validation.minLen;
      const message = `${!valid ? languageService('Length must be greater than or equal to')+" " + element.validation.minLen + languageService('characters') : ""}`;

      error = !valid ? [valid, message] : error;
    }

    if (element.validation.maxLen) {
      const valid = element.value.length <= element.validation.maxLen;
      const message = `${!valid ? languageService("Length must be less than or equal to")+ " " + element.validation.maxLen + languageService('characters') : ""}`;

      error = !valid ? [valid, message] : error;
    }

    if (element.validation.min || element.validation.min === 0) {
      const valid = parseFloat(element.value) >= element.validation.min;
      const message = (element.validation.min !== element.validation.max) ?
                       `${!valid ? languageService('Must be greater than or equal to') +" " + element.validation.min : ""}`
                      :`${!valid ? languageService('Must be equal to') +" " + element.validation.min : ""}`;

      error = !valid ? [valid, message] : error;
    }

    if (element.validation.max) {
      const valid = parseFloat(element.value) <= element.validation.max;
      const message = (element.validation.max !== element.validation.min) ?
                      `${!valid ? languageService('Must be less than or equal to')+" " + element.validation.max : ""}`
                     :`${!valid ? languageService('Must be equal to')+" " + element.validation.max : ""}`;

      error = !valid ? [valid, message] : error;
    }

    if (element.validation.match) {
      let compareVar = formData[element.validation.matchField];
      const valid = element.value === compareVar.value;
      const message = `${!valid ? `${element.validation.matchField}  ${languageService("doesn't match, please verify")}` : ""}`;

      error = !valid ? [valid, message] : error;
    }

    if (error[0] && element.validation.phoneNumber) {
      // let reg = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        //Remove unnecessory escape charactors
      let reg = new RegExp(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im);
      const valid = reg.test(element.value);
      const message = `${!valid ? languageService('Number is not valid') : ""}`;

      error = !valid ? [valid, message] : error;
    }

    if (error[0] && element.validation.email) {
        const valid = validateEmail(element.value);
        const message = `${!valid ? languageService('Email is not valid') : ""}`;

        error = !valid ? [valid, message] : error;
    }

    return error;
  };

const validateEmail = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};


export const groupByKey = (objArray, keyForGrouping) => {
    let resultArray = {};

    objArray.forEach(obj => {
        if (obj[keyForGrouping] in resultArray) {
            resultArray[obj[keyForGrouping]].push(obj)
        } else {
            resultArray[obj[keyForGrouping]] = [obj];
        }
    });

    return resultArray;
}
