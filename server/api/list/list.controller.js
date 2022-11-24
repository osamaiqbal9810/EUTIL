/**
 * Created by zqureshi on 10/12/2018.
 */
let _ = require("lodash");
let ServiceLocator = require('../../framework/servicelocator');
let ListModel = require("./list.model");

exports.show = function (req, res, next) {

    let listHelper = ServiceLocator.resolve('ListHelper');
    let listName = ''; 
    let timestamp = '';
    let tz=0;
    
    if(req.params && req.params.listName)
    {
        listName = req.params.listName;
        if(req.params.hasOwnProperty('timestamp'))
        {
            timestamp = req.params.timestamp;
        }
        if(req.params.hasOwnProperty('z'))
        {
            tz = req.params.z;
        }
    }
    else
    {
        return res.json('missing parameters(s): listName required');
    }

    ListModel.find({listName : listName}, function(err, listData){
        if (err) return handleError(res, err);
	
//        console.log('List data received:' + listData);
        if(listData.length===0)
        {
            console.log('No such list defined');
            res.status(404);
            return res.json('No such list defined');
        }

        listHelper.getList(listName, timestamp, listData[0].settings, req.user, tz,{success: items=>{
                //console.log(items);
                res.status(200);
                return res.json(items);
        }, fail: err=>{ 
            console.log(err);
            handleError(res, err);
        }});

    });
};
exports.pull =  function (req, res, next)
{
    let listHelper = ServiceLocator.resolve('ListHelper');
    let timestamp = '';
    let tz=0;

    
    //let response=[];
    //response.push({ts: listHelper.reverseTransformTimestamp(new Date())}); // push timestamp as fist element
    let returnObj = {ts: listHelper.reverseTransformTimestamp(new Date()),
                    result: []};
    if(req.params)
    {
        if(req.params.hasOwnProperty('timestamp'))
        {
            timestamp = req.params.timestamp;
        }
        if(req.params.hasOwnProperty('z'))
        {
            tz = req.params.z;
        }
    }

     listHelper.getList('ApplicationLookups', '', '{\"criteria\":{\"listName\": \"AppPullList\"}}', req.user, tz, {success: items=>{
      // console.log(items);
      var itemNo = 0;
        items.forEach(function(item){
                if(item.optParam1.opt1=='ApplicationLookups')
                {
                    listHelper.getDirectList(item.optParam1.opt1, timestamp, item.optParam1.opt2, req.user, tz, {success: items1=>{
                        returnObj.result.push(items1);
                        //items1.forEach(function(item1))
                        itemNo++;
                        if(itemNo === items.length)
                        {
                        res.status(200);
                            return res.json(returnObj);
                        }
                        

                    }, fail: err=>{
                        console.log('failure to get items1');
                    } 
                    });
                }
                else
                {
                        let optParam1=JSON.parse(item.optParam1);
                        listHelper.getList(optParam1.opt1, timestamp, optParam1.opt2, req.user, tz,{success: items1=>{
                        returnObj.result.push(items1);
                        //items1.forEach(function(item1))
                        itemNo++;
                        if(itemNo === items.length)
                        {
                        res.status(200);
                            return res.json(returnObj);
                        }
                        

                    }, fail: err=>{
                        console.log('failure to get items1');
                    } 
                    });
                }


        }
        ); 
      
      
    }, fail: err=>{ 
        console.log(err);
        handleError(res, err);
    }});


}
let summaryModels=[];
summaryModels["Maintenance"]={modelName:'MaintenanceModel', isRemovedCheck: false};
summaryModels["WorkplanTemplate"]={modelName:'WorkPlanTemplateModel', isRemovedCheck: true};
summaryModels["JourneyPlan"]={modelName:'JourneyPlanModel', isRemovedCheck: false};

exports.summary = function(req, res, next)
{
    // let lastMonth = new Date().getTime() -30 * 24 * 60 * 60 * 1000;
    // let listName='Maintenance';
    // let dateCol='createdAt', startDate=new Date(lastMonth), endDate=new Date();
    // let summarizeByCol='status';
    if(req && req.query && req.query.listName && req.query.byCol )
    {
        try
        {
            let listName=req.query.listName;    
            let summarizeByCol = req.query.byCol;
            let dateCol=null, startDate=null, endDate=null;
            if(req.query.dateCol) dateCol = req.query.dateCol;
            if(req.query.startDate) startDate = new Date(req.query.startDate);
            if(req.query.endDate) endDate = new Date(req.query.endDate);

            let sm = summaryModels[listName];
            if(sm)
            {
                let model = ServiceLocator.resolve(sm.modelName);
                let aggregatePipe=[];
                
                // date range //{$match:{createdAt:{$gt: startDate }, createdAt: {$lt: endDate}}}
                if(dateCol && startDate && endDate)
                {
                    let gte={},lte={};
                    gte[dateCol]={$gte: startDate};
                    lte[dateCol]={$lte: endDate};
                    // if(sm.isRemovedCheck)
                    //     aggregatePipe.push({$match:{$and:[{...gte},{...lte}, {isRemoved: false}]}});
                    // else
                    aggregatePipe.push({$match:{$and:[{...gte},{...lte}]}});
                }
                if(sm.isRemovedCheck)
                aggregatePipe.push({$match: {isRemoved: false}});

                // summarizeByCol
                let _id={};
                _id[summarizeByCol]='$'+summarizeByCol;
                aggregatePipe.push({$group:{_id, count: {$sum: 1}}});

                model.aggregate( aggregatePipe,
                function(err, result){
                    if(err)
                    {
                        next(err);
                    }
                    else
                    {
                        res.json(result);
                    }
                });
            }
            else
            {
                res.json(listName, 'model not found');
            }

        }
        catch(err)
        {
            console.log('list.controller.summary.catch',err.toString());
            next(err);
        }
    }
    else
    {
        res.json('required params: listName & byCol');
    }
}
function handleError(res, err) {
    res.status(500);
    return res.send(err);
}