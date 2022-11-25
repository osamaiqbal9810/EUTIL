let ServiceLocator = require("../../framework/servicelocator");

export const VALIDATION_TYPES={
        VALIDATE_VALUE_NOT_EXIST: {func:()=>{}, description: "Checks that the value does not exist in given collections", failureMessage:""},
        VALIDATE_FILED_MUST_EXIST: {func:()=>{}, description:"Validate that a field from a collection must exist in other collection", failureMessage:""}
        };

export default class DataValidationService{
    constructor()
    {
        // register functions for validation types
        VALIDATION_TYPES.VALIDATE_VALUE_NOT_EXIST.func=this.validateValueNotExistsP.bind(this);
        VALIDATION_TYPES.VALIDATE_FILED_MUST_EXIST.func=this.validateRecordMustExistInOtherCollectionP.bind(this);
        
        this.validateValueNotExists = this.validateValueNotExists.bind(this);
        this.validateRecordMustExistInOtherCollection = this.validateRecordMustExistInOtherCollection.bind(this);
    }
    /**
        validates that collection->document's fields not exist in any of the intoCollections[]'s intoFields[]
        
        returns {result: true, existsInto: [{collection1, id1},{collection2, id2}...]} if the source(i.e. model, object, fields)  doesn't exist in any of the intoCollections[]'s intoFields[]
        
        otherwise return {false};
     */
    validateCollectionDocNotExists(collection, documentId, fieldNames, intoCollections, intoFields)
    {}
    
    //
    /** validate that provided filedValues[] does not exist in the provided any of the intoModel */
    // sample call: validateValueNotExists(asset._id, [{collection:"WorkplanTemplate", fields:["inspectionAssets","taks.units.id"]}, {collection: "JourneyPlan", fields: ["tasks.issues.units.id"]}, 
    //  {collection: "maintenances",fields: ["asset.id"]}]);
    async validateValueNotExists(value, intoCollectionFields)
    {
        let result = {valid: false, details:[]}, totalCount=0;
        
        //console.log("value:", value);
        //console.log("into:", intoCollectionFields);
        
        if(!value || !intoCollectionFields)
        {
            // invalid parameter
            console.log('Parameters missing: value, params');

            return result;
        }

        let queries = intoCollectionFields.map((lcf)=>{   
            let fieldsCondition = [];
            lcf.fields.forEach((f)=>{fieldsCondition.push(JSON.parse(`{"${f}":"${value}"}`));});

            return {collectionName:lcf.collection, model: lcf.collection+"Model", query:{$or: fieldsCondition}};
            });
        
       // console.log(JSON.stringify(queries));
        result.valid = true;
        for(let query of queries)
        {
            let model = ServiceLocator.resolve(query.model);
            
            if(!model)
            {
                // TODO: log error
                console.log('DataValidationService.validateValueNotExists.Error: Invalid model name:', query.model);
            }
            else
            {
                result.valid = result.valid && true;

                let count = await model.countDocuments(query.query);
                //console.log('model:', query.model, ', query:', JSON.stringify(query.query), ', result:', count);

                if(count>0)
                {
                    //console.log('value found:', value,'into');
                    result.valid=false;
                    result.details.push({value: value, model: query.collectionName, count: count});
                }
            }
        }
    
    return result;
    }
    async validateValueNotExistsP(params)
    {
        if(!params.hasOwnProperty("value") || !params.hasOwnProperty("into"))
        {
            // todo: log or throw
            return {valid: false, details:["missing params"]};
        }
        let value=params["value"], into=params["into"];
        
        //console.log('Params:', JSON.stringify(params, null, 4));

        return await this.validateValueNotExists(value, into);
    }
    //{type: VALIDATION_TYPES.VALIDATE_FIND_CROSS_COLLECTION_VALUE, params:{id: asset.parentAsset, field:'assetType', sourceModel:'Assets', findInModel:'AssetTypes', findField:'assetType', additionalCriteria:{plannable:true, location:true}}}}
    /** 
     * id:      Id field of a collection to find a matching record
     * field:   Field to find the value in other collection
     * model:   Model where the above mentioned matching field should be fetched
     * findIn:  {collection:
     *                     collection name where the a record will be matched
                 field: field to compare in the collection
                 assitonalCriteria: {} additional criteria to match}
     * 
     * check the count of end result, the count must be greater than 0
     */
    async validateRecordMustExistInOtherCollection(id, field, sourceModel, findInModel, findField, additionalCriteria)
    {
        let result = {valid: false, details:[]};
        try{
        let matchingModelName   = sourceModel + "Model",
            matchingCriteria    = JSON.parse(`{"_id":"${id}"}`),
            matchingProjection  = JSON.parse(`{"${field}":"1"}`),
            findModelName       = findInModel + "Model",
            findingCriteria     = additionalCriteria,
            matchingModel       = ServiceLocator.resolve(matchingModelName),
            findingModel        = ServiceLocator.resolve(findModelName),
            sourceField         = await matchingModel.findOne(matchingCriteria, matchingProjection);
            
            //console.log('sourceFiled: ', JSON.stringify( sourceField,null, 4));
            sourceField     = sourceField[field];
            findingCriteria = Object.assign(findingCriteria, JSON.parse(`{"${findField}":"${sourceField}"}`));
            //console.log('findingCriteria', JSON.stringify( findingCriteria, null, 4));

            let count       = await findingModel.countDocuments(findingCriteria);
            result.valid    = count>0;
            
            //console.log('ValidationRecordMustExist.result:', result.valid, count);
            }
            catch(err)
            {
                console.log('assets.service.validateRecordMustExistInOtherCollection.catch:', err);
            }

            return result;
    }
    async validateRecordMustExistInOtherCollectionP(params)
    {
        let paramsList=["id", "field", "sourceModel", "findInModel", "findField", "additionalCriteria"], paramsToPass=[];
        for(let p of paramsList)
        {
            if(!params.hasOwnProperty(p))
            {
            // todo: log or throw
            console.log(`Param ${p} does not exist`);
            console.log('validateRecordMustExistInOtherCollectionP.error: params missing', JSON.stringify( params, null, 4));
            return {valid: false, details:["missing params"]};
            }
            
            paramsToPass.push(params[p]);
        }
        
        //console.log("paramsToPass", ...paramsToPass);
        return await this.validateRecordMustExistInOtherCollection(...paramsToPass);
    }



    async validate(validations)
    {
       // console.log('Running validations:');
       // console.log(JSON.stringify(validations, null, 4));

        let vr={valid: false, details:[]};
        for (let validation of validations)
        {
            //console.log('Required Val:', JSON.stringify(validation, null, 4));
            //console.log('VALIDATION_TYPES:', JSON.stringify(VALIDATION_TYPES, null, 4));

            if(validation.type)
            {
                let v=validation.type, params=validation.params;
                vr = await v.func(params);

                if(!vr.valid)
                    return vr;
            }
            else
            {
                // log or display invalid validation type
                console.log("Validation type not exist:", validation.type);
            }
        }
        return vr;
    }
};