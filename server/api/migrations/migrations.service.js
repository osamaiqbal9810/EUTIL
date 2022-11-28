let ServiceLocator = require("../../framework/servicelocator");
var path = require("path");
let version = require("../../config/version");
import _ from "lodash";
export default class MigrationService {
  constructor() {
    this.utils = ServiceLocator.resolve("utils");
    this.customerInfo = ServiceLocator.resolve("CustomerInfoService");
    this.logger = ServiceLocator.resolve("logger");
    this.vUtil = ServiceLocator.resolve("ValidationUtils");

    version.migration.path = path.join(path.normalize(__dirname + "/../.."), version.migration.path);
    this.config = version.migration;
  }
  //
  // perform status checks
  //
  async performStatusChecks() {
    if (this.config.enabled) {
      let latestAvailable = this.latest();
      if (this.current() !== latestAvailable) {
        console.log("current version in migration configuration is not updated.");
        console.log("Update migration configuraiton to work with latest migration(s)");
        console.log("Latest Available: ", latestAvailable, " while current:", this.current());
      }

      //let dbMigration = await this.getLastDBMigration();
      console.log(dbMigration);
      console.log(this.config.current);
      if (this.config.current !== dbMigration) {
        console.log("DB migration is not latest.", "Database Migration:", dbMigration, "while current:", this.config.current);
        this.logger.warn("Database Migration:" + dbMigration + " while current:" + this.config.current);

        let list = this.getIntermediateFiles(dbMigration, this.config.current);
        if (list && list.length) {
          console.log("Following migrations should be executed to update datbase:");
          list = list.reverse();
          console.table(list);
        }

        if (!this.config.autoLatest) console.log("Set autoLatest to true in config to automatically update database");
        else {
          await this.migrateTo(this.config.current);
        }
      }
    } else {
      console.log("Migrations are disabled from config. Set enabled to true to enable migrations.");
      this.logger.warn("Migrations are disabled from config. Set enabled to true to enable migrations.");
    }
  }

  //
  // Returns the current migration version in configuration.
  //
  current() {
    return this.config.current;
  }
  //
  // Returns the latest migration available in the file system.
  //
  latest() {
    // read files in directory this.config.path
    // sort as per timestamp
    // return the parsed timestamp string from the filename with the latest timestamp
    let listOfFiles = this.getMigrationFilesList();

    return this.parseTimestamp(path.basename(listOfFiles[0]));
  }
  //
  // Migrate to a specific version by running required migration scripts
  //
  async migrateTo(version) {
   // let dbMigration = await this.getLastDBMigration();
    if (this.config.current !== dbMigration) {
      let list = this.getIntermediateFiles(dbMigration, this.config.current);
      if (list && list.length) {
        list = list.reverse(); // execute in correct order i.e. the older first
        this.logger.info("Starting migration running:" + list.length + " migrations");
        this.logger.info(
          "Current Customer:" + (await this.getCurrentCustomer()) + ", ApplicataionType:" + (await this.getCurrentApplicationType()),
        );

        for (let m of list) {
          let success = await this.execute(m);
          if (!success) {
            console.log("Migrations.migrateTo", version, "failed at update script:", m);
            this.logger.error("Migrations.migrateTo " + version + " failed at update script:" + m);
            break;
          }
        }
      }
    }
  }
  //
  // This function will load and execute a migration from specified file
  //
  async execute(filename) {
    let success = false,
      message = "";
    try {
      let module = require(path.join(this.config.path, filename));

      // Check for applicationType and customer specific migrations.
      let applicationSpecific = module.attributes && module.attributes.applicationType,
        customerSpecific = module.attributes && module.attributes.customer,
        applicationMismatch = false,
        customerMismatch = false;

      let dbApplicationType = await this.getCurrentApplicationType();

      applicationMismatch = applicationSpecific && module.attributes.applicationType !== dbApplicationType;
      // If migration is applicationType specific, then check if the applicationType mismatch
      //    applicationMismatch = applicationSpecific && module.attributes.applicationType !== await this.getCurrentApplicationType();

      // If migration is customer specific, then check if the customer mismatch
      customerMismatch = customerSpecific && module.attributes.customer !== (await this.getCurrentCustomer());

      // Skip if the applicationType OR customer is not matched with current installation.
      if (applicationMismatch || customerMismatch) {
        success = true;

        this.logger.info(
          "Migration:" +
            filename +
            " is not for current system. Migration Info:" +
            (customerMismatch ? " customer:" + module.attributes.customer : "") +
            (applicationMismatch ? " applicationType:" + module.attributes.applicationType : ""),
        );
        message =
          "Skipped info:" +
          (customerMismatch ? " customer:" + module.attributes.customer : "") +
          (applicationMismatch ? " applicationType:" + module.attributes.applicationType : "");
      } else {
        await module.up();
        success = true;
      }
    } catch (err) {
      success = false;
      message += this.utils.convertErrorToStr(err);
    }

    let MigrationsModel = ServiceLocator.resolve("MigrationModel");
    let migration = new MigrationsModel({ timestamp: new Date(), name: filename, type: "migration", result: message, status: success });
    await migration.save();

    return success;
  }
  // return applicationType 'TIMPS' or 'SITE'
  async getCurrentApplicationType() {
    return await this.customerInfo.getApplicationType();
  }

