export default class ValidationUtils {
    //SODObj.hasOwnProperty('employee')
    //if (typeof target == "object" && typeof source == "object" && !(source instanceof Array) ) {
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



}

