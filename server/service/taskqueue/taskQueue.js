//import { UUID } from "../service/UUID";
const  _ = require("lodash");
function UUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

class TaskQueue {
    constructor(diagLog) {
        this.diagLog = diagLog;
        this.taskList = new Array();
        this.currentTask = {};
        this.owner = "";
        this.taskTimer = 0;

        this.config = {
            noHeartbeatTimeout: 20 * 60 * 1000, // 20 minutes
            taskTimeoutValue: 5 * 60 * 1000, // 5 minutes
        };

        // todo: task execution should also consider MQTT connection status
        this.paused = false;//true;
    }
    enqueue(type, taskWorker, force = false) {
        //this.diagLog.info('Task Queue: ', this.owner, ' queueing task:'+ type,' ignoreOnline:', force );
        this.taskList.push({ id: UUID(), type: type, worker: taskWorker, timestamp: new Date(), startTime: {} });
        let retVal = this.processQueue(force);

        return retVal;
    }
    isAlreadyExist(worker) {
        let exist = false;
        if (this.currentTask && this.currentTask.worker && this.currentTask.worker.isEqualsTo(worker)) {
            exist = true;
        }
        this.taskList.forEach(function(task) {
            if (task.worker.isEqualsTo(worker)) {
                exist = true;
            }
        });

        return exist;
    }
    isEmpty() {
        return this.taskList.empty();
    }
    setOwner(owner) {
        this.owner = owner;
    }
    getTasks(type = "") {
        let list = new Array();

        this.taskList.forEach(function(tsk) {
            if (type == "") {
                list.push(tsk);
            } else if (tsk.type == type) {
                list.push(tsk);
            }
        });
    }
    getTasksInfo(type = "") {
        let list = new Array();

        this.taskList.forEach(function(tsk) {
            if (type == "") {
                list.push(tsk.worker.getInfo());
            } else if (tsk.type == type) {
                list.push(tsk.worker.getInfo());
            }
        });
    }
    getTaskList() {
        return this.taskList;
    }
    getCompleteTaskList() {
        let checkCurrentTask = _.isEmpty(this.currentTask);
        let newTaskList = [];
        if (!checkCurrentTask) {
            let currentTaskObj = {
                id: this.currentTask.id,
                type: this.currentTask.type,
                timestamp: this.currentTask.timestamp,
                startTime: this.currentTask.startTime,
            };
            newTaskList.push(currentTaskObj);
        }
        this.taskList.forEach(task => {
            let taskObj = { id: task.id, type: task.type, timestamp: task.timestamp, startTime: task.startTime };
            newTaskList.push(taskObj);
        });

        return newTaskList;
    }
    processQueue(force = false) {
        if (this.paused && !force) {
            // force will only work if there is no current task
            return "paused";
        }
        if (this.currentTask && this.currentTask.startTime) {
            // only start when no task running
            return "executing " + this.currentTask.type + " since " + this.currentTask.startTime;
        }

        let task = this.taskList.shift();
        // assert(task)
        // assert(task.func)
        this.currentTask = task;
        if (this.currentTask) {
            this.currentTask.startTime = new Date();
            //todo: validate this.currentTask.worker
            this.currentTask.worker.setCompletionCallback(status => {
                this.completionCallback(status);
            });
            this.currentTask.worker.process();
            this.taskTimer = setInterval(() => {
                this.taskTimeoutTimer();
            }, this.config.taskTimeoutValue);

            //this.diagLog.info('Task Queue: ', this.owner, ' task started, ', this.currentTask.type, ' info:', this.currentTask.worker.getInfo());
            return "success";
        }

        //this.diagLog.error('Task Queue:', ' a null pointer in task queue. ');
        return "error";
    }
    flush() {
        this.taskList.splice(0, this.taskList.length);
        this.currentTask = {};
        if (this.taskTimer > 0) {
            clearInterval(this.taskTimer);
        }
    }
    completionCallback(status) {
        if (this.currentTask) {
            // Todo: get failure, success or timeout as a parameter and implement retries
            let secondsPassed = (Date.now() - this.currentTask.startTime) / 1000;

            this.diagLog.info(
                "Task Queue: ",
                this.owner,
                " task completion, ",
                this.currentTask.type,
                ":",
                status,
                " total seconds:",
                secondsPassed,
            );
            clearInterval(this.taskTimer); // clear timeout timer
        } else {
            //log that some unknown task callback completion
        }
        this.currentTask = {}; // empty current inorder to proceed to next
        let retVal = this.processQueue();
        if (retVal == "success" && this.currentTask != {}) {
            this.diagLog.info("Task Queue: ", this.owner, " next task started: ", this.currentTask.type, this.currentTask.worker.getInfo());
        }
    }
    setExecution(play) {
        if (this.paused == !play) {
            // unneccessary to proceed further
            return;
        }

        this.paused = !play;
        if (!this.paused) {
            // if un-paused the resume with next
            this.diagLog.info("Task Queue: ", this.owner, " queue execution resumed, count:", this.taskList.length);
            let retVal = this.processQueue();
            if (retVal == "success" && this.currentTask != {}) {
                this.diagLog.info(
                    "Task Queue: ",
                    this.owner,
                    " next task started: ",
                    this.currentTask.type,
                    this.currentTask.worker.getInfo(),
                );
            }
        } // pause execution
        else {
            if (this.currentTask && this.currentTask.worker && this.currentTask.worker.state == "requested") {
                //todo: place additional check of start time
                // requeue current task
                this.taskList.unshift(this.currentTask);
                clearInterval(this.taskTimer);
                this.currentTask = {};
            }
            this.diagLog.info("Task Queue: ", this.owner, " queue execution paused, count:", this.taskList.length);
        }
    }
    removeTask(taskId) {
        let result = _.find(this.taskList, { id: taskId });
        if (result) {
            _.remove(this.taskList, task => {
                return task.id == result.id;
            });
            return true;
        } else if (this.currentTask.id == taskId) {
            clearInterval(this.taskTimer);
            this.diagLog.info("Task Queue: ", this.owner, "Task ", this.currentTask.type, ": Terminated by the User");
            this.currentTask.worker.aborting();
            this.currentTask = {};
            this.setExecution(!this.paused);
        } else {
            false;
        }
    }
    taskTimeoutTimer() {
        let heartBeatTime = this.currentTask.worker.getLastActivityTime();
        if (!heartBeatTime || (heartBeatTime && heartBeatTime == "")) {
            clearInterval(this.taskTimer);
            this.diagLog.info("Task Queue: ", this.owner, "Task ", this.currentTask.type, ": no activity since start terminating...");
            /*if(this.currentTask.worker.needsRestart()) //Todo: implement retry counter in worker and return true if no response 
			{}*/
            this.currentTask.worker.aborting(heartBeatTime);
            this.currentTask = {};
            this.setExecution(!this.paused); // pause the execution and start on next activity
            return;
        }

        let timePassedSinceHeartBeat = Date.now() - heartBeatTime;
        if (timePassedSinceHeartBeat >= this.config.noHeartbeatTimeout) {
            clearInterval(this.taskTimer);
            this.diagLog.info(
                "Task Queue: ",
                this.owner,
                "Task ",
                this.currentTask.type,
                ": no activity in last timeout span, terminating...",
            );
            /*if(this.currentTask.worker.needsRestart()) //Todo: implement retry counter in worker and return true if no response 
			{}*/
            this.currentTask.worker.aborting(timePassedSinceHeartBeat);
            this.currentTask = {};
            this.setExecution(!this.paused); // pause the execution and start on next activity
            return;
        }
    }
}
module.exports = TaskQueue;