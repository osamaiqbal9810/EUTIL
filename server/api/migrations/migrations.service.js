let ServiceLocator = require("../../framework/servicelocator");
var path = require("path");
let version = require("../../config/version");
import _ from 'lodash';
export default class MigrationService {
    constructor() {
        this.utils = ServiceLocator.resolve('utils');
        version.migration.path = path.join(path.normalize(__dirname + '/../..'), version.migration.path);
        this.config = version.migration;
    }
    //
    // perform status checks
    //
    async performStatusChecks() {
        if (this.config.enabled) {
            let latestAvailable = this.latest();
            if (this.current() !== latestAvailable) {
                console.log('current version in migration configuration is not updated.');
                console.log('Update migration configuraiton to work with latest migration(s)');
                console.log('Latest Available: ', latestAvailable, ' while current:', this.current());
            }

            let dbMigration = await this.getLastDBMigration();

            if (this.config.current !== dbMigration) {
                console.log('DB migration is not latest.', 'Database Migration:', dbMigration, 'while current:', this.config.current);

                let list = this.getIntermediateFiles(dbMigration, this.config.current);
                if (list && list.length) {
                    console.log('Following migrations should be executed to update datbase:');
                    list = list.reverse();
                    console.table(list);
                }

                if (!this.config.autoLatest)
                    console.log('Set autoLatest to true in config to automatically update database');
                else {
                    await this.migrateTo(this.config.current);
                }

            }
        }
        else {
            console.log('Migrations are disabled from config. Set enabled to true to enable migrations.');
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
        let dbMigration = await this.getLastDBMigration();

        if (this.config.current !== dbMigration) {
            let list = this.getIntermediateFiles(dbMigration, this.config.current);
            if (list && list.length) {
                list = list.reverse(); // execute in correct order i.e. the older first
                for (let m of list) {
                    let success = await this.execute(m);
                    if (!success) {
                        console.log('Migrations.migrateTo', version, 'failed at update script:', m);
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
        let success = false, message = '';
        try {
            let module = require(path.join(this.config.path, filename));
            await module.up();
            success = true;
        }
        catch (err) {
            success = false;
            message = this.utils.convertErrorToStr(err);
        }

        let MigrationsModel = ServiceLocator.resolve("MigrationModel");
        let migration = new MigrationsModel({ timestamp: new Date(), name: filename, type: 'migration', result: message, status: success });
        await migration.save();

        return success;
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

        return '';
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
        let lastDbMigration = await this.getLastDBMigration();
        if (lastDbMigration === this.config.current)
            return true;

        return false;
    }
    // compare current version in file and databas; return true what if both are equal.


    // get list of files in migration folder
    getMigrationFilesList() {
        let filesList = [];
        filesList = this.utils.getFilesList(this.config.path);
        filesList = filesList.filter(f => { return this.isValidFileName(f); });
        filesList = filesList.sort((a, b) => { return this.parseTimestamp(path.basename(a)) > this.parseTimestamp(path.basename(b)) ? -1 : 1 });

        return filesList;
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
        if (!filename || !filename.length || !filename.lenght >= 14) return false;
        let ts = filename.slice(0, 14);
        return (ts && ts.length && ts.length == 14 && ts.match(/^[0-9]+$/));
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
        let itemTo = list.find(v => { return v.slice(0, 14) == migrationNumber });
        let indexTo = list.findIndex(v => { return v.slice(0, 14) === migrationNumber });

        let itemFrom = list.find(v => { return v.slice(0, 14) == from });
        let indexFrom = list.findIndex(v => { return v.slice(0, 14) === from });

        if (!itemTo || !itemFrom) {
            console.log('Migration.getIntermediateFiles.warning: searching', migrationNumber, ' or ', from, 'couldnt find anything');
            indexTo = 0;
            indexFrom = list.length - 1;
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
            migrationsList = migrationsList.filter(v => { return this.validateTimestamp(v.name); });

            if (migrationsList.length !== totalLength) // todo: log in database that there are some entries with invalid name
                console.log('Migrations.getDatabaseMigrations.warning: database collection Migrations contains invalid name entries');

            migrationsList = _.sortBy(migrationsList, [o => { return this.parseTimestamp(o.name); }]);
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
        filesList = filesList.filter(f => { return f && f.endsWith('Patch.js'); });

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
            let dbExecs = dbPatches.filter(p => { return p.name === filename });
            let executions = dbExecs.map(p => { return { timestamp: p.timestamp, status: p.status, result: p.result } });

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
        let success = false, message = '';
        try {
            let module = require(path.join(this.config.path, "patches", filename));
            await module.apply();
            success = true;
        }
        catch (err) {
            success = false;
            message = this.utils.convertErrorToStr(err);
        }

        let MigrationsModel = ServiceLocator.resolve("MigrationModel");
        let migration = new MigrationsModel({ timestamp: new Date(), name: filename, type: 'patch', result: message, status: success });
        await migration.save();

        return { value: message, status: success ? 200 : 500 };
    }

};
var migrationService = new MigrationService();
ServiceLocator.register("MigrationsService", migrationService);
module.exports = migrationService;
