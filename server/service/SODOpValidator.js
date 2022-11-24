let ServiceLocator = require('../framework/servicelocator');

// dependsOn: 
export default class SODOPValidator {
    constructor()
    {

    }
    async validatemsgListRequest(reqObj, user)
    {
        let result = { valid: true };
        let SODObj={};
        if(reqObj && reqObj.hasOwnProperty('optParam1'))
        {
            SODObj = reqObj.optParam1;
        }
        else
        {
            return result;
        }

        // Validate creation of new SOD
        if(reqObj.code==null || reqObj.code=='')
        {
            if(SODObj.hasOwnProperty('day') && SODObj.hasOwnProperty('employee'))
            {
                let employee = SODObj.employee;
                let day = SODObj.day;
                let SODModel = ServiceLocator.resolve('SODModel');
                let duplicateCheck=false;
                let prevCheck=false;
                let proposedSODDay = day;

                // Case: Dis-allow creation of SOD with existing (day & employee)   
                let count = await SODModel.find({ employee: employee, day: day })
                                            .limit(1)
                                            .countDocuments()
                                            .exec();
                if(count > 0)
                {
                    console.log('ValidateSOD: Duplicate SOD request exists:' + count + ' ignoring for: '+ employee +', '+day);
                }
                else
                {
                    duplicateCheck = true;
                }
            
                // Case: Do not create new SOD if previous SOD is not finished
                let prevSOD = await SODModel.findOne({employee: employee})
                                            .sort({day:-1})
                                            .exec();
                
                if(prevSOD==null || (prevSOD != null && prevSOD.end != null))
                {
                    prevCheck = true;
                }

                result.valid = duplicateCheck && prevCheck;

                // Case: if a work plan exist for a day between previous SOD and current day-
                //       -then create SOD for the day with previous work plan
                
                // check only if we are creating a new SOD in result of all previous checks to be valid
                if(result.valid)
                {
                    let jpModel = ServiceLocator.resolve('JourneyPlanModel');

                    // Get previous 'Journey plan's till previous SOD or from beginning
                    let prevDate = new Date(0); // start from the creation of world

                    if(prevSOD)
                    {
                        prevDate = new Date(prevSOD.day);
                    }

                    let jps = await jpModel.find({'user.id': user._id, date:{$gt: prevDate, $lt: day}});
                    
                    if(jps.length) // if there are JourneyPlans then see if they have pending tasks
                    {
                        for(let i=0; i< jps.length; ++i)
                        {
                            let jp = jps[i];
                            let br = false;

                            if(jp.tasks && jp.tasks.length)
                            {
                                for(let j=0; j<jp.tasks.length; ++j)
                                {
                                    if(!jp.tasks[j].status || (jp.tasks[j].status && jp.tasks[j].status != 'Finished'))
                                    {
                                        proposedSODDay = jp.date; // Todo: jp is created by WebUI their Tz may not match the App Tz so day can go bad
                                        br = true;
                                        break;
                                    }
                                }
                                if(br)
                                {
                                    break;
                                }
                            }
                        }
                    }



                }

                if(proposedSODDay != day) // if another day was proposed send the other one
                {
                    // clone SODObj
                    let newSOD = JSON.parse(JSON.stringify(SODObj));

                    newSOD.day = proposedSODDay;
                    reqObj.optParam1 = newSOD;
                    result.newObj = reqObj;
                }
            }
        }
       

        return result;
    }

}
