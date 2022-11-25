let ServiceLocator = require("../framework/servicelocator");
class ValidationUtils {
    constructor()
    {
    }
    notNull(obj)
    {
        if(obj != null)
        {
            return true;
        }
        
        return false;
    }
    ensureValid(obj, classType)
    { 
        if(this.notNull(obj) && typeof obj=='object' && obj instanceof classType)
        {
            return true;
        }
        
        return false;
    }
    
    ensureContains(obj, ...args)
    {
        let valid = this.notNull(obj);

        args.forEach(f => { valid = valid && (obj && obj.hasOwnProperty(f))});

        return valid;
    }
    getOptional(obj, field)
    {
        if(this.ensureContains(obj, field))
        {
            return obj[field];
        }
        
        return '';
    }
    arrayTest(arr, test) {
        if (!Array.isArray(arr)) return false;
        let i;
        for (i = 0; i < arr.length; i++) { if (!test(arr[i])) break; }
        if (i < arr.length) return false;
        return true;
      }
      
    isObject(obj) { return typeof obj === 'object'; }
      
    isUndefined(obj) { return typeof obj === 'undefined'; }
      
    isString(obj) { return typeof obj === 'string'; }
        
    isNonNegative(n) { return (Number.isInteger(n) && n >= 0); }
      
    isNumeric(n) { return !isNaN(parseFloat(n)) && isFinite(n); }
      
    isHex64String(str) { return (typeof str === 'string' && /^[0-9a-fA-F]{64}$/.test(str)); }
      
    isHexString(str) { return (typeof str === 'string' && !/[^0-9a-fA-F]/.test(str)); }

    isNumericInRange(n, start, end) { return (this.isNumeric(n) && n >= start && n <= end); }
}

const vUtil = new ValidationUtils();
ServiceLocator.register("ValidationUtils", vUtil);
module.exports = vUtil;
