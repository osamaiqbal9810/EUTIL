let ServiceLocator = require("./framework/servicelocator");
import Logger from "./service/logger";

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
import DatabaseSerivce from "./service/DBService";
import AppAccessService from "./service/AppAccessClass";
import RemedialActionListHook from "./api/ApplicationLookups/RemedialActionListHook";
import SchedulerService from "./service/SchedulerService";
import AlertService from "./api/Alert/Alert.service";
import NotificationService from "./api/Notification/Notification.service";
import CustomerInfoService from "./service/CustomerInfoService";
import VersionService from "./api/version/version.service";

import AssetTestsService from "./api/AssetTests/assetTests.service";
import { TestScheduleObserverService } from "./service/TestScheduleObesrvingService";

import MigrationService from "./api/migrations/migrations.service";
import DataValidationService, { VALIDATION_TYPES } from "./service/validations/DataValidationService";

import LostnfoundService from "./api/Lostnfound/lostnfound.service";
import ATIVDataService from "./timps/api/ATIVData/ATIVData.service";

import EquipmentFormsMethod from "./service//DBServiceHelper/EquipmentFormsMethods";
import EmailService from "./service/EmailService";

var log4js = require("log4js");
export function RegisterServices() {
  log4js.configure(process.env.logPath || "./config/log4js.json");
  ServiceLocator.register("startup", log4js.getLogger("startup"));

  ServiceLocator.register("logger", log4js.getLogger("System"));
  let customLogger = new Logger({ filename: "./log/test.log", display: ["ERROR"] });
  ServiceLocator.register("CustomLogger", customLogger);
  let doeventservice = new DOEventService();
  ServiceLocator.register("DataOpEventService", doeventservice);

  let customerInfoService = new CustomerInfoService();
  ServiceLocator.register("CustomerInfoService", customerInfoService);

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

  let doperationslogic = new DataOperationsLogic(log4js.getLogger("DataOperationsLogic"));
  ServiceLocator.register("DataOperationsLogic", doperationslogic);

  let versionCompatibility = new VersionCompatibility(log4js.getLogger("VersionCompatibility"));
  ServiceLocator.register("VersionCompatibilityService", versionCompatibility);

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

  let migrationService = new MigrationService();
  ServiceLocator.register("MigrationsService", migrationService);

  let dataValidationService = new DataValidationService();
  ServiceLocator.register("DataValidationService", dataValidationService);
  ServiceLocator.register("VALIDATION_TYPES", VALIDATION_TYPES);

  let lnfService = new LostnfoundService();
  ServiceLocator.register("LostnfoundService", lnfService);

  let ativDataService = new ATIVDataService();
  ServiceLocator.register("ATIVDataService", ativDataService);

  let equipmentFormMethods = new EquipmentFormsMethod();
  ServiceLocator.register("EquipmentFormMethods", equipmentFormMethods);
}
