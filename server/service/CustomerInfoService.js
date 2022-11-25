let ServiceLocator = require("../framework/servicelocator");

export default class CustomerInfoService {
  constructor() {
    this.customerInfoFetched = false;
    this.customerData = null;
    this.customerName = "";
    this.applicationType = "";
  }

  async fetchCustomerInfo() {
    try {
      let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
      let dbCustomerData = await ApplicationLookupsModel.findOne({ listName: "Customer", code: "Customer-00" });

      if (dbCustomerData) {
        if (dbCustomerData.opt1) {
          this.customerName = dbCustomerData.opt1.name;
          this.applicationType = dbCustomerData.opt1.applicationType;

          //     if(dbCustomerData.opt1.appearance)
          //     {
          //         appearance.displayName           = dbCustomerData.opt1.appearance.displayName ?  dbCustomerData.opt1.appearance.displayName : "";
          //         appearance.logo1                 = dbCustomerData.opt1.appearance.logo1       ?  dbCustomerData.opt1.appearance.logo1       : "";
          //         appearance.logo2                 = dbCustomerData.opt1.appearance.logo2       ?  dbCustomerData.opt1.appearance.logo2       : "";
          //     }
          // }
          // if(dbCustomerData.opt2)
          // {
          //     featuresetList                   = dbCustomerData.opt2;
        } else {
          console.log("DB Customer Data not found...", dbCustomerData);
        }

        this.customerInfoFetched = true;
        this.customerData = dbCustomerData;
      }
    } catch (err) {
      console.log("CustomerInfo.fetch.catch:", err);
    }
  }
  async checkFetched() {
    if (!this.customerData) await this.fetchCustomerInfo();
  }
  async getCustomerData() {
    await this.checkFetched();
    return this.customerData;
  }
  async getCustomerName() {
    await this.checkFetched();
    return this.customerName;
  }
  async getApplicationType() {
    await this.checkFetched();
    return this.applicationType;
  }
}
