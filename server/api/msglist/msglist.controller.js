/**
 * Created by zqureshi on 10/12/2018.
 */
//let Task = require("./task.model");
let _ = require("lodash");
let ServiceLocator = require("../../framework/servicelocator");

async function addorUpdate(req, res, next) {
  let itemCount = 0;
  let results=[];
  let listHelper = ServiceLocator.resolve("ListHelper");
  let DOValidator = ServiceLocator.resolve("DataOpValidationService");
  let DOEventService = ServiceLocator.resolve("DataOpEventService");

  req.body.forEach(async (element) => {
    let docObj = JSON.parse(element.optParam1.toString());
    let skip = false;
    let item = {
      listName: element.listname,
      code: element.code,
      description: element.desc,
      optParam1: docObj,
      optParam2: element.optParam2,
    };
    let prevItemCopy = _.cloneDeep(item);
    let vr = await DOValidator.validatemsgListRequest(item, req.user);

    if (vr.valid === true) {
      if (vr.hasOwnProperty("newObj") && vr.newObj != null) {
        item = vr.newObj;
        console.log("validator proposed changes in object: " + vr.newObj);
      }

      await DOEventService.emit(item.listName + "+BeforeAddOrUpdate", {
        item: item,
        user: req.user,
      });

      listHelper.addOrUpdate(item, {
        success: async (r1, newItem) => {
          await DOEventService.emit(item.listName + "+AddOrUpdateSuccess", {
            item: prevItemCopy,
            user: req.user,
            newItem: newItem,
            change: item,
          });
          results.push({listName: item.listName, code: element.code, result: true});
          itemCount++;
          if (itemCount >= req.body.length) {
            res.status(200);
            return res.json(r1); // {r1, results: results});
          }
        },
        fail: async (r1) => {
          await DOEventService.emit(item.listName + "+AddOrUpdateFailed", {
            item: item,
            user: req.user,
          });
          results.push({listName: item.listName, code: element.code, result: false});
          itemCount++;
          if (itemCount >= req.body.length) {
            res.status(200);
            return res.json(r1); // {r1, results: results});
          }
        },
      });
    } else {
      console.log(item.listName + " validation failed but returning success");
      results.push({listName: item.listName, code: element.code, result: false});
      itemCount++;
      if (itemCount >= req.body.length) {
        res.status(200);
        return res.json("success"); // {r1:"validation failed.", results: results});
      }
    }
  });

  // Todo return response
}
exports.addOrUpdate = addorUpdate;

function handleError(res, err) {
  res.status(500);
  return res.send(err);
}
