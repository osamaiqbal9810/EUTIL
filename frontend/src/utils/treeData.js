import _ from "lodash";

export function TreeNode(data) {
  this.data = data;
  this.parent = null;
  this.children = [];
  this.sortField = "";
  this.sortOrder = 0;
}

TreeNode.comparer = (a, b) => (a.data[a.sortField] < b.data[b.sortField] ? 0 : 1);
TreeNode.stringComparer = (a, b) => {
  var nameA =
    a.data && a.data[a.sortField]
      ? typeof a.data[a.sortField] === "string"
        ? a.data[a.sortField].toUpperCase()
        : a.data[a.sortField]
      : ""; // ignore upper and lowercase
  var nameB =
    b.data && b.data[b.sortField]
      ? typeof b.data[b.sortField] === "string"
        ? b.data[b.sortField].toUpperCase()
        : b.data[b.sortField]
      : ""; // ignore upper and lowercase

  //console.log(typeof a.data[a.sortField]);
  if (nameA < nameB) {
    return a.sortOrder === 0 ? -1 : 1;
  }
  if (nameA > nameB) {
    return a.sortOrder === 0 ? 1 : -1;
  }

  // names must be equal
  return 0;
};
TreeNode.prototype.sortRecursive = function () {
  //this.children.sort(TreeNode.comparer);
  this.children.sort(TreeNode.stringComparer);
  for (var i = 0, l = this.children.length; i < l; i++) {
    this.children[i].sortRecursive();
  }

  return this;
};
TreeNode.prototype.walk = function (f, recursive) {
  for (var i = 0, l = this.children.length; i < l; i++) {
    var child = this.children[i];
    f.apply(child, Array.prototype.slice.call(arguments, 2));
    if (recursive) child.walk.apply(child, arguments);
  }
};

TreeNode.prototype.exclude = function (f, _id, recursive) {
  for (var i = 0, l = this.children.length; i < l; i++) {
    var child = this.children[i];
    f.apply(child, Array.prototype.slice.call(arguments, 2));
    if (child.data && child.data["_id"] != _id) {
      if (recursive) child.exclude.apply(child, arguments);
    }
  }
};

TreeNode.prototype.find = function (f, _id) {
  let selNode = [];
  this.walk(function () {
    if (this.data._id === _id) {
      f.apply(this, Array.prototype.slice.call(arguments, 2));
    }
  }, true);
};

function doesObjectContain(objOne, objTwo) {
  return !!_([objOne]).filter(objTwo).size();
}
export function filterTreeByProperties(treeObj, propertiesObj, ofilteredTreeArray, idsWithProps) {
  let keys = Object.keys(treeObj);
  let properties = treeObj["properties"];
  let retValue = false;

  if (properties) {
    retValue = doesObjectContain(properties, propertiesObj);
  }
  let v;
  for (let key of keys) {
    if (key != "properties") {
      v = filterTreeByProperties(treeObj[key], propertiesObj, ofilteredTreeArray, idsWithProps);
      if (v && key != "0") {
        idsWithProps && ofilteredTreeArray.push({ id: key, properties: treeObj[key].properties });
        !idsWithProps && ofilteredTreeArray.push(key);
      }
    }
  }
  return retValue;
}

export function arrayToTree(data, sortField, sortOrder) {
  let nodeById = {},
    i = 0,
    l = data.length,
    node;
  nodeById[0] = new TreeNode();
  for (i = 0; i < l; i++) {
    nodeById[data[i]["_id"]] = new TreeNode({ ...data[i], sortField: sortField, sortOrder: sortOrder });
  }
  for (i = 0; i < l; i++) {
    node = nodeById[data[i]._id];
    node.parent = nodeById[node.data.parentAsset];
    node.sortField = sortField;
    node.sortOrder = sortOrder;
    if (node.parent) {
      node.parent.children.push(node);
    } else {
      nodeById[0].children.push(node);
    }
  }
  let var1 = nodeById[0].sortRecursive();
  return var1;
}
export function loadTreeObjects(treeBranch, node) {
  let nodeById = {};
  let aIds = Object.keys(treeBranch);
  let i = 0;
  for (let key of aIds) {
    let data = { _id: key };
    nodeById[key] = new TreeNode(data);
    nodeById[key].parent = node;
    if (typeof treeBranch[key] === "object") {
      nodeById[key].children = loadTreeObjects(treeBranch[key], nodeById[key]);
    }
  }
  return nodeById;
}

export function findTreeNode(treeBranch, _id) {
  let aIds = Object.keys(treeBranch);
  for (let key of aIds) {
    if (key === _id) {
      return treeBranch[key];
    }
    if (typeof treeBranch[key] === "object") {
      let foundObj = findTreeNode(treeBranch[key], _id);
      if (foundObj) {
        return foundObj;
      }
    }
  }
}

export function groupTreeNodeByProperty(treeBranch, propertyName, resultObj) {
  let aIds = Object.keys(treeBranch);

  for (let key of aIds) {
    let propKey = treeBranch[key]["properties"];
    if (propKey) {
      if (propKey[propertyName]) {
        resultObj = !resultObj ? {} : resultObj;
        resultObj[propKey[propertyName]] = !resultObj[propKey[propertyName]] ? [] : resultObj[propKey[propertyName]];
        //if (!resultObj[propKey[propertyName]].data) resultObj[propKey[propertyName]].data = [];
        let obj = {};
        obj["_id"] = key;
        obj["unitId"] = propKey["unitId"];
        obj["inspectable"] = propKey["inspectable"];
        resultObj[propKey[propertyName]].push(obj);
        if (Object.keys(treeBranch[key]).length > 1) {
          resultObj = groupTreeNodeByProperty(treeBranch[key], propertyName, resultObj);
        }
      }
    }
  }
  return resultObj;
}
export function treeToArray(treeBranch) {
  let resultArray = [];
  let aIds = Object.keys(treeBranch);
  for (let key of aIds) {
    if (key !== "properties") {
      if (typeof treeBranch[key] === "object") {
        resultArray.push(key);
        let retArray = treeToArray(treeBranch[key]);
        if (retArray) {
          resultArray = resultArray.concat(retArray);
        }
      }
    }
  }
  return resultArray;
}

export function treeToPropertiesObject(treeBranch) {
  let resultArray = [];
  let aIds = Object.keys(treeBranch);
  for (let key of aIds) {
    if (key !== "properties") {
      if (typeof treeBranch[key] === "object") {
        resultArray.push({ _id: key, ...treeBranch[key].properties });
        let retArray = treeToPropertiesObject(treeBranch[key]);
        if (retArray) {
          resultArray = resultArray.concat(retArray);
        }
      }
    }
  }
  return resultArray;
}

export function oneLayerTreeItemsToObjects(treeBranch) {
  let resultArray = [];
  let aIds = Object.keys(treeBranch);
  for (let key of aIds) {
    if (key != "properties") {
      if (typeof treeBranch[key] === "object") {
        resultArray.push({ _id: key, ...treeBranch[key].properties });
      }
    }
  }
  return resultArray;
}
