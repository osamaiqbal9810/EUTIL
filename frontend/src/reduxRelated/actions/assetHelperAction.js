import * as types from "../ActionTypes/actionTypes.js";
import { CALL_API } from "../middleware/api";

export function getAssetLines() {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };

  return {
    [CALL_API]: {
      endpoint: "asset/getLines",
      authenticated: true,
      config: options,
      types: [types.GET_LINE_ASSETS_REQUEST, types.GET_LINE_ASSETS_SUCCESS, types.GET_LINE_ASSETS_FAILURE],
    },
  };
}
export function getAssetLinesWithSelf(criteria = { location: true, plannable: true }) {
  const options = {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    method: "POST",
    body: JSON.stringify({ criteria }),
  };

  return {
    [CALL_API]: {
      endpoint: "asset/getLinesWithSelf",
      authenticated: true,
      config: options,
      types: [types.GET_LINE_ASSETS_WITH_SELF_REQUEST, types.GET_LINE_ASSETS_WITH_SELF_SUCCESS, types.GET_LINE_ASSETS_WITH_SELF_FAILURE],
    },
  };
}
export function getAssetTypesAsset(asset) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  let assetObj = JSON.stringify({ assetType: asset.assetType, lineId: asset.lineId });
  return {
    [CALL_API]: {
      endpoint: "asset/getAssetTypesAsset/" + assetObj,
      authenticated: true,
      config: options,
      types: [types.GET_ASSETTYPES_ASSETS_REQUEST, types.GET_ASSETTYPES_ASSETS_SUCCESS, types.GET_ASSETTYPES_ASSETS_FAILURE],
    },
  };
}

export function getInspectableAssets() {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  return {
    [CALL_API]: {
      endpoint: "asset/getInspectableAssets",
      authenticated: true,
      config: options,
      types: [types.GET_INSPECTABLE_ASSETS_REQUEST, types.GET_INSPECTABLE_ASSETS_SUCCESS, types.GET_INSPECTABLE_ASSETS_FAILURE],
    },
  };
}

export function getUnAssignedAsset() {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  return {
    [CALL_API]: {
      endpoint: "asset/getUnAssignedAssets",
      authenticated: true,
      config: options,
      types: [types.GET_UNASSIGNED_ASSETS_REQUEST, types.GET_UNASSIGNED_ASSETS_SUCCESS, types.GET_UNASSIGNED_ASSETS_FAILURE],
    },
  };
}

export function getAssetTree() {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "GET" };
  return {
    [CALL_API]: {
      endpoint: "asset/getAssetTree",
      authenticated: true,
      config: options,
      types: [types.GET_ASSET_TREE_REQUEST, types.GET_ASSET_TREE_SUCCESS, types.GET_ASSET_TREE_FAILURE],
    },
  };
}

export function createMultipleAssets(assetsList) {
  const options = { headers: { "Content-Type": "application/json", Accept: "application/json" }, method: "POST", body: JSON.stringify({assetsList})};
  return {
    [CALL_API]: {
      endpoint: "asset/multiple",
      authenticated: true,
      config: options,
      types: [types.CREATE_MULTIPLE_ASSETS_REQUEST, types.CREATE_MULTIPLE_ASSETS_SUCCESS, types.CREATE_MULTIPLE_ASSETS_FAILURE],
    },
  };
}
