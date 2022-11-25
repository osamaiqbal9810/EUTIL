export async function addIfNotExist(model, criteria, newEntry) {
  if (!model) {
    console.log("model not valid, exitting");
    return;
  }
  if (!criteria || criteria == {}) {
    console.log("Only one entry should be added, provide criteria");
    return;
  }
  if (!newEntry) {
    console.log("Entry to add is null");
    return;
  }

  try {
    let entry = await model.findOne(criteria).exec();
    if (!entry) {
      console.log("adding entry ", newEntry);
      await model.create(newEntry);
    }
  } catch (err) {
    console.log("addIfNotExist in dbHelperMethods.js, err:", err.toString());
  }
}
export async function deleteIfExist(model, criteria) {
  console.log("hello");
  if (!model) {
    console.log("model not valid, exitting");
    return;
  }
  if (!criteria || criteria == {}) {
    console.log("Only one entry should be added, provide criteria");
    return;
  }
 
  try {
    let entry = await model.find({group_id: criteria}).exec();
    console.log(entry);
    if (entry) {
      console.log("deleting entry ", entry);
      await model.remove({_id: entry._id});
    }
  } catch (err) {
    console.log("addIfNotExist in dbHelperMethods.js, err:", err.toString());
  }
}
export async function update(model, query, key, value) {
  try {
    let rec = await model.findOne(query);
    if (rec) {
      rec[key] = value;
      rec.save(v => {
        console.log("Seed: done update", model.modelName, "set", key, "=", value, "where", query);
      });
    }
  } catch (err) {
    console.log("udpate ", model ? (model.modelName ? model.modelName : "bad Model") : "null model", " caugth error: ", err.toString());
  }
}

export async function renameField(model, criteria, renameObject) {
  // this function change field name for existing data
  // db.getCollection('maintenances').updateMany({},{$rename: {"mwoNumber": "mrNumber"}})
  try {
    //let r =  await model.updateMany(criteria, {$rename: {oldName, newName}});
    model.update(criteria, { $rename: renameObject }, { multi: true }, function(err, blocks) {
      if (err) {
        console.log(err.toString());
        return;
      }
      console.log("rename ", model.modelName, "field: ", renameObject);
    });
  } catch (err) {
    console.log("renameField in dbHelperMethods.js, err:", err.toString());
  }
}

export async function UpdateOrAddIfNotExist(model, criteria, newEntry, updateCriteria) {
  if (!model) {
    console.log("model not valid, exiting");
    return;
  }
  if (!criteria || criteria == {}) {
    console.log("Only one entry should be added, provide criteria");
    return;
  }
  if (!newEntry) {
    console.log("Entry to add is null");
    return;
  }

  try {
    let entry = null;
    entry = await model.findOne(criteria).exec();
    if (!entry && updateCriteria) {
      entry = await model.findOneAndUpdate(updateCriteria, newEntry);
    }
    if (!entry) {
      await model.create(newEntry);
    }
  } catch (err) {
    console.log("UpdateOrAddIfNotExist in dbHelperMethods.js, err:", err.toString());
  }
}

export async function countDocuments(model, criteria)
{
  if(!model){
    console.log("dbHelperMethods.countDocuments error, invalid model provided");
    return;
  }
  if(!criteria)
    criteria={};
  try{
    let count = await model.countDocuments(criteria);
    return count;
  }
  catch(err){
    console.log("dbHelperMethods.countDocuments.catch:", err.toString());
  }
  return 0;
}
