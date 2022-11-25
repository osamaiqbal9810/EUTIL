var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
process.env.NODE_ENV = process.env.NODE_ENV || "development";
let config = require("./config/environment/index");
let mongoose = require("mongoose");
var cors = require("cors");
let bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var routes = require("./routes/routes");
var rfs = require("rotating-file-stream");
let fs = require("fs");
let EmailService = require("./service/EmailService");
const schedule = require("node-schedule");

try {
  require("fs").mkdirSync("./log");
} catch (e) {
  if (e.code != "EEXIST") {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}

var log4js = require("log4js");
log4js.configure("./config/log4js.json");
var startupLogger = log4js.getLogger("startup");

startupLogger.info("Starting up...");

let ServiceLocator = require("./framework/servicelocator");
import ListHelper from "./utilities/ListHelper";
//import ThumbnailHelper from "./utilities/thumbnailHelper";
import DOValidator from "./service/DataOpValidationService";
import SODvalidator from "./service/SODOpValidator";

// API SERVICES
import ApplicationLookupsService from "./api/ApplicationLookups/ApplicationLookups.service";
import PermissionService from "./api/permission/permission.service";
import UserGroupService from "./api/userGroup/userGroup.service";

import DOEventService from "./service/DataOpEventService";
import DataOperationsLogic from "./service/DataOperationsLogic";
import VersionCompatibility from "./service/VersionCompatibility";

import AssetsService from "./api/assets/assets.service";
import AssetsTypeService from "./api/assetTypes/assetTypes.service";
import RunService from "./api/run/run.service";
import DashboardService from "./api/dashboard/dashboard.service";

import AssetsTreeService from "./api/assetsTree/assetsTreeService";
import WorkOrderService from "./api/workOrder/WorkOrder.service";
import LocationService from "./api/Location/location.service";
import TimezoneMethodService from "./service/timeZoneMethodService";

import { server } from "./bin/www";

// Import Timps
import { timpsApp, timpsStatus } from "./timps/timps";
import DatabaseSerivce from "./service/DBService";
import AppAccessService from "./service/AppAccessClass";
import RemedialActionListHook from "./api/ApplicationLookups/RemedialActionListHook";
import SchedulerService from "./service/SchedulerService";
import AlertService from "./api/Alert/Alert.service";
import NotificationService from "./api/Notification/Notification.service";
import VersionService from "./api/version/version.service";

import AssetTestsService from "./api/AssetTests/assetTests.service";
import { TestScheduleObserverService } from "./service/TestScheduleObesrvingService";

import Logger from "./service/logger";
let customLogger = new Logger({ filename: "./log/test.log", display: ["ERROR"] });
ServiceLocator.register("CustomLogger", customLogger);

//Utils
//import { permChecker } from "./utilities/permCheck";
ServiceLocator.register("logger", log4js.getLogger("System"));

process.on("unhandledRejection", (reason, p) => {
  console.log("System-wide unhandled rejection handler: promise:", p, "reason:", reason);
  let logger = ServiceLocator.resolve("logger");
  logger.error("System-wide unhandled rejection handler: promise:" + p + " reason:" + reason);
});
process.on("uncaughtException", (err, origin) => {
  console.log("System-wide uncaugth exception handler: err:", err, " origin:", origin);
  let logger = ServiceLocator.resolve("logger");
  logger.error("System-wide uncaugth exception handler: err:" + err + " origin:" + origin);
});
process.on("warning", (warning) => {
  console.log("System-wide uncaugth warning handler: name:", warning.name, "message:", warning.message); //, 'stack:', warning.stack);
  let logger = ServiceLocator.resolve("logger");
  logger.error("System-wide uncaugth warning handler: name:" + warning.name + " message:" + warning.message + " stack:" + warning.stack);
});

let listHelper = new ListHelper(log4js.getLogger("ListHelper"));
ServiceLocator.register("ListHelper", listHelper);

let emailService = new EmailService(log4js.getLogger("EmailService"));
ServiceLocator.register("EmailService", emailService);
// Logger Not passing correctly to the Class. Server  Crashed on Creating Issue

// let thumbnailHelper = new ThumbnailHelper(log4js.getLogger("ThumbnailHelper"));
// ServiceLocator.register("ThumbnailHelper", thumbnailHelper);

let doValidator = new DOValidator(log4js.getLogger("DOValidator"));
ServiceLocator.register("DataOpValidationService", doValidator);

let sodvalidator = new SODvalidator();
ServiceLocator.register("SODOpValidator", sodvalidator);

let doeventservice = new DOEventService();
ServiceLocator.register("DataOpEventService", doeventservice);

let doperationslogic = new DataOperationsLogic(log4js.getLogger("DataOperationsLogic"));
ServiceLocator.register("DataOperationsLogic", doperationslogic);

let versionCompatibility = new VersionCompatibility(log4js.getLogger("VersionCompatibility"));
ServiceLocator.register("VersionCompatibilityService", versionCompatibility);

//var io = require('socket.io').listen(server);
//var socketIOService = new SocketIOService(io);
//ServiceLocator.register('SocketIOService', socketIOService);

// API SERVICES REGISTERING
let applicationLookupsService = new ApplicationLookupsService();
ServiceLocator.register("ApplicationLookupsService", applicationLookupsService);
let alertService = new AlertService();
ServiceLocator.register("AlertService", alertService);
let notificationService = new NotificationService();
ServiceLocator.register("NotificationService", notificationService);
let permissionService = new PermissionService();
ServiceLocator.register("PermissionService", permissionService);
let userGroupService = new UserGroupService();
ServiceLocator.register("UserGroupService", userGroupService);
let assetsService = new AssetsService();
ServiceLocator.register("AssetsService", assetsService);
let assetsTypeService = new AssetsTypeService();
ServiceLocator.register("AssetsTypeService", assetsTypeService);
//ServiceLocator.register("permissionChecker", permChecker);
let runService = new RunService();
ServiceLocator.register("LineRunService", runService);
let dashboardService = new DashboardService();
ServiceLocator.register("DashboardService", dashboardService);
//dashboardService.get_dashboardData({}, {});
// dashboardService.fillDetailArray();
let assetsTreeService = new AssetsTreeService();
ServiceLocator.register("AssetsTreeService", assetsTreeService);

let ws = new WorkOrderService();
ServiceLocator.register("WorkOrderService", ws);

let locationService = new LocationService();
ServiceLocator.register("LocationService", locationService);

let databaseSerivce = new DatabaseSerivce(log4js.getLogger("DBService"));
ServiceLocator.register("DBService", databaseSerivce);

let appAccessService = new AppAccessService();
ServiceLocator.register("AppAccessService", appAccessService);

let rhook = new RemedialActionListHook();
ServiceLocator.register("RemedialActionListHook", rhook);

let scheduleService = new SchedulerService();
ServiceLocator.register("scheduleService", scheduleService);

let timezoneMethodService = new TimezoneMethodService();
ServiceLocator.register("timezoneMethodService", timezoneMethodService);

let versionService = new VersionService(log4js.getLogger("VersionService"));
ServiceLocator.register("VersionService", versionService);

let assetTestsService = new AssetTestsService();
ServiceLocator.register("AssetTestsService", assetTestsService);

let testScheduleObserverService = new TestScheduleObserverService();
testScheduleObserverService.initialize();
ServiceLocator.register("TestScheduleObserverService", testScheduleObserverService);

let mongoURL = "mongodb+srv://osamaiqbal:Powersoft19@eutilitycluster.obaziv6.mongodb.net/?retryWrites=true&w=majority"; // default mongo db url
let mongoURLSource = "default",
  databaseNameSource = "default";

// if environment has databse url and port then make a new url
if (process.env.DB_URL && process.env.DB_PORT) {
  mongoURL = "mongodb://" + process.env.DB_URL + ":" + process.env.DB_PORT + "/";
  mongoURLSource = "environment";
}
// use database from environment if available
if (process.env.DB_NAME) {
  mongoURL = mongoURL + process.env.DB_NAME;
  config.mongo.uri = mongoURL;
  databaseNameSource = "environment";
}

// if customer data file contains information, it would override other sources
// let customerData = versionCompatibility.loadCustomerDataFile();
// if (customerData && (customerData.DB_NAME || customerData.DB_URL || customerData.DB_PORT)) {
//   if (customerData.DB_URL && customerData.DB_PORT) {
//     mongoURL = "mongodb://" + customerData.DB_URL + ":" + customerData.DB_PORT + "/";
//     mongoURLSource = "customer data file";
//   }

//   if (customerData.DB_NAME) {
//     mongoURL = mongoURL + customerData.DB_NAME;
//     databaseNameSource = "customer data file";
//   }

//   config.mongo.uri = mongoURL;
// }
mongoURL = "mongodb+srv://osamaiqbal:Powersoft19@eutilitycluster.obaziv6.mongodb.net/?retryWrites=true&w=majority"; // default mongo db url
config.mongo.uri = mongoURL;
let infoBreakdown = config.mongo.uri.split("/");
console.log("Database URL Source:", mongoURLSource);
console.log("Database Name Source:", databaseNameSource);
console.log("Database name:", infoBreakdown[infoBreakdown.length - 1]);

mongoose.connect(config.mongo.uri, { useNewUrlParser: true, useFindAndModify: false,useUnifiedTopology: true  }, async (e) => {
  if (!e) {
    console.log("Database Connected!");
    startupLogger.info("Database Connected!");

    // let isDatabaseValid = await versionCompatibility.validateDatabase();
    // if (!isDatabaseValid) {
    //   console.log("Database validation error. Cannot continue.");
    //   startupLogger.error("Database validation error. Aborting...");
    //   process.exit();
    // } else {
    //   console.log("Database validation successful:");
    // }
  } else {
    console.log("Error connecting database");
    console.log(e);

    startupLogger.error("Error connecting database");
    startupLogger.error(e);
  }
  let utils = ServiceLocator.resolve("utils");
  mongoose.connection.on("error", utils.handleMongoDbError);
});
var app = express();

var accessLogStream = rfs("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cors());
app.use(logger("combined", { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));
let utils = ServiceLocator.resolve("utils");
utils.ensureFolderExists(config.giTestForms);
app.use("/thumbnails", express.static(config.uploadPath)); //thumbnailsPath)); // use actual images instead of thumbnails because thumbnail generation is wrecked.
app.use("/applicationresources", express.static(config.uploadPath));
app.use("/audio", express.static(config.audioPath));
app.use("/assetImages", express.static(config.assetImages));
app.use("/assetDocuments", express.static(config.assetDocuments));
app.use("/giTestForms", express.static(config.giTestForms));

require("./routes/routes")(app);
// TIMP INITIALIZATION
if (timpsStatus) {
  timpsApp(log4js);
  require("./timps/timps.route.js")();
  console.log("Timps : On");
} else {
  console.log("Timps : Off");
}
console.log("Environment : " + process.env.NODE_ENV);
//console.log("Thread Pool Size:", process.env.UV_THREADPOOL_SIZE);
// Lamp Initialization
require("./lamp/lamp.route.js")();

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

// serve frontend through this server
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
///////////////////////////////////////

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

if (!fs.existsSync(config.uploads)) {
  fs.mkdirSync(config.uploads);
}
if (!fs.existsSync(config.uploadPath)) {
  fs.mkdirSync(config.uploadPath);
}
if (!fs.existsSync(config.thumbnailsPath)) {
  fs.mkdirSync(config.thumbnailsPath);
}
if (!fs.existsSync(config.audioPath)) {
  fs.mkdirSync(config.audioPath);
}
if (!fs.existsSync(config.assetImages)) {
  fs.mkdirSync(config.assetImages);
}
if (!fs.existsSync(config.assetDocuments)) {
  fs.mkdirSync(config.assetDocuments);
}

if (config.seedDB) {
  // let seed = require("./config/seed");
  let database = require("./config/database/database");

  database.createDatabase();

  console.log("Seed has been executed");
  startupLogger.info("Seed has been executed");
} else {
  console.log("Seed disabled");
  startupLogger.info("Seed disabled");
}

let migrations = ServiceLocator.resolve("MigrationsService");
if (migrations) {
  migrations.performStatusChecks();
}

/**
 * Run Alerts cronJobs
 */
// let alertService = ServiceLocator.resolve('AlertService');
alertService.startAlertsMonitoring();

/**
 * CronJob for notification service
 */

schedule.scheduleJob("NotificationCronJob", "*/1 * * * *", async (fireDate) => {
  // Cron job logic for notification service.
  // console.log("Cron job of notification service called: " + fireDate);
  notificationService.sendNewNotifications();
});

// For testing recaluculateMethod uncomment this
// alertService.recalculateAlertMonitoringByModelId('5f86ffcf81d9305668f2015a");

module.exports = app;