  // return current customer company name
  async getCurrentCustomer() {
    return await this.customerInfo.getCustomerName();
  }

  //
  // Returns the last executed migration
  //
  async getLastDBMigration() {
    // get list of migrations from database
    // returns the basename of the top one
    //$migrations = $this->find_migrations();
    //return basename(end($migrations));
    //
    let dbMigrations = await this.getDatabaseMigrations();
 
    if (dbMigrations && dbMigrations.length) {
      return this.parseTimestamp(dbMigrations[0].name);
    }

    return "";
  }
  async isLatest() {
    // find the version of last executed migration
    // compare this with current version in configuration
    // returns true if equal
    //
    // $last_migration = $this->get_last_migration();
    // $last_version = $this->_get_migration_number($last_migration);
    // $current_version = $this->_get_version();
    // return $last_version == $current_version;
    //
    //
   // let lastDbMigration = await this.getLastDBMigration();
    //if (lastDbMigration === this.config.current) return true;

    return false;
  }
  // compare current version in file and databas; return true what if both are equal.

  // get list of files in migration folder
  getMigrationFilesList() {
    const filesList = this.utils.getFilesList(this.config.path);
    const jsFilesList = filesList.filter(f=>{
      return path.extname(f)=='.js';
    });

    const jsFileCount = jsFilesList.length;

    let validFilesList = jsFilesList.filter((f) => {
      return this.isValidFileName(f);
    });

    if(validFilesList.length !== jsFileCount) {
      console.log('Migration files: There are files with invalid filenames.');
      console.log('Please fix the migration files.');
      console.table(jsFilesList.filter(f=>{return !this.isValidFileName(f);}));
      if(process.env.NODE_ENV && process.env.NODE_ENV==='development')
      {
        console.log('The process cannot continue (Exists, if in development mode) ...');
        process.exit(1);
      }
    }

    validFilesList = validFilesList.sort((a, b) => {
      return this.parseTimestamp(path.basename(a)) > this.parseTimestamp(path.basename(b)) ? -1 : 1;
    });

    return validFilesList;
  }
  //
  // validates if the filename from path is preceeded by 14 digit numeric timestamp YYYYMMDDHHMMSS
  //
  isValidFileName(filePath) {
    let filename = path.basename(filePath);
    return this.validateTimestamp(filename);
  }
  //
  // returns true if the filename contains all numbers at the start of it.
  //
  validateTimestamp(filename) {
    if (!filename || !filename.length || filename.length < 14) return false;
    const ts = filename.slice(0, 14);
    const year = ts.slice(0, 4),
        month = ts.slice(4, 6),
        day = ts.slice(6, 8),
        hour = ts.slice(8, 10),
        minutes = ts.slice(10, 12),
        seconds = ts.slice(12, 14);

    const tsValid = this.vUtil.isNumericInRange(year, 1999, 3000) && this.vUtil.isNumericInRange(month, 1, 12)
                 && this.vUtil.isNumericInRange(day, 1, 31) && this.vUtil.isNumericInRange(hour, 0, 23)
                 && this.vUtil.isNumericInRange(minutes, 0, 59) && this.vUtil.isNumericInRange(seconds, 0, 59);
  
    return ts && ts.length && ts.length == 14 && ts.match(/^[0-9]+$/) && tsValid;
  }
  //
  // parse timestamp from the filename
  //
  parseTimestamp(filename) {
    if (this.validateTimestamp(filename)) {
      return filename.slice(0, 14);
    }
    return null;
  }
  //
  // Get intermediate files from "from" to "migrationNumber"
  //
  getIntermediateFiles(from, migrationNumber) {
    let list = this.getMigrationFilesList(); // returns the latest at top(0 index)
    let itemTo = list.find((v) => {
      return v.slice(0, 14) == migrationNumber;
    });
    let indexTo = list.findIndex((v) => {
      return v.slice(0, 14) === migrationNumber;
    });

    let itemFrom = list.find((v) => {
      return v.slice(0, 14) == from;
    });
    let indexFrom = list.findIndex((v) => {
      return v.slice(0, 14) === from;
    });

    if(!itemTo) {
      console.log("Migration.getIntermediateFiles.warning: Could not find 'to':", migrationNumber);
      this.logger.warn("Migration.getIntermediateFiles.warning: Could not find 'to': " + migrationNumber);
      console.log("Cannot perform update.");
      return [];
    }
    if (!itemFrom) {
      console.log("Migration.getIntermediateFiles.warning: Could not find 'from':", from);
      this.logger.warn("Migration.getIntermediateFiles.warning: Could not find 'from':" + from);
      
      return [];
      // indexTo = 0;
      // indexFrom = list.length - 1;
    }

    let remainingList = list.slice(indexTo, indexFrom - indexTo);

    return remainingList;
  }
  //
  // Get list of migrations from database
  //

