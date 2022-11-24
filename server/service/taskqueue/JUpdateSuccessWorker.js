const actionTypes = require('./actionTypes');

class JPUpdateSuccessWorker{
	constructor(DBService, DataOperationsLogic, diagLog){
		this.DBService = DBService;
		this.DataOperationsLogic = DataOperationsLogic;

		this.diagLog = diagLog;
		this.completionCallback = {};

		this.config = {
			trace: true
		};

		// runtime 
		this.actionType='';
		this.creationTime=new Date();
		this.lastUpdateTime='';
		this.requestTime='';
		this.state='waiting';
		this.userEmail='';
	}
	// interface functions below	
	async process()
	{
			this.state='requested';
			this.requestTime=new Date();
			let result={};
			
		try
		{
			
			if(this.config && this.config.trace)
			{
				this.diagLog.info('Worker: process: ', 'action ', this.actionType);
				//console.log('Process started: action:', this.actionType);

			}
					
			switch(this.actionType)
			{
			case actionTypes.JP_UPDATE_SUCCESS:
			
			    await this.DataOperationsLogic.JUpdateSuccessCallback(this.itm);
				await this.DataOperationsLogic.JPUpdateCallback(this.itm);
				await this.DBService.checkTestsFormFilling(this.itm);
				await this.DBService.workPlanIntervalReceivedMethod(this.itm);
				await this.DBService.checkForTemplateScheduleReCalculateFlag(this.itm);
				await this.DBService.fixedAssetGPSupdate(this.itm);
				await this.DataOperationsLogic.JPUpdateCallbackForAlertRecalculate(this.itm);
				await this.DBService.JPUpdateCallbackForAlertRecalculate(this.itm);
				await this.DBService.maintenanceExecution(this.itm);
				await this.DBService.updateDefaultAppFormsValues(this.itm);
				await this.DBService.pushDefectIssues(this.itm);
				await this.DBService.inspectionOnFinished(this.itm);
				await this.DBService.userProfileUpdate(this.itm);

			this.completionCallback('success'); 
			return result;

			default:
				this.state='invalid';
				// todo: log and/or completion callback
				break;
			}
		}
		catch(e)
		{
			this.diagLog.error('worker.process.catch: ',e);
			this.completionCallback('failed');
		}
		
		this.completionCallback('failed');
		return result;
	}
	setCompletionCallback(ccallback)
	{
		this.completionCallback = ccallback;		
	}
	setArguments(args)
	{
		this.actionType=args.actionType;
		this.itm = args.itm;
	}
	getInfo()
	{
		return{
			actionType: this.actionType,
			creationTime: this.creationTime,
			requestTime: this.requestTime,
			state: this.state,
			lastUpdateTime: this.lastUpdateTime,
		};
	}
	getLastActivityTime()
	{
		return this.lastUpdateTIme;
	}
	isEqualsTo(anotherWorker)
	{
		if(anotherWorker instanceof JPUpdateSuccessWorker) // todo: add further checks
		{
			if(this.actionType==anotherWorker.actionType)
			{
				return true;			
			}
		}
		
		return false;
	}
	aborting(timeoutValue)
	{
		
	}
	// interface functions above

	
}

module.exports = JPUpdateSuccessWorker;