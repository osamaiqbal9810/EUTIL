import ApplicationLookupsModel from "../../../../api/ApplicationLookups/ApplicationLookups.model";
let ServiceLocator = require("../../../../framework/servicelocator");

module.exports = {
  async apply() {
    console.log("Patch: Instill Customer Data in Database Patch");
    
    let dbCustomerData = await ApplicationLookupsModel.findOne({listName:"Customer", code:"Customer-00"});

    if(!dbCustomerData)
    {
        let versionCompatibility = ServiceLocator.resolve('VersionCompatibilityService')
        let customerData = versionCompatibility.loadCustomerDataFile();
        let reportsSubset = ['Line Inspection Report','Switch Report', 'Track Disturbance Report', 'Detailed Switch Inspection'];

        if(!customerData)
        {
            console.log('Customer data file empty or not available.');
            throw {name:'No Customer File', message:'Error: customer data file not found or empty.'};    
        }
        let logo1='default', logo2='default';
        if(customerData.customerName==='Iron Ore Canada')
        {
            logo1='qnsl';
            logo2='ioc';
            reportsSubset = ['Line Inspection Report', 'Track Disturbance Report', 'Detailed Switch Inspection'];
        }
        else if(customerData.customerName==='Finger Lakes' || customerData.customerName==='FingerLakes')
        {
            logo1='fingerlakes';
            logo2='';
            reportsSubset = ['Line Inspection Report','Switch Report', 'Track Disturbance Report'];
        }
        
        let appearanceData={
            displayName:customerData.customerName,
            logo1:logo1,
            logo2:logo2,
            };
          
        
        let item = new ApplicationLookupsModel();
        item.listName = 'Customer';
        item.code = 'Customer-00';
        item.opt1={
            name: customerData.customerName,
            applicationType: customerData.applicationType,
            compatibleMobileApps: [3.83],
            bypassVersionCheck: false,
            appearance: appearanceData
        };
        // use opt2 as Feature set list
        item.opt2 = [{id:'timpsReports', subset:reportsSubset}];
        
        await item.save();
    }
    else
    {
        console.log('Customer data already exist in the database. Cannot overwrite the customer data.');
        throw {name:'Cannot Overwrite', message:'Error: customer data already exist'};
    }
    
  },
};