  async getDatabaseMigrations() {
    let MigrationsModel = ServiceLocator.resolve("MigrationModel");
    let migrationsList = await MigrationsModel.find({ type: "migration", status: true }).exec();
    let totalLength = migrationsList.length;
      if (migrationsList && migrationsList.length) {
        migrationsList = migrationsList.filter((v) => {
          return this.validateTimestamp(v.name);
      });

      if (migrationsList.length !== totalLength) {
        // todo: log in database that there are some entries with invalid name
        const vals = `Total: ${totalLength} !== Filtered: ${migrationsList.length}`;
        console.log("Migrations.getDatabaseMigrations.warning: database collection Migrations contains invalid name entries: " + vals);
        this.logger.warn("Migrations.getDatabaseMigrations.warning: database collection Migrations contains invalid name entries: " + vals);
      }
      
      migrationsList = _.sortBy(migrationsList, [
        (o) => {
          return this.parseTimestamp(o.name);
        },
      ]);
      _.reverse(migrationsList);
    }

    return migrationsList;
  }
  //
  // Returns the list of files in the migrations/patches folder. only files with filenames ending with **Patch.js will be considered valid
  //
  getPatchFilesList() {
    let filesList = [];
    filesList = this.utils.getFilesList(path.join(this.config.path, "patches"));
    filesList = filesList.filter((f) => {
      return f && f.endsWith("Patch.js");
    });

    return filesList;
  }
  //
  // Get Database entries for executed patches
  //
  async getDBPatchEntries() {
    let MigrationsModel = ServiceLocator.resolve("MigrationModel");
    let migrationsList = await MigrationsModel.find({ type: "patch" }).exec();
    return migrationsList;
  }
  //
  // Make a map with key as patch filename and an array of executions as second element.
  //
  async getAllPatches(user) {
    let filesList = this.getPatchFilesList();
    let dbPatches = await this.getDBPatchEntries();
    let patchExecutionMap = new Map();
    for (let file of filesList) {
      let filename = path.basename(file);
      let dbExecs = dbPatches.filter((p) => {
        return p.name === filename;
      });
      let executions = dbExecs.map((p) => {
        return { timestamp: p.timestamp, status: p.status, result: p.result };
      });

      patchExecutionMap.set(filename, executions);
    }

    return patchExecutionMap;
  }
  //
  // Format the return value compatible with our controller
  //
  async getAllPatchesForAPI(user) {
    let result = await this.getAllPatches(user);
    ///console.log(result);
    return { status: 200, value: JSON.stringify(result) };
  }
  //
  // Execute a patch with filename as a parameter
  //
  async executePatch(filename) {
    let success = false,
      message = "";
    try {
      let module = require(path.join(this.config.path, "patches", filename));
      await module.apply();
      success = true;
    } catch (err) {
      success = false;
      message = this.utils.convertErrorToStr(err);
    }

    let MigrationsModel = ServiceLocator.resolve("MigrationModel");
    let migration = new MigrationsModel({ timestamp: new Date(), name: filename, type: "patch", result: message, status: success });
    await migration.save();

    return { value: message, status: success ? 200 : 500 };
  }
}
