// //During the test the env variable is set to test
// process.env.NODE_ENV = "test";

// let mongoose = require("mongoose");
// //let ApplicationLookups = require("../../../api/ApplicationLookups/ApplicationLookups.model");
// import ApplicationLookupsModelMock from "../../../mocks/api/ApplicationLookups/ApplicationLookupsMock.model";
// let ApplicationLookupsModelMockInstance = new ApplicationLookupsModelMock();
// let ServiceLocator = require("../../../framework/servicelocator");
// import ApplicationLookupsService from "../../../api/ApplicationLookups/ApplicationLookups.service";
// // let getSubdivisionService = require("../../../api/ApplicationLookups/ApplicationLookups.service").getSubdivisionService;

// import "babel-polyfill";
// //Require the dev-dependencies
// let chai = require("chai");
// let chaiHttp = require("chai-http");
// //let app = require("../../../app");
// let should = chai.should();

// const assert = require("chai").assert;

// chai.use(chaiHttp);
// //Our parent block
// describe("-ApplicationLookups-", () => {
//   // beforeEach(done => {
//   //   //Before each test we empty the database
//   //   ApplicationLookups.remove({}, err => {
//   //     done();
//   //   });
//   // });
//   /*
//    * Test the /GET route
//    */
//   // describe("/GET ApplicationLookups Execution", () => {
//   //   it("it should Deny Acess to UnAuthorized User In applicationlookups", done => {
//   //     chai
//   //       .request(app)
//   //       .get("/api/applicationlookups")
//   //       .end((err, res) => {
//   //         res.should.have.status(401);
//   //         done();
//   //       });
//   //   });
//   // });

//   describe("Applicationlookups Service", () => {
//     let data = [
//       { tenantId: "ps19", listName: "Subdivision", code: "sub-01", description: "Baltimore Subdivision" },
//       { tenantId: "ps19", listName: "Subdivision", code: "sub-03", description: "Cumberland Subdivision" },
//       { tenantId: "ps19", listName: "Subdivision", code: "sub-02", description: "Albany Subdivision" },
//     ];
//     it("it should get all subdivisions on getSubdivisionService()", async () => {
//       let user = { subdivision: "All" };
//       let listName = "Subdivision";
//       ApplicationLookupsModelMockInstance.setData(data);
//       ServiceLocator.register("ApplicationLookupsModel", ApplicationLookupsModelMockInstance);
//       let applicationLookupsService = new ApplicationLookupsService();
//       let result = await applicationLookupsService.getSubdivisionService(user, listName);
//       let correctResult = data;
//       assert.equal(result.value, correctResult);
//     });
//     it("it should get single subdivisions on getSubdivisionService()", async () => {
//       let user = { subdivision: "Baltimore Subdivision" };
//       let listName = "Subdivision";
//       ApplicationLookupsModelMockInstance.setData(data);
//       ServiceLocator.register("ApplicationLookupsModel", ApplicationLookupsModelMockInstance);
//       let applicationLookupsService = new ApplicationLookupsService();
//       let result = await applicationLookupsService.getSubdivisionService(user, listName);
//       let correctResult = data;
//       assert.equal(result.value, correctResult);
//     });
//   });
// });
