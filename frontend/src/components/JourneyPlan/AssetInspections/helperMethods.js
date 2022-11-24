import { findTreeNode, oneLayerTreeItemsToObjects } from "../../../utils/treeData";
import _ from "lodash";
import moment from "moment";
export function assetTreeObjMethod(assetTreeDoc) {
  let assetTreeObj = null;
  if (assetTreeDoc) {
    assetTreeObj = assetTreeDoc.assetsTreeObj;
  }
  return assetTreeObj;
}
export function filterMethodForAssetsAndLocs(assetTree, locationsToConsider) {
  let dropDownFilterAssets = [];
  // assetList.forEach((asset) => {
  //   let checkLocState = _.find(locationsToConsider, { state: true, id: asset.locationId });
  //   if (checkLocState && asset.inspectable == true) {
  //   }
  // });
  if (assetTree) {
    locationsToConsider &&
      locationsToConsider.forEach((loc) => {
        // if (loc.id == "5ece789ad4cfcc01bc6f08ac") {
        if (loc.state == true) {
          let firstLevelLoc = {
            id: loc.id,
            title: loc.title,
            key: loc.id,
            children: [],
            inspectable: false,
          };
          let locTreeBranch = findTreeNode(assetTree, loc.id);
          getAndFillItems(locTreeBranch, firstLevelLoc);
          dropDownFilterAssets.push(firstLevelLoc);
        }
        // }
      });
  }
  return dropDownFilterAssets;
}

function getAndFillItems(locTreeBranch, firstLevelLoc) {
  if (locTreeBranch) {
    let assetListToShow = oneLayerTreeItemsToObjects(locTreeBranch);
    if (assetListToShow && assetListToShow.length > 0) {
      assetListToShow.forEach((asset) => {
        let assetToShow = {
          id: asset._id,
          title: asset.unitId,
          key: asset._id,
          children: [],
          inspectable: asset.inspectable,
        };
        let nextTreeBranch = findTreeNode(locTreeBranch, asset._id);
        getAndFillItems(nextTreeBranch, assetToShow);
        firstLevelLoc.children.push(assetToShow);
      });
    }
  }
}
export function handleSelectTestHelper(assetTestsState, assetTest, multi) {
  let assetTests = [...assetTestsState];
  if (multi) {
    let aTestIndex = _.findIndex({ _id: assetTest._id });
    if (aTestIndex > -1) {
      if (assetTests[aTestIndex].showTestExecs == undefined) {
        assetTests[aTestIndex].showTestExecs = false;
      }
      assetTests[aTestIndex].showTestExecs = !assetTests[aTestIndex].showTestExecs;
    }
    return assetTests;
  } else {
    assetTests.forEach((aTest) => {
      if (assetTest._id == aTest._id) {
        aTest.showTestExecs = true;
      } else {
        aTest.showTestExecs = false;
      }
    });
  }
  return assetTests;
}

export function fillOrRemoveTestExecsList(assetTest, testExecs, allTestExecs, selectedAsset, fetchTestExecs) {
  let list = [...testExecs];
  if (assetTest.showTestExecs) {
    let checkifAvailable = _.find(allTestExecs, {
      testCode: assetTest.testCode,
      assetId: selectedAsset && selectedAsset.id,
    });
    if (checkifAvailable) {
      let toShowExecs = _.filter(allTestExecs, {
        testCode: assetTest.testCode,
        assetId: selectedAsset && selectedAsset.id,
      });
      if (toShowExecs && toShowExecs.length > 0) {
        list = [...list, ...toShowExecs];
      }
    } else {
      fetchTestExecs(assetTest, selectedAsset);
    }
  } else {
    _.remove(list, {
      testCode: assetTest.testCode,
      assetId: selectedAsset && selectedAsset.id,
    });
  }
  return list;
}

export function validateDateRange(range) {
  if (!moment(range.from).isValid()) {
    return false;
  } else if (!moment(range.to).isValid()) {
    return false;
  } else if (!moment(range.today).isValid()) {
    return false;
  } else {
    return true;
  }
}

export function getFirstChildOfDropDownLocs(allItems) {
  let aItemsLength = allItems ? allItems.length : 0;
  let firstChild = {};
  for (let i = 0; i < aItemsLength; i++) {
    if (allItems[i].children[0]) {
      firstChild = allItems[i].children[0];
      break;
    }
  }
  return firstChild;
}
