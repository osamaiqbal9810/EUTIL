let ServiceLocator = require("../../framework/servicelocator");
let tenantInfo = require("../../utilities/tenantInfo");
class RemedialActionListHook {
    constructor()
    {
        this.remedialActionListName='remedialAction';
        this.listItemCodeName = '01 slowOrderApplied';
        this.opt1ObjectEntryId= 'slowOrderSpeedRestict';
        this.codeprefix = 'code-';
        this.idprefix = 'id-';
    }

    getRemedialActionListName(){
        return this.remedialActionListName;
    }
    processRequiredLists(lists)
    {
        // process to get listName:remedialAction, use only list in opt1 of code: slowOrderApplied, opt1 has list of objects. desired object's "id" field equals slowOrderSpeedRestict
        let desiredList = lists.filter(l=>{return l.listName=== this.remedialActionListName && l.code===this.listItemCodeName;});
        let listtoreplace=[];
        if(desiredList.length) 
        {
        let opt1Entry = desiredList[0] && desiredList[0].opt1 && desiredList[0].opt1.length ? desiredList[0].opt1.filter(l=>{return l.id===this.opt1ObjectEntryId}):null;
        listtoreplace = opt1Entry && opt1Entry[0] && opt1Entry[0].options;
        }
        if(listtoreplace && lists.length) // replace remedialAction 
        { 
        lists = lists.filter(l=>{return l.listName!== this.remedialActionListName});
        for(let l of listtoreplace)
        {
            lists.push({_id:this.idprefix+l, listName: this.remedialActionListName, code:this.codeprefix+l, description: l });
        }
        }
        return lists;
    }
    async updateList(body)
    {
        let result={status:500, errorVal:'default'};

        try
        {
            let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
            let rField = await ApplicationLookupsModel.findOne({listName:this.remedialActionListName, code:this.listItemCodeName});
            // update only opt1's element that contains list of slow order values.
            if(!rField)
            {
                return {status: 500, value:'remedial action slow order code not found'};
            }
            rField.opt1 = this.updateSlowOrderList(rField.opt1, body.code.slice(this.codeprefix.length), body.description);
            rField.markModified('opt1');
            result.value = await rField.save();
            result.status=200;
        }
        catch(err)
        {
            result.errorVal = err.toString();
            console.log('remedialactiolisthook.updatelist.catch:', err.toString());
        }

        return result;
    }
    async create(body)
    {
      let ApplicationLookupsModel = ServiceLocator.resolve('ApplicationLookupsModel');
      let rField = await ApplicationLookupsModel.findOne({listName:this.remedialActionListName, code:this.listItemCodeName});
      // update only opt1's element that contains list of slow order values.
      if(!rField)
      {
        return {status: 500, value:'remedial action slow order code not found'};
      }
      rField.opt1 = this.insertSlowOrderList(rField.opt1, body.description);
      rField.markModified('opt1');
      let r = await rField.save();
      return {status:200, value: r};
    }
    async deleteOne(item)
    {
        let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
        let rField = await ApplicationLookupsModel.findOne({listName:this.remedialActionListName, code:this.listItemCodeName});
      // update only opt1's element that contains list of slow order values.
      
      if(!rField)
      {
        return {status: 500, value:'remedial action slow order code not found'};
      }
      rField.opt1 = this.deleteSlowOrderList(rField.opt1, item);
      rField.markModified('opt1');
      await rField.save();
      return {status:200, value: ""};
    }

  updateSlowOrderList(opt1, prevValue, newValue)
  {
      let entry = opt1.find(itm=>{return itm.id===this.opt1ObjectEntryId});
      let index = entry.options.findIndex(itm=>{return itm===prevValue;});
      entry.options.splice(index, 1, newValue);
      return opt1;
  }
  insertSlowOrderList(opt1, newValue)
  {
      let entry = opt1.find(itm=>{return itm.id===this.opt1ObjectEntryId});
      entry.options.push(newValue);
      return opt1;
  }
  deleteSlowOrderList(opt1, valueToDelete)
  {
      let entry = opt1.find(itm=>{return itm.id===this.opt1ObjectEntryId});
      let index = entry.options.findIndex(itm=>{return itm===valueToDelete;});
       if(index>=0)
        entry.options.splice(index,1);
      return opt1;
  }
};
export default RemedialActionListHook;