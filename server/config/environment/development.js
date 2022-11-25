"use strict";

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options

  mongo: {
    //uri: "mongodb://iahmed:27017/pms",
    //uri: "mongodb://localhost:27017/RT3",//mine
    //uri: "mongodb://localhost:27017/local",
    //uri: "mongodb://localhost:27017/timpsv2",
    //uri: "mongodb://172.19.91.137:27017/LAMP-v1",
    //uri: "mongodb://admin:welcome1@ds233763.mlab.com:33763/this",
    //uri: "mongodb://172.19.91.137:27017/LAMP-v1",
    //uri: "mongodb://172.19.91.147:27017/timpsv2",//imran
    //uri: "mongodb://localhost:27017/fingerlake20200417",//mine
    // uri: "mongodb://localhost:27017/FLProdAug10",//mine
    uri: "mongodb://localhost:27017/2022-06-29-sfrtasite", //mine
    //uri: "mongodb://172.19.91.120:27017/FLProdAug10",//KT //FerromexTimpsDev20200908
    //uri: "mongodb://localhost:27017/FerromexTimpsDev20200908" // test backend stuck issue
    //uri: "mongodb://localhost:27017/RioTinto-20200921", // Rio-Tinto from Tatheer sb
    //uri: "mongodb://localhost:27017/this", // build TXNW railroad
    //uri: "mongodb://localhost:27017/20201001IOC", // IOC from ioc tektracking server
    //uri: "mongodb://localhost:27017/beltrailwayChicago-20201001", // build Chicago Belt railway railroad
    //uri: "mongodb://localhost:27017/20201029-IOC", // IOC from ioc tektracking server
    // uri: "mongodb://localhost:27017/20201119-Fingerlakes", // brought Fingerlakes db to correct things
  },

  seedDB: true,
  defaultData: {
    tenant: {
      id: "ps19",
      desc: "Powersoft19",
      name: "Powersoft19 Rail Group",
    },
    email: "admin@timps.com",
    pass: "admin",
    adminGroup: { id: "admin", desc: "Administrator" },
  },
  createNewDatabase: false,
  newDatabaseAppName: "",
  applicationType: "TIMPS",
  updateDatabaseForApplicationType: true, // applicationType is only effective with this being true
  updateApplicationLookups: false,
  updateOldDatabase: false, //
  updateConfigurations: false,
  addConfigurations: false,
  addIOCaplphanumericMarkersList: false,
  runRangeOptimizationJPlansAndTemplates: false,
};
