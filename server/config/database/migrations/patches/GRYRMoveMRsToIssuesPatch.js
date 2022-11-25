import JourneyPlanModel from "../../../../timps/api/journeyPlan/journeyPlan.model";
import MaintenanceModel from "../../../../api/Maintenance/Maintenance.model";
module.exports = {
  async apply() {
    console.log("Running Patch to move work orders back to issues GRYR only");
    const MRList = ["MR#0037","MR#0034","MR#0033","MR#0032","MR#0031","MR#0030","MR#0029","MR#0028","MR#0027","MR#0026","MR#0025","MR#0024","MR#0022","MR#0021","MR#0017"];
    let JpList = await JourneyPlanModel.find({"tasks.issues.mrNumber":{$in: MRList}});
    for(let jp of JpList) {
       let modified = false;
        if(jp && jp.tasks && jp.tasks.length) {
            for(let task of jp.tasks) {
                if(task && task.issues && task.issues.length) {
                    for(let issue of task.issues) {
                        if(issue.mrNumber && MRList.includes(issue.mrNumber)) {
                            delete issue.mrNumber;
                            delete issue.maintenanceId;
                            delete issue.serverObject;
                            issue.status="";
                            modified = true;
                        }
                    }
                }
            }
        }
        if(modified) {
            jp.markModified('tasks');
            await jp.save();
        }
    }
    await MaintenanceModel.deleteMany({mrNumber:{$in:MRList}});
    
  },
};
