import React, { Component } from "react";
import { Row, Col, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { CommonSummaryStyles } from "components/Common/styles";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationDialog from "components/Common/ConfirmationDialog";
import permissionCheck from "utils/permissionCheck.js";
import { savePageNum, clearPageNum } from "reduxRelated/actions/utilActions";
import SpinnerLoader from "components/Common/SpinnerLoader";
import AssetsSummary from "components/Common/Summary/CommonSummary";
import AddAssets from "./AddAsset/AddAssets";
import ViewChangerComponent from "components/Common/ViewChangerComponent/ViewChangerComponent";
import { LIST_VIEW_SELECTION_TYPES, LIST_VIEW_SELECTION } from "./ViewSelection.js";
import AssetsList from "./AssetsList/AssetsList";
import GISList from "./AssetsList/GISList";
import MapBox from "components/GISMAP";
import AssetTypeFilter from "./AssetTypeFilter/AssetTypeFilter";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "components/Common/Buttons";
import { Tooltip } from "reactstrap";
import ViewAssetDetail from "components/LampAssets/ViewAssetDetail/ViewAssetDetail";
import { languageService } from "../../Language/language.service";
import { FORM_SUBMIT_TYPES, MODAL_TYPES } from "../../utils/globals";
import AllFilter from "./AllFilters/index";
import { getMultiLineData } from "reduxRelated/actions/lineSelectionAction";
import "./lamps.css";
import { arrowCircleLeft } from "react-icons-kit/fa/arrowCircleLeft";
import { arrowCircleRight } from "react-icons-kit/fa/arrowCircleRight";
import { isJSON } from "utils/isJson";
import AssetsDetail from "./AssetDetail";
import { Icon } from "react-icons-kit";
import { updateFilterState } from "reduxRelated/actions/filterStateAction";
import MenuFilterLink from "components/Common/MenuFilters/menuFilter";
import {
  arrayToTree,
  filterTreeByProperties,
  loadTreeObjects,
  TreeNode,
  findTreeNode,
  groupTreeNodeByProperty,
  treeToArray,
} from "utils/treeData";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonStyles } from "../../theme/commonStyles";
import { commonSummaryStyle } from "../Common/Summary/styles/CommonSummaryStyle";
import { commonFilterStyles } from "../Common/Filters/styles/CommonFilterStyle";
import GISLegend from "./GISLegend";
import AssetBuilder from "./AssetBuilder/AssetBuilder";
import { plus } from "react-icons-kit/icomoon/plus";
import SvgIcon from "react-icons-kit";
import { road } from "react-icons-kit/icomoon/road";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import { versionInfo } from "../MainPage/VersionInfo";
import { LocPrefixService } from "../LocationPrefixEditor/LocationPrefixService";
import * as turf from "@turf/turf";
import AssetEquipmentTreeView from "../AssetEquipmentTreeView";
import { uploadDocuments, downloadFileFromServer } from "reduxRelated/actions/documentUpload.js";
import { getServerEndpoint } from "utils/serverEndpoint";

const defaultMenuItem = "All";
const tableData = [
  {
    _id: "septa1",
    unitId: "septa1",
    name: "Septa 1",
    expanded: true,
  },
  {
    _id: "septa",
    unitId: "septa",
    name: "Septa",
    expanded: true,
  },
  {
    _id: "region1",
    unitId: "Region 1",
    name: "Region 1",
    parentAsset: "septa",
    expanded: true,
  },
  {
    _id: "region4",
    unitId: "Region 4",
    name: "Region 4",
    parentAsset: "septa",
    expanded: true,
  },
  {
    _id: "region2",
    unitId: "Region 2",
    name: "Region 2",
    parentAsset: "septa",
    expanded: true,
  },
  {
    _id: "line3",
    unitId: "Line 3",
    name: "Line 3",
    parentAsset: "region2",
    expanded: true,
  },
  {
    _id: "line2",
    unitId: "Line 2",
    name: "Line 2",
    parentAsset: "region2",
    expanded: true,
  },
  {
    _id: "line1",
    unitId: "Line 1",
    name: "Line 1",
    parentAsset: "region2",
    expanded: true,
  },
  {
    _id: "region3",
    unitId: "Region 3",
    name: "Region 3",
    parentAsset: "septa",
    expanded: true,
  },
];
const TEMPLATE_ASSETS_FILTERS = {
  // locationFilter: null,
  assetTypeFilters: null,
  defaultFilter: { assetType: "Default", filterState: true },
  currentAssetFilter: "Default",
  listViewDataToShow: LIST_VIEW_SELECTION_TYPES.AssetsView,
  gisSelectedAsset: null,
  gisSelectedLine: null,
};
class AssetsLamp extends Component {
  constructor(props) {
    super(props);
    this.assetsFilter = { ...TEMPLATE_ASSETS_FILTERS };
    if (this.props.assetsFilter) {
      this.assetsFilter = {
        defaultFilter: this.props.assetsFilter.defaultFilter,
        //     locationFilter: this.props.assetsFilter.locationFilter,
        assetTypeFilters: this.props.assetsFilter.assetTypeFilters,
        currentAssetFilter: this.props.assetsFilter.currentAssetFilter,
        listViewDataToShow: this.props.assetsFilter.listViewDataToShow,
        assetChildren: this.props.assetsFilter.assetChildren,
        gisSelectedAsset: this.props.assetsFilter.gisSelectedAsset,
        gisSelectedLine: this.props.assetsFilter.gisSelectedLine,
      };
    }
    this.state = {
      spinnerLoading: false,
      addModal: false,
      viewModal: false,
      deleteModal: false,
      selectedAssetToDetailView: null,
      modalState: "",
      assetsDataToShow: [], // redundant
      assetMarkerToShow: [],
      lineAsset: null,
      tooltipOpen: { addAsset: false, addTrack: false },
      assetsRight: -560,
      assetsDetail: -400,
      listViewDataToShow: LIST_VIEW_SELECTION_TYPES.AssetsView,
      showMultiLineData: false,
      multipleSelectedLinesIdsList: [],
      lineGroups: [],
      assetListToShow: [], // use this for hierarchy instead of previous used assetsDataToShow
      assetGroupByParent: {},
      assetGroupsByAssetTypes: {},
      ...this.assetsFilter,
      sorted: [],
      pageSize: 30,
      pages: 0,
      page: 0,
      plannableLocations: [],
      displayMenuAll: true,
      tempAssets: [],
      addModalTrack: false,
      openEquipmentDialog: false,
      inspections: 0
    };

    this.assetsByLine = [];
    this.equipmentTypes = [];
    this.handleAddEditModalClick = this.handleAddEditModalClick.bind(this);
    this.addAssetToParent = this.addAssetToParent.bind(this);
    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.handleContractClick = this.handleContractClick.bind(this);
    this.handleAssetTypeFilterClick = this.handleAssetTypeFilterClick.bind(this);
    this.assetTypeListSet = this.assetTypeListSet.bind(this);
    this.takeAssetTypeFromAddAsset = this.takeAssetTypeFromAddAsset.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleSelectedClick = this.handleSelectedClick.bind(this);
    this.editAsset = this.editAsset.bind(this);
    this.handleListViewSelection = this.handleListViewSelection.bind(this);
    this.viewAssetDetail = this.viewAssetDetail.bind(this);
    this.handleAssetsSideBarExpand = this.handleAssetsSideBarExpand.bind(this);
    this.handleDefaultAssets = this.handleDefaultAssets.bind(this);
    this.multipleLinesSelectHandler = this.multipleLinesSelectHandler.bind(this);
    // this.showLocationAsset = this.showLocationAsset.bind(this);
    this.clearLineFilter = this.clearLineFilter.bind(this);
    this.handleDetailSideBarExpand = this.handleDetailSideBarExpand.bind(this);
    this.onSortedChange = this.onSortedChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onColClick = this.onColClick.bind(this);
    this.sortTableData = this.sortTableData.bind(this);
    this.menuFilterApplied = this.menuFilterApplied.bind(this);
    this.handelMenuClickData = this.handelMenuClickData.bind(this);
    this.showToastError = this.showToastError.bind(this);
    this.showToastSuccess = this.showToastSuccess.bind(this);
    this.assetsToShowBasedOnLines = this.assetsToShowBasedOnLines.bind(this);
    this.handleSubmitFormTrackSetup = this.handleSubmitFormTrackSetup.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleAddEditModalClickTrackSetup = this.handleAddEditModalClickTrackSetup.bind(this);
    this.openEquipmentView = this.openEquipmentView.bind(this);
    this.openRelayView = this.openRelayView.bind(this);
    this.updateEquipmentData = this.updateEquipmentData.bind(this);
    //this.calculateAssetMarkerToShow = this.calculateAssetMarkerToShow.bind(this);

    // this.assetTypeFilter = <div onClick={this.handleAssetTypeFilterClick}> I am Button</div>

    this.loggedInUser = null;

  }

  componentDidMount() {
    const assetsFilter = this.props.assetsFilter;
    if (!assetsFilter) {
      this.props.updateFilterState("assetsFilter", {
        ...this.props.assetsFilter,
        defaultFilter: this.state.defaultFilter,
        //   locationFilter: this.state.locationFilter,
        assetTypeFilters: this.state.assetTypeFilters,
        currentAssetFilter: "Default",
        listViewDataToShow: this.state.listViewDataToShow,
      });
    } else {
      if (assetsFilter.assetTypeFilters) {
        this.assetTypeListSet(assetsFilter.assetTypeFilters);
      }
    }
    this.props.getAssets();
    let userObj = localStorage.getItem("loggedInUser");
    if (userObj) {
      const USER = isJSON(userObj);
      this.loggedInUser = USER;
    }

    // if (this.props.selectedLine._id) {
    //   this.props.getAsset();
    // } else {
    //   this.props.history.push("/line/assets");
    // }
    var treeObj = arrayToTree(tableData, "unitId", 0);
    // console.log(treeObj);
    // console.log(tableData);
    let tableData1 = [];
    //tableData1.push(treeObj.data);
    treeObj.walk(function () {
      tableData1.push(this.data);
    }, true);
    //console.log(this.props.assets);
    this.setState({ tempAssets: this.props.assets });

    this.props.getApplookups(["assetEquipmentTypes"]);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType == "ASSETS_READ_REQUEST" && this.props.actionType !== prevProps.actionType) {
      this.setState({ spinnerLoading: true });
    }
    if (this.props.actionType == "ASSETS_READ_FAILURE" && this.props.actionType !== prevProps.actionType) {
      this.setState({ spinnerLoading: false });
    }
    if (this.props.actionType == "ASSETS_READ_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      // this.props.assets && this.props.assets.assetsList && this.processMultilineAssetsForGIS(this.props.assets);

      this.props.assets && this.props.assets.assetsTypes && this.takeAssetTypeFromAddAsset(this.props.assets.assetsTypes);
      let assetTree = this.props.assets && this.props.assets.assetTree ? this.props.assets.assetTree : {};
      let assetGroupByParent = this.groupAssetsByParent(this.props.assets);
      let assetGroupsByAssetTypes = this.groupAssetsByAssetType(this.props.assets);
      let plannableLocationIds = assetTree ? this.findPlannableAssets(assetTree) : [];
      let plannableLocations = [];
      if (this.props.assets && this.props.assets.assetsList) {
        for (let a1 of this.props.assets.assetsList) {
          if (plannableLocationIds.includes(a1._id)) plannableLocations.push(a1);
        }
      }
      // if (this.props.showPlannableLocations) {
      //   plannableLocationIds.forEach(id => {
      //     let asset = _.find(this.props.assets, { _id: id });
      //     asset && plannableLocations.push(asset);
      //   });
      // } else {
      //   plannableLocationIds.forEach(id => {
      //     plannableLocations = [...plannableLocations, ...this.assetsToShowBasedOnTree(id, assetGroupByParent)];
      //   });
      // }
      if (this.loggedInUser) {
        // let assetsToShow = this.assetsToShowOnReceivingFromServer(assetGroupByParent, assetGroupsByAssetTypes);
        //console.log(this.props.assets);
        
        this.setState({
          assetTree: assetTree,
          // assetListToShow: assetsToShow,
          spinnerLoading: false,
          assetGroupByParent: assetGroupByParent,
          assetGroupsByAssetTypes: assetGroupsByAssetTypes,
          plannableLocations: plannableLocations,
        });

        if (this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.GIS) {
          this.handleListViewSelection(this.state.listViewDataToShow);
        }
      } else {
        /*  IMPORTANT TO DO : IF user is not assigned a location , show a message on the screen about it that no asset are available to this user*/
        this.setState({
          spinnerLoading: false,
        });
      }
    }
    if (this.props.actionType == "ASSET_CREATE_REQUEST" && this.props.actionType !== prevProps.actionType) {
      //      this.props.getAssets();
      this.setState({
        spinnerLoading: true,
      });
    }
    if (this.props.actionType == "ASSET_CREATE_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      this.props.getAssets();
      this.setState({
        spinnerLoading: true,
      });
      this.showToastSuccess(languageService("Asset Added Successfully"));
    }
    if (
      this.props.assetHelperActionType === "CREATE_MULTIPLE_ASSETS_SUCCESS" &&
      this.props.assetHelperActionType !== prevProps.assetHelperActionType
    ) {
      this.props.getAssets();
      this.setState({
        spinnerLoading: true,
      });
      // this.showToastSuccess(languageService("Asset Added Successfully"));
    }
    if (this.props.actionType == "ASSET_UPDATE_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      this.props.getAssets();
      this.showToastSuccess(languageService("Asset Updated Successfully"));
    }

    if (this.props.actionType == "ASSET_DELETE_SUCCESS" && this.props.actionType !== prevProps.actionType) {
      this.props.getAssets();
      this.showToastSuccess(languageService("Asset Removed Successfully"));
    }
    if (this.props.actionType == "ASSETS_DELETE_FAILURE" && this.props.actionType !== prevProps.actionType) {
      this.setState({ spinnerLoading: false });
      this.showToastError(languageService("Unable to Remove Asset!"));
    }

    if (
      prevProps.lineSelectionActionType !== this.props.lineSelectionActionType &&
      this.props.lineSelectionActionType == "GET_MULTIPLE_LINES_DATA_SUCCESS"
    ) {
      let assetsDataToShow = [...this.props.multiData];
      if (this.state.defaultFilter.filterState == false) {
        assetsDataToShow = this.showFilteredAssets(this.state.currentAssetFilter, assetsDataToShow);
      } else {
        assetsDataToShow = this.calculateAssetDataToShowFromAllAssets(this.props.assets, this.state.multipleSelectedLinesIdsList);
      }
      this.setState({
        spinnerLoading: false,
        assetsDataToShow: assetsDataToShow,
        showMultiLineData: true,
      });
    }
    if (this.props.applookupActionType === "APPLOOKUPS_READ_SUCCESS" && this.props.applookupActionType !== prevProps.applookupActionType) {
      this.equipmentTypes = this.props.applookups
        .filter((f) => f.listName === "assetEquipmentTypes")
        .map((al) => {
          return { id: al._id, type: al.description, schema: al.opt1.schema, iconGroup: al.opt1.iconGroup };
        });
    }
  }
  showToastSuccess(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  showToastError(message, error) {
    toast.error(message + ": " + error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  findPlannableAssets(assetTree) {
    let plannableLocations = [];
    if (filterTreeByProperties(assetTree, { location: true, plannable: true }, plannableLocations)) {
      if (this.loggedInUser.assignedLocation) plannableLocations.push(this.loggedInUser.assignedLocation);
    }
    return plannableLocations;
  }
  // assetsToShowOnReceivingFromServer(assetGroupByParent, assetGroupsByAssetTypes) {
  //   let assetsToShow = [];
  //   if (this.state.defaultFilter.filterState) {
  //     if (this.state.locationFilter) {
  //       assetsToShow = this.defaultFilterWithLocation(assetGroupByParent);
  //     } else {
  //       assetsToShow = this.assetsToShowBasedOnTree(this.loggedInUser.assignedLocation, assetGroupByParent);
  //     }
  //   } else {
  //     let activeAssetType = this.state.currentAssetFilter.assetType;
  //     if (this.state.locationFilter) {
  //       assetsToShow = this.assetTypeFilterWithLocation(activeAssetType, assetGroupsByAssetTypes);
  //     } else {
  //       assetsToShow = this.assetsToShowBasedOnFilter(activeAssetType, assetGroupsByAssetTypes);
  //     }
  //   }
  //   return assetsToShow;
  // }
  assetsToShowBasedOnTree(parentId, assetGroups) {
    let assets = assetGroups[parentId] ? assetGroups[parentId] : [];
    return assets;
  }

  groupAssetsByParent(assetsObj) {
    let groups = {};
    if (assetsObj && assetsObj.assetsList) {
      groups = _.groupBy(assetsObj.assetsList, "parentAsset");
    }
    return groups;
  }
  groupAssetsByAssetType(assetsObj) {
    let assetTypeGroups = {};
    if (assetsObj && assetsObj.assetsList) {
      assetTypeGroups = _.groupBy(assetsObj.assetsList, "assetType");
    }
    return assetTypeGroups;
  }

  assetsToShowBasedOnFilter(assetType, assetGroupsByAssetTypes, locationsFilterList = []) {
    let assetsTypeAssets = assetGroupsByAssetTypes[assetType] ? assetGroupsByAssetTypes[assetType] : [];
    let assetsIds = [];
    let found = filterTreeByProperties(
      this.props.assets && this.props.assets.assetTree ? this.props.assets.assetTree : {},
      { assetType: assetType },
      assetsIds,
      true,
    );
    let assets = [];
    if (assetsTypeAssets) {
      locationsFilterList.forEach((loc) => {
        loc.state &&
          _.filter(assetsIds, (aObj) => {
            if (aObj.properties.locationId == loc.id) {
              let asset = _.find(assetsTypeAssets, (assetObj) => {
                if (assetObj._id == aObj.id) {
                  assetObj.locationName = loc.title;
                  assetObj.locationId = loc.id;
                  return true;
                }
                return false;
              });
              asset && assets.push(asset);
            }
          });
        // assetsIds.forEach(obj => {
        //   if (obj.properties && obj.properties.locationId == loc.id) {
        //     let asset = _.find(assetsTypeAssets, { _id: obj.id });
        //     if (asset) {
        //       assets.push(asset);
        //     }
        //   }
        // });
      });
    }

    return assets;
  }

  calculateAssetDataToShowFromAllAssets(receivedAssets, limitedLines) {
    let assetsDataToShow = [];
    let assetsProps = [...receivedAssets];

    // assetsProps.forEach((asset, index) => {
    //   if (assetsProps[index].childAsset[0] === null || assetsProps[index].childAsset[0] === "") {
    //     assetsProps[index].childAsset.pop();
    //   }
    //   if (!asset.lineId) {
    //     checkAndAddAssetInList(limitedLines, asset, assetsDataToShow);
    //   }
    //   let parentResultIndex = _.findIndex(assetsProps, {
    //     _id: asset.parentAsset,
    //   });
    //   if (parentResultIndex > -1) {
    //     assetsProps[parentResultIndex].childAsset.push(asset._id);
    //   }
    // });

    return assetsDataToShow;
  }
  handleAssetsSideBarExpand() {
    if (this.state.assetsRight == 0) {
      this.setState({ assetsRight: -590 });
      setTimeout(
        function () {
          //Start the timer
          this.setState({ assetsRight: -560 }); //After 1 second, set render to true
        }.bind(this),
        1000,
      );
    } else {
      this.setState({ assetsRight: -590 });
      setTimeout(
        function () {
          //Start the timer
          this.setState({ assetsRight: 0 }); //After 1 second, set render to true
        }.bind(this),
        1000,
      );
    }
  }
  handleDetailSideBarExpand() {
    if (this.state.assetsDetail == 0) {
      this.setState({ assetsDetail: -430 });
      setTimeout(
        function () {
          //Start the timer
          this.setState({ assetsDetail: -400 }); //After 1 second, set render to true
        }.bind(this),
        1000,
      );
    } else {
      this.setState({ assetsDetail: -430 });
      setTimeout(
        function () {
          //Start the timer
          this.setState({ assetsDetail: 0 }); //After 1 second, set render to true
        }.bind(this),
        1000,
      );
    }
  }

  openEquipmentView(open, asset) {
    this.setState({ openEquipmentDialog: open, selectedAsset: asset });
  }
  openRelayView(open, asset) {
    this.setState({ openEquipmentDialog: open, selectedAsset: asset });
  }
  updateEquipmentData(equipments, files) {
    // todo: Amir - update equipments on backend
    // console.log({equipments, files});
    let { selectedAsset } = this.state;
    let asset  = { ...selectedAsset, equipments };
    // console.log({asset});
    this.props.updateAsset(asset);

    if(files && files.length) {
      for(let file of files) {
      const filename = file["url-rel"];
      file.file.originalname = filename;
      this.props.uploadDocuments(file.file, "uploadequipmentdata");
      }
    }

  }
  handleAddEditModalClick(modalState, asset) {
    //console.log(modalState)
    let selectedAsset = null;
    if (asset) {
      selectedAsset = asset;
    }
    //  else if (!selectedAsset && this.props.assets && this.props.assets.assetTree && modalState == "Add" && this.loggedInUser) {
    //   //  selectedAsset = _.find(this.props.assets.assetsList, { _id: this.loggedInUser ? this.loggedInUser.assignedLocation : "" });
    //   selectedAsset = {
    //     _id: this.loggedInUser.assignedLocation,
    //     assetType: this.props.assets.assetTree[Object.keys(this.props.assets.assetTree)[0]].properties.assetType,
    //     unitId: this.props.assets.assetTree[Object.keys(this.props.assets.assetTree)[0]].properties.unitId,
    //   };
    // }
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedAsset: selectedAsset,
      parentAssetSelected: selectedAsset,
    });
  }
  handleAddEditModalClickTrackSetup() {
    this.setState({
      addModalTrack: !this.state.addModalTrack,
    });
  }
  addAssetToParent(modalState, asset) {
    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      parentAssetSelected: asset,
    });
  }
  editAsset(modalState, asset) {
    let parentAsset =
      this && this.props && this.props.assets && this.props.assets.assetsList && this.props.assets.assetsList.length
        ? this.props.assets.assetsList.find((a1) => {
            return a1._id === asset.parentAsset;
          })
        : {};

    this.setState({
      addModal: !this.state.addModal,
      modalState: modalState,
      selectedAsset: asset,
      parentAssetSelected: parentAsset,
    });
  }

  handleSubmitForm = (asset, formType) => {
    let { selectedAsset } = this.state;

    if (formType === FORM_SUBMIT_TYPES.ADD) {
      if (this.state.parentAssetSelected) {
        asset.parentAsset = this.state.parentAssetSelected._id;
      } else {
        !asset.parentAsset && (asset.parentAsset = asset.lineId);
      }

      this.props.createAsset(asset);
    }

    if (formType === FORM_SUBMIT_TYPES.EDIT) {
      asset = { ...selectedAsset, ...asset };

      this.props.updateAsset(asset);
    }

    this.setState({
      addModal: !this.state.addModal,
      modalState: "None",
      selectedAsset: null,
      parentAssetSelected: null,
    });
  };
  handleSubmitFormTrackSetup = (asset, formType) => {
    if (formType === FORM_SUBMIT_TYPES.ADD) {
      this.props.createAsset(asset);
    }
    this.handleAddEditModalClickTrackSetup();
  };
  handleSelectedClick(event, rowInfo) {
    //console.log(this.state.selectedAsset, "::", rowInfo.original);
    // this.setState({
    //   selectedAsset: rowInfo.original,
    // });
    let selectedAsset = rowInfo.original;
    let lineGroups = _.cloneDeep(this.state.lineGroups);

    if (lineGroups) {
      // let lg = lineGroups.find(l1 => {
      //   return l1.baseLine._id == selectedAsset.lineId;
      // });
      let lg = null;
      for (let plocKey in this.assetsByLine) {
        let assetsList = this.assetsByLine[plocKey];
        if (
          assetsList &&
          Array.isArray(assetsList) &&
          assetsList.find((a) => {
            return a._id == selectedAsset._id;
          })
        ) {
          lg = lineGroups.find((lg) => {
            return lg.baseLine._id === plocKey;
          });
        }
      }
      if (lg) {
        let a = null;
        if (lg.lines)
          a = lg.lines.find((l) => {
            return l._id === selectedAsset._id;
          });

        if (!a && lg.points)
          a = lg.points.find((l) => {
            return l._id === selectedAsset._id;
          });

        if (a) {
          a.visible = true;

          // console.log('asset clicked: ', a);
          //let selectedAsset = a;
          let selectedLine = lg.baseLine;
          this.saveFilterState({ gisSelectedAsset: selectedAsset, gisSelectedLine: selectedLine });
          this.setState({ lineGroups: lineGroups, gisSelectedAsset: a, gisSelectedLine: selectedLine });
          //this.setState({ lineGroups: lineGroups, gisSelectedAsset: {asset: selectedAsset, gis: a}, gisSelectedLine: selectedLine });
        }
      }
    }
  }

  saveFilterState(fsPart) {
    this.props.updateFilterState("assetsFilter", {
      ...this.props.assetsFilter,
      ...fsPart,
    });
  }

  handleExpandClick(assetClicked) {
    let indexAsset = _.findIndex(this.state.assetListToShow, {
      _id: assetClicked._id,
    });
    if (indexAsset > -1) {
      let copyAssetsToShow = [...this.state.assetListToShow];

      let _childAssetsToExpand = this.assetsToShowBasedOnTree(assetClicked._id, this.state.assetGroupByParent);
      _childAssetsToExpand.forEach((childAsset) => {
        childAsset.locationId = assetClicked.locationId;
        childAsset.locationName = assetClicked.locationName;
      });
      // let assetsInQ = this.props.assets && this.props.assets.assetsList ? this.props.assets.assetsList : [];
      // let clickedAsset = _.find(assetsInQ, { _id: assetClicked._id });

      // // let checkIfParentLineClicked = false;
      // // if (!clickedAsset.lineId) {
      // //   checkIfParentLineClicked = true;
      // // }

      // assetsInQ.forEach(asset => {
      //   // let checkCriteria = checkIfParentLineClicked
      //   //   ? !asset.parentAsset && asset.lineId == assetClicked._id
      //   //   : asset.parentAsset == assetClicked._id;
      //   if (asset.parentAsset == assetClicked._id) {
      //     asset.paddingLeft = 10 + (assetClicked.paddingLeft ? assetClicked.paddingLeft : 0);
      //     asset.expanded = false;
      //     childAssetsToExpand.push(asset);
      //   }
      // });
      let sorted = this.state.sorted;
      let ordering = sorted[0] ? (sorted[0].desc ? "desc" : "asc") : "";

      let childAssetsToExpand = sorted[0] ? _.orderBy(_childAssetsToExpand, [sorted[0].id], [ordering]) : _childAssetsToExpand;
      //console.log(_childAssetsToExpand);
      //console.log(childAssetsToExpand);
      childAssetsToExpand.forEach((asset) => {
        asset.paddingLeft = 10 + (assetClicked.paddingLeft ? assetClicked.paddingLeft : 0);
      });

      copyAssetsToShow[indexAsset].expanded = true;
      copyAssetsToShow.splice(indexAsset + 1, 0, ...childAssetsToExpand);

      const { pageSize } = this.state;

      let dataLen = copyAssetsToShow.length;
      var _pages = parseInt(dataLen / pageSize) != dataLen / pageSize ? parseInt(dataLen / pageSize) + 1 : dataLen / pageSize;

      this.setState({
        assetListToShow: copyAssetsToShow,
        pages: _pages,
      });
    }
  }
  handleContractClick(assetClicked) {
    let copyAssetsToShow = [...this.state.assetListToShow];
    let indexAsset = _.findIndex(this.state.assetListToShow, {
      _id: assetClicked._id,
    });
    if (indexAsset > -1) {
      let sortProperties = this.state.sorted;
      const orderByDirection = sortProperties[0] ? (sortProperties[0].desc ? 1 : 0) : 0;
      const orderFieldName = sortProperties[0] ? sortProperties[0].id : "";
      var treeObj = arrayToTree(copyAssetsToShow, orderFieldName, orderByDirection);
      let sortedAssets = [];
      //sortedAssets.push(treeObj.data);
      treeObj.exclude(
        function () {
          sortedAssets.push(this.data);
        },
        assetClicked._id,
        true,
      );

      let indexAsset1 = _.findIndex(sortedAssets, {
        _id: assetClicked._id,
      });
      if (indexAsset1 > -1) {
        sortedAssets[indexAsset1].expanded = false;
      }

      const { pageSize } = this.state;

      let dataLen = sortedAssets.length;
      var _pages = parseInt(dataLen / pageSize) != dataLen / pageSize ? parseInt(dataLen / pageSize) + 1 : dataLen / pageSize;

      this.setState({
        assetListToShow: sortedAssets,
        pages: _pages,
      });

      //let assetsToRemove = this.assetsToShowBasedOnTree(assetClicked._id, this.state.assetGroupByParent);
      //let removeLength = this.assetsContractBasedOnTree(assetClicked._id, this.state.assetGroupByParent);
      // assetsToRemove.forEach(asset => {
      //   if (asset.expanded) {
      //     let expandedAssetToRemoveFromList = this.assetsToShowBasedOnTree(asset._id, this.state.assetGroupByParent);
      //     assetsToRemove = [...assetsToRemove, ...expandedAssetToRemoveFromList];
      //   }
      // });

      // copyAssetsToShow.splice(indexAsset + 1, removeLength);

      // let copyAssetsToShow = [...this.state.assetsDataToShow];
      // let removedAssets = [];
      // let clickedAsset = _.find(this.state.assetsDataToShow, { _id: assetClicked._id });
      // let checkIfParentLineClicked = false;
      // if (!clickedAsset.lineId) {
      //   checkIfParentLineClicked = true;
      // }
      // _.remove(copyAssetsToShow, asset => {
      //   let assetToRemove = false;
      //   let checkCriteria = checkIfParentLineClicked
      //     ? !asset.parentAsset && asset.lineId == assetClicked._id
      //     : asset.parentAsset == assetClicked._id;
      //   if (checkCriteria) {
      //     assetToRemove = true;
      //     removedAssets.push(asset);
      //   }
      //   removedAssets.forEach(rasset => {
      //     if (asset.parentAsset == rasset._id) {
      //       assetToRemove = true;
      //     }
      //   });
      //   return assetToRemove;
      // });

      // copyAssetsToShow[indexAsset].expanded = false;

      /*
      this.setState({
        assetListToShow: copyAssetsToShow,
      });*/
    }
  }

  assetsContractBasedOnTree(id, assetGroups) {
    let asstLength = this.recursivelyFindAssetsToContractInTree(id, assetGroups, 0);
    return asstLength;
  }
  recursivelyFindAssetsToContractInTree(id, assetGroups, asstLength) {
    let assets = assetGroups[id] ? assetGroups[id] : [];
    let recurLength = 0;
    assets.forEach((asset) => {
      if (asset.expanded) {
        asset.expanded = false;
        recurLength = this.recursivelyFindAssetsToContractInTree(asset._id, assetGroups, asstLength);
      }
    });
    asstLength = recurLength + assets.length;
    return asstLength;
  }

  handleAssetTypeFilterClick(assetType, assetsToShow) {
    let assetTypeFilters = _.cloneDeep(this.state.assetTypeFilters);
    let defaultFilter = { ...this.state.defaultFilter };
    let currentAssetFilter = this.state.currentAssetFilter;
    !assetsToShow && (assetsToShow = []);
    let displayNotAll = _.find(this.state.assetChildren, { state: false });
    let assetGroupByParent = this.groupAssetsByParent(this.props.assets);

    if (assetType.assetType == "Default") {
      this.state.plannableLocations.forEach((loc) => {
        let checkIfAllow = _.find(this.state.assetChildren, { id: loc._id, state: true });
        if (checkIfAllow) {
          let assetOfLoc = this.assetsToShowBasedOnTree(loc._id, assetGroupByParent);
          assetOfLoc.forEach((assetObj) => {
            assetObj.locationName = loc.unitId;
            assetObj.locationId = loc._id;
          });
          assetOfLoc = this.filterOutLocations(assetOfLoc);
          assetsToShow = [...assetsToShow, ...assetOfLoc];
        }
      });
      defaultFilter.filterState = true;
      if (assetTypeFilters) {
        assetTypeFilters.forEach((atFilter) => {
          atFilter.filterState = false;
        });
      }
      currentAssetFilter = "Default";
    } else {
      assetsToShow = this.assetsToShowBasedOnFilter(assetType.assetType, this.state.assetGroupsByAssetTypes, this.state.assetChildren);
      assetTypeFilters.forEach((atFilter) => {
        if (atFilter._id == assetType._id) {
          atFilter.filterState = true;
        } else {
          atFilter.filterState = false;
        }
      });
      defaultFilter.filterState = false;
      currentAssetFilter = assetType;
    }
    this.closeExpandedAssets(assetsToShow);
    this.setState({
      defaultFilter: defaultFilter,
      assetListToShow: assetsToShow,
      currentAssetFilter: currentAssetFilter,
    });
    if (this.pageResetHandler) {
      this.pageResetHandler();
    }

    let aTypeFilters = this.assetTypeListSet(assetTypeFilters);
    this.props.updateFilterState("assetsFilter", {
      ...this.props.assetsFilter,
      defaultFilter: defaultFilter,
      assetTypeFilters: aTypeFilters,
      currentAssetFilter: currentAssetFilter,
    });
  }
  filterOutLocations(assets) {
    let locationAssetTypes = this.props.assets.assetsTypes.map((at) => {
      return at.location ? at.assetType : null;
    });
    assets = assets.filter((a) => {
      return !locationAssetTypes.includes(a.assetType);
    });
    return assets;
  }
  defaultFilterWithLocation(assetGroupByParent) {
    let assetsToShow = [];
    this.state.locationFilter.locations.forEach((loc) => {
      let locAssetsToShow = this.assetsToShowBasedOnTree(loc, assetGroupByParent);
      assetsToShow = [...assetsToShow, ...locAssetsToShow];
    });
    return assetsToShow;
  }
  assetTypeFilterWithLocation(assetType, assetGroupsByAssetTypes) {
    let assetsToShow = [];
    let allAssetOfAssetType = this.assetsToShowBasedOnFilter(assetType, assetGroupsByAssetTypes);
    allAssetOfAssetType.forEach((asset) => {
      let findAssetExist = _.find(this.state.locationFilter.locations, (e) => {
        return e == asset.lineId;
      });
      if (findAssetExist) {
        assetsToShow.push(asset);
      }
    });
    return assetsToShow;
  }

  closeExpandedAssets(assetsToShow) {
    assetsToShow.forEach((element) => {
      element.expanded = false;
    });
  }
  assetTypeListSet(assetTypesProps) {
    let assetTypeFilterComp = null;
    let assetTypes = _.cloneDeep(assetTypesProps);
    if (assetTypes) {
      let assetTypesLength = assetTypes.length;
      assetTypes = assetTypes.filter((at) => {
        return !at.location;
      }); // do not mix locations and asset types
      let sortedATypes = _.sortBy(assetTypes, "sortOrder");
      assetTypeFilterComp = sortedATypes.map((assetType, index) => {
        //   assetType.filterState = true
        return (
          <div style={{ display: "inline-block" }} key={assetType._id}>
            <AssetTypeFilter
              assetType={assetType}
              filterState={assetType.filterState}
              handleAssetTypeFilterClick={this.handleAssetTypeFilterClick}
            />
            {index !== assetTypesLength - 1 && <div style={themeService(commonFilterStyles.divider)}> | </div>}
          </div>
        );
      });
    }
    this.setState({
      assetTypeFilterComponent: assetTypeFilterComp,
      assetTypeFilters: assetTypes,
    });
    return assetTypes;
  }

  showFilteredAssets(filterAssetType, assetsDataToShow) {
    // let assetsInQ = this.props.assets;
    // if (this.state.showMultiLineData) {
    //   assetsInQ = this.props.multiData;
    // }
    // let assetsDataToShow = [...assetsInQ];
    _.remove(assetsDataToShow, (asset) => {
      return asset.assetType !== filterAssetType.assetType;
    });
    return assetsDataToShow;
  }

  toggleTooltip(name) {
    this.setState({
      tooltipOpen: { ...this.state.tooltipOpen, [name]: !this.state.tooltipOpen[name] },
    });
  }

  deleteAsset = (asset) => {
    this.setState({
      deleteModal: !this.state.deleteModal,
      selectedAssetToDetailView: asset,
    });
  };

  viewAssetDetail(asset) {
    this.setState({
      viewModal: !this.state.viewModal,
      selectedAssetToDetailView: asset,
    });
  }
  handleListViewSelection = (listViewDataToShow) => {
    if (listViewDataToShow === LIST_VIEW_SELECTION_TYPES.GIS) {
      if (this.props.assets && this.props.assets.assetsList) {
        //console.log(this);
        this.processMultilineAssetsForGIS(this.props.assets);
      }
    } else {
      this.setState({ gisSelectedAsset: null, gisSelectedLine: null });
    }

    this.props.updateFilterState("assetsFilter", {
      ...this.props.assetsFilter,

      listViewDataToShow: listViewDataToShow,
    });
    this.setState({ listViewDataToShow });
  };
  handleConfirmation = (response) => {
    if (response) {
      this.props.deleteAsset({ _id: this.state.selectedAssetToDetailView._id });
    }

    this.setState(({ deleteModal }) => ({
      selectedAssetToDetailView: null,
      deleteModal: !deleteModal,
    }));
  };
  handleDefaultAssets() {
    let assetsDataToShow = this.calculateAssetDataToShowFromAllAssets(this.props.assets);

    if (this.state.defaultFilter.filterState == false) {
      assetsDataToShow = this.showFilteredAssets(this.state.currentAssetFilter, assetsDataToShow);
      this.setState({
        assetsDataToShow: assetsDataToShow,
        showMultiLineData: false,
      });
    } else {
      this.setState({
        assetsDataToShow: assetsDataToShow,
        showMultiLineData: false,
      });
    }
  }
  getAssetsInQ() {
    let assetsInQ = [...this.props.assets];
    if (this.state.showMultiLineData) {
      assetsInQ = [...this.props.multiData];
    }
    return assetsInQ;
  }

  multipleLinesSelectHandler(lines, apiCallName) {
    // console.log("lines : ", lines);
    this.setState({
      multipleSelectedLinesIdsList: lines,
    });
    this.props.getMultiLineData(lines, apiCallName);
  }

  makePopupMsg(asset, prefix) {
    let textcolor = "black",
      color = "black";
    let checkedMs = [];
    let colors = [
      "#E53935",
      "#D81B60",
      "#8E24AA",
      "#5E35B1",
      "#3949AB",
      "#1E88E5",
      "#039BE5",
      "#00ACC1",
      "#00897B",
      "#43A047",
      "#7CB342",
      "#C0CA33",
      "#FDD835",
      "#FFB300",
      "#FB8C00",
      "#F4511E",
      "#6D4C41",
      "#757575",
      "#546E7A",
    ]; //['black', 'green', 'red', 'blue','cyan', 'magenta'];
    let textStyle = {
      color: "var(--first)",
      fontSize: "12px",
      fontFamily: "Arial",
      letterSpacing: "0.3px",
    };
    let headingStyle = {
      float: "left",
      fontFamily: "Arial",
      fontSize: "18px",
      letterSpacing: "0.95px",
      color: "var(--first)",
      borderBottom: "1px solid rgb(209, 209, 209)",
      display: "block",
      width: "100%",
    };
    let attributes = [];
    if (asset.attributes) {
      for (let k in asset.attributes) {
        if (k !== "geoJsonCord" && k !== "adjCoordinates")
          // todo: eliminate this hard code condition and take this from attributes data
          attributes.push(<div key={asset.unitId + k.toString()}>{k.toString() + ": " + asset.attributes[k].toString()}</div>);
      }
    }
    let endShown = asset.end ? " to " : "";
    return (
      <div key={asset.unitId}>
        <h4 style={headingStyle}>{asset.name ? asset.name : asset.unitId}</h4>
        <div style={textStyle}>
          <div>
            <strong>{languageService("Type")}:</strong> {asset.assetType ? asset.assetType : "unknown"}
          </div>
          <div>{attributes}</div>
          <div>
            <strong>{languageService("Location")}:</strong> {(prefix.startPrefix ? prefix.startPrefix : "") + asset.start}
            {endShown ? endShown + (prefix.endPrefix ? prefix.endPrefix : "") + asset.end : ""}
          </div>
          <div style={{ maxWidth: "200px", marginBottom: "10px", textAlign: "justify" }}>{asset.description ? asset.description : ""}</div>

          {/* <Link style={{ float: "right", textDecoration: "none" }} to={url}><span style={{
              color: "var(--first)",
              fontSize: "12px",
              fontFamily: "Arial",
              letterSpacing: "0.3px"
            }}>View</span></Link> */}
        </div>
      </div>
    );
  }
  getChildAssets(assetId, allAssets) {
    let tn = findTreeNode(allAssets.assetTree, assetId);
    let childrenIds = treeToArray(tn);
    let childAssets = allAssets.assetsList.filter((a) => {
      return childrenIds && childrenIds.length && childrenIds.includes(a._id);
    });

    return childAssets ? childAssets : [];
  }
  getChildGeoJsonObj(geojson, distance) {
    try {
      let d = +distance;
      if (isNaN(d)) return null;
      if (typeof geojson === "string") geojson = JSON.parse(geojson);

      var linestring1 = turf.lineString(geojson.features[0].geometry.coordinates, { name: "line 1" });
      let geoJsonData = turf.along(linestring1, d, { units: "miles" });

      return geoJsonData;
    } catch (err) {
      console.log("LampAssets.index.getChildGeoJsonobj.catch", err);
    }
    return null;
  }

  processMultilineAssetsForGIS(allAssets) {
    // Find plannable locations
    let baseLineIds = this.findPlannableAssets(allAssets.assetTree);
    let baseLines = allAssets.assetsList.filter((a) => {
      return baseLineIds.includes(a._id);
    });

    // Get child assets for each line and store
    this.assetsByLine = [];
    for (let ploc of baseLineIds) {
      let childAssets = this.getChildAssets(ploc, allAssets);
      this.assetsByLine[ploc] = childAssets;
    }

    // let assetsByLine = _.groupBy(allAssets.assetsList, "lineId");
    // let baseLineIds = Object.keys(assetsByLine);
    // let baseLines = assetsByLine[undefined];

    let lineGroups = [],
      geoJsonMap = new Map(),
      gisLegend = [{ text: "{Selected}", color: "#4790E5" }];

    let selectedLine = this.state.gisSelectedLine,
      selectedAsset = this.state.gisSelectedAsset;

    let visibleTypes = {
      line: true,
      track: true,
      rail: false,
      "3rd Rail": false,
      "Catenary Power": false,
      Switch: true,
      Crossing: true,
      Station: true,
      other: true,
    };

    let colors = {
      line: "#E53935",
      track: "#D81B60",
      rail: "#8E24AA",
      "3rd Rail": "#5E35B1",
      Switch: "#3949AB",
      Crossing: "#0D1271",
      Station: "#0354C7",
      other: "#546E7A",
    };
    let imagesByType = {
      line: "track.png",
      track: "track.png",
      rail: "track.png",
      "3rd Rail": "track.png",
      Switch: "switch-both.png",
      Crossing: "crossing.png",
      Station: "station-low.png",
      other: "train1.png",
    };

    //, '#00ACC1', '#00897B','#43A047', '#7CB342', '#C0CA33', '#FDD835', '#FFB300', '#FB8C00', '#F4511E', '#6D4C41', '#757575', '#546E7A'};

    for (let baseLineId of baseLineIds) {
      if (baseLineId !== "undefined") {
        let assets = this.assetsByLine[baseLineId];
        let baseLine = baseLines.find((l) => {
          return l._id === baseLineId;
        });
        let linearAssets = [],
          pointAssets = [],
          typeMap = new Map();

        const defaultTypeOffset = 0; // offset is causing outliers so blocking it for now in assets
        let assetColor = colors["other"];
        let baseLineGISExist =
          baseLine.attributes && baseLine.attributes.geoJsonCord !== undefined && baseLine.attributes.geoJsonCord !== null;

        if (baseLineGISExist) {
          geoJsonMap.set(baseLine._id, baseLine.attributes.geoJsonCord);
        }
        // if baseLine data is valid
        for (let a1 of assets) {
          let startPrefix = LocPrefixService.getPrefixMp(a1.start, a1.lineId);
          let endPrefix = LocPrefixService.getPrefixMp(a1.end, a1.lineId);
          let visible = visibleTypes["other"];
          if (visibleTypes[a1.assetType]) visible = visibleTypes[a1.assetType];
          if (!visible) continue; // hide some asset types

          if (colors[a1.assetType]) assetColor = colors[a1.assetType];
          else assetColor = colors["other"];

          //let lineWidth = (a1.assetType==='track') ? 2 : 10;
          let ownGeoJson = null;

          if (a1.start > -1 && a1.end !== null && a1.start !== a1.end) {
            if (a1.attributes && a1.attributes.geoJsonCord) {
              // if this asset has its own geoJsonCord then use its own, otherwise use the baseLine's.
              ownGeoJson = a1.attributes.geoJsonCord;
              // this asset has its own geojson see if it has children then use  it as a baseline
            }

            if (
              !gisLegend.find((o) => {
                return o.text === a1.assetType;
              })
            ) {
              gisLegend.push({ text: a1.assetType, color: assetColor });
            }

            // let atOffset = typeMap.get(a1.assetType); // offset is causing outliers, so blocking it for now in assets
            // if (!atOffset) {
            //   typeMap.set(a1.assetType, defaultTypeOffset);
            //   atOffset = defaultTypeOffset;
            //   typeMap.set(a1.assetType, -atOffset);
            // }
            // let offset = (typeMap.size * atOffset) / 2;
            let msg = this.makePopupMsg(a1, { startPrefix: startPrefix, endPrefix: endPrefix });
            // console.log('asset', a1.unitId, 'offset', offset, atOffset, typeMap.size);
            let assetData = {
              start: a1.start,
              end: a1.end,
              color: assetColor,
              text: a1.unitId,
              visible: true,
              _id: a1._id,

              // offset: offset,
              msg: msg,
            };

            if (ownGeoJson) {
              assetData.geoJsonCord = ownGeoJson;
              geoJsonMap.set(a1._id, assetData.geoJsonCord);
            } else if (a1.parentAsset && geoJsonMap.has(a1.parentAsset)) {
              // todo && config allows to inherit the geoJson
              assetData.geoJsonCord = geoJsonMap.get(a1.parentAsset); // inherit geoJson from parent
            } else {
              console.log(
                "LampAssets.processMultilineAssetsForGIS.cannot find geoJson, neither for self nor for parent, no GIS representation asset:",
                a1.unitId,
              );
              continue;
            }

            linearAssets.push(assetData);
            if (!selectedAsset) {
              selectedAsset = _.cloneDeep(assetData);
              selectedLine = _.cloneDeep(baseLine);
            }
          } else {
            let img = imagesByType["other"];
            if (imagesByType[a1.assetType]) img = imagesByType[a1.assetType];

            let msg = this.makePopupMsg(a1, { startPrefix: startPrefix, endPrefix: endPrefix });
            let assetdata = {
              start: a1.start,
              end: a1.end ? a1.end : a1.start,
              text: a1.unitId,
              imgFile: img,
              visible: true,
              _id: a1._id,
              msg: msg,
            };

            // if asset adjusted gps location exist pass it along instead.
            if (a1 && a1.attributes && a1.attributes.adjCoordinates) {
              let geoJsonObj = { geometry: swapLatLon(a1.attributes.adjCoordinates), properties: {}, type: "Feature" };
              assetdata = { ...assetdata, ...{ geoJsonObj } };
            }

            // if this asset doesn't have a GIS and its parent has a linear GIS then extract position from parent
            if (!assetdata.geoJsonObj && a1.parentAsset) {
              // && geoJsonMap.has(a1.parentAsset))
              // find the point with reference to parent
              //let parentGeoJson = geoJsonMap.get(a1.parentAsset);

              let parent = allAssets.assetsList.find((a) => {
                return a._id === a1.parentAsset;
              });

              // if(!parent)
              //     console.log('Parent asset not found', a1.parentAsset);

              if (parent && parent.attributes && parent.attributes.geoJsonCord !== undefined && parent.attributes.geoJsonCord !== null) {
                //console.log('Parent GIS found for', a1.unitId);
                let start = a1.start - parent.start; // todo: minus baseline offset
                start = start >= 0 ? start : 0;

                let geojsonobj = this.getChildGeoJsonObj(parent.attributes.geoJsonCord, start);

                if (geojsonobj) assetdata.geoJsonObj = geojsonobj;
              }
              //else
              //console.log('Parent GIS not found for', a1.unitId);
            }

            pointAssets.push(assetdata);
            if (!selectedAsset) {
              selectedAsset = _.cloneDeep(assetdata);
              selectedLine = _.cloneDeep(baseLine);
            }
          }
          // if (a1 && !selectedAsset) {
          //   selectedAsset = _.cloneDeep(a1);
          //   selectedLine = _.cloneDeep(baseLine);
          // }
        }
        baseLine.color = baseLine.systemAttributes && baseLine.systemAttributes.stroke ? baseLine.systemAttributes.stroke : "blue";
        baseLine.width = 1;
        lineGroups.push({ baseLine: baseLine, lines: linearAssets, points: pointAssets });
        // } else {
        //   console.log("LampAssets.processMultilineAssetsForGIS.cannot find attributes.geoJsonCord, skipping GIS for line", baseLine);
        // }
      }
    }

    this.saveFilterState({ gisSelectedAsset: selectedAsset, gisSelectedLine: selectedLine });
    this.setState({ lineGroups: lineGroups, gisSelectedAsset: selectedAsset, gisSelectedLine: selectedLine, gisLegendData: gisLegend });
  }

  // showLocationAsset(locations, assetType) {
  //   //console.log(locations, assetType);
  //   let assetsToShow = [];
  //   if (this.state.defaultFilter.filterState) {
  //     locations.forEach(loc => {
  //       let locAssetsToShow = this.assetsToShowBasedOnTree(loc, this.state.assetGroupByParent);
  //       assetsToShow = [...assetsToShow, ...locAssetsToShow];
  //     });
  //   } else {
  //     let allAssetOfAssetType = this.assetsToShowBasedOnFilter(this.state.currentAssetFilter.assetType, this.state.assetGroupsByAssetTypes);
  //     allAssetOfAssetType.forEach(asset => {
  //       let findAssetExist = _.find(locations, e => {
  //         return e == asset.lineId;
  //       });
  //       if (findAssetExist) {
  //         assetsToShow.push(asset);
  //       }
  //     });
  //   }
  //   this.props.updateFilterState("assetsFilter", {
  //     ...this.props.assetsFilter,
  //     locationFilter: { name: assetType, locations: locations },
  //   });
  //   this.setState({
  //     locationFilter: { name: assetType, locations: locations },
  //     assetListToShow: assetsToShow,
  //   });
  // }

  clearLineFilter() {
    let assetListToShow = [];
    if (this.state.defaultFilter.filterState) {
      assetListToShow = this.assetsToShowBasedOnTree(this.loggedInUser.assignedLocation, this.state.assetGroupByParent);
      this.closeExpandedAssets(assetListToShow);
    } else {
      assetListToShow = this.assetsToShowBasedOnFilter(this.state.currentAssetFilter.assetType, this.state.assetGroupsByAssetTypes);
    }
    this.props.updateFilterState("assetsFilter", {
      ...this.props.assetsFilter,
      locationFilter: null,
    });
    this.setState({
      assetListToShow: assetListToShow,
      locationFilter: null,
    });
  }

  takeAssetTypeFromAddAsset(assetTypes) {
    let check = false;
    check = this.props.assetsFilter && this.props.assetsFilter.assetTypeFilters ? true : check;
    if (!check) {
      this.assetTypeListSet(assetTypes);
    }
  }

  setPageResetHandler = (caller) => {
    this.pageResetHandler = caller;
  };
  fetchData(state, instance) {
    let sortProperties = state.sorted;
    if (sortProperties.length > 0) {
      const orderByDirection = sortProperties[0].desc ? 1 : 0;
      let copyAssetsToShow = [...this.state.assetListToShow];
      var treeObj = arrayToTree(copyAssetsToShow, sortProperties[0].id, orderByDirection);
      let sortedAssets = [];
      //sortedAssets.push(treeObj.data);
      treeObj.walk(function () {
        sortedAssets.push(this.data);
      }, true);
      //console.log(sortedAssets);
      const { pageSize } = this.state;
      //let filteredData = sortedAssets.slice(page * pageSize, page * pageSize + pageSize);
      let dataLen = sortedAssets.length;
      var _pages = parseInt(dataLen / pageSize) != dataLen / pageSize ? parseInt(dataLen / pageSize) + 1 : dataLen / pageSize;
      //console.log(page, pageSize, dataLen, _pages);
      this.setState({ assetListToShow: sortedAssets, pages: _pages });
      //sortTableData();
    }
  }
  onSortedChange = (sortProperties) => {
    /*
    const orderByDirection = sortProperties[0].desc ? 1 : 0;
    console.log(sortProperties[0].id, orderByDirection);
    let copyAssetsToShow = [...this.state.assetListToShow];
    var treeObj = arrayToTree(copyAssetsToShow, sortProperties[0].id, orderByDirection);
    console.log(copyAssetsToShow);
    console.log(treeObj);
    let sortedAssets = [];
    //sortedAssets.push(treeObj.data);
    treeObj.walk(function() {
      sortedAssets.push(this.data);
    }, true);*/
    //console.log("sorting ");
    this.setState({ sorted: sortProperties });
    //console.log(sortedAssets);
  };
  sortTableData(_sortProperties) {
    let sortProperties = _sortProperties;
    if (sortProperties.length > 0) {
      const orderByDirection = sortProperties[0].desc ? 1 : 0;
      let copyAssetsToShow = [...this.state.assetListToShow];
      var treeObj = arrayToTree(copyAssetsToShow, sortProperties[0].id, orderByDirection);
      let sortedAssets = [];
      //sortedAssets.push(treeObj.data);
      treeObj.walk(function () {
        sortedAssets.push(this.data);
      }, true);
      //console.log(sortedAssets);
      const { pageSize } = this.state;
      //let filteredData = sortedAssets.slice(page * pageSize, page * pageSize + pageSize);
      let dataLen = sortedAssets.length;
      var _pages = parseInt(dataLen / pageSize) != dataLen / pageSize ? parseInt(dataLen / pageSize) + 1 : dataLen / pageSize;
      //console.log(page, pageSize, dataLen, _pages);
      this.setState({ assetListToShow: sortedAssets, pages: _pages, sorted: sortProperties });
    }
  }
  onPageChange = (_page, size) => {
    console.log(_page);
    this.setState({ page: _page });
  };
  onColClick(state, rowInfo, column, instance) {
    if (column.id === "actions") return;
    let sortProperties = this.state.sorted;
    let _sortProperties = [];
    //const orderByDirection = sortProperties[0].desc ? 1 : 0;
    let sortProperty = sortProperties[0] || { id: column.id, desc: false };
    if (sortProperties[0]) {
      sortProperty.id === column.id ? (sortProperty.desc = !sortProperties[0].desc) : (sortProperty.desc = sortProperties[0].desc);
      sortProperty.id = column.id;
    }
    _sortProperties.push(sortProperty);

    // console.log(sortProperties);
    // console.log("Column Clicked: ", _sortProperties);
    //this.setState({ sorted: _sortProperties });
    this.sortTableData(_sortProperties);
  }
  assetsToShowBasedOnLines(parent, totalAssets) {
    //   //console.log(this.props.assets);
    //   let assets = totalAssets.assetsList_.map(item => {
    //     return item.lineId == parent.id;
    //   });
    //   return assets;
  }
  menuFilterApplied(assetChildren) {
    //let range = { today: moment().endOf("day"), from: moment().startOf("week"), to: moment().endOf("week") };
    //var jsonArray = encodeURIComponent(JSON.stringify(range));
    //let arg = "?dateRange=" + jsonArray;
    // this.props.getDashboard(arg);
    //     //this.getRangeDataFromServer(arg)
    //this.setState({ assetChildren });
    //this.handelMenuClickData(assetChildren);
    // console.log(range);
    //console.log("assetChildren", assetChildren);
  }
  handelMenuClickData(assetChildren, displayMenuAll) {
    // debugger;
    //console.log("displayMenuAll", displayMenuAll.length || displayMenuAll == true);

    let locations = [];
    //let children = [];
    //console.log("assetGroupByParent", Object.entries(this.state.assetGroupByParent).length);
    //console.log("this.props.assets", this.props.assets);
    //console.log("assetChildren", assetChildren);
    // let assetGroupByParent = {};
    // if (Object.entries(this.state.assetGroupByParent).length <= 0) {
    //   assetGroupByParent = this.groupAssetsByParent(this.props.assets);
    // } else {
    //   assetGroupByParent = this.state.assetGroupByParent;
    // }
    // assetChildren.forEach((child, index) => {
    //   children = [...children, ...child];
    // });
    let assetsToShow = [];
    if (displayMenuAll.length || displayMenuAll == true) {
      //console.log("Show Full tree", this.state.currentAssetFilter);
      assetChildren.forEach((child) => {
        if (child.state) {
          locations.push(child.id);
        }
      });
    } else {
      //console.log("Show lines", this.state.currentAssetFilter);
      assetChildren.forEach((child) => {
        if (child.state) {
          locations.push(child.id);
        }
      });
    }

    //console.log("this.state.currentAssetFilter", this.state.currentAssetFilter);

    // locations.forEach(loc => {
    //   let locAssetsToShow = this.assetsToShowBasedOnLines(loc, this.props.assets);
    //   assetsToShow = [...assetsToShow, ...locAssetsToShow];
    // });
    // let assetsToShow = [];
    // if (this.state.defaultFilter.filterState) {
    //   locations.forEach(loc => {
    //     let locAssetsToShow = this.assetsToShowBasedOnTree(loc, assetGroupByParent);
    //     assetsToShow = [...assetsToShow, ...locAssetsToShow];
    //   });
    // } else {
    //   let allAssetOfAssetType = this.assetsToShowBasedOnFilter(this.state.currentAssetFilter.assetType, this.state.assetGroupsByAssetTypes);
    //   allAssetOfAssetType.forEach(asset => {
    //     let findAssetExist = _.find(locations, e => {
    //       return e == asset.lineId;
    //     });
    //     if (findAssetExist) {
    //       assetsToShow.push(asset);
    //     }
    //   });
    // }
    this.props.updateFilterState("assetsFilter", {
      ...this.props.assetsFilter,
      locationFilter: { locations: locations },
      assetChildren: assetChildren,
    });
    this.setState(
      {
        //   locationFilter: { locations: locations },
        assetChildren: assetChildren,
      },
      () => {
        if (this.state.currentAssetFilter == "Default") {
          let assetType = { assetType: "Default", filterState: true };
          this.handleAssetTypeFilterClick(assetType, assetsToShow);
        } else {
          this.handleAssetTypeFilterClick(this.state.currentAssetFilter);
        }
      },
    );
    //console.log("assetsToShow", assetsToShow);
    //console.log("locationFilter", locations);
  }

  render() {
    const { path } = this.props.match;
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    let lineColor = "purple"; //default
    const { page, pageSize, assetListToShow: assetsToShow = [] } = this.state;

    let assetsList = (assetsToShow && assetsToShow.slice(page * pageSize, page * pageSize + pageSize)) || [];
    if (this.state.lineAsset && this.state.lineAsset.systemAttributes && this.state.lineAsset.systemAttributes.stroke) {
      lineColor = this.state.lineAsset.systemAttributes.stroke;
    }

    return (
      <Col id="mainContent" md="12">
        {modelRendered}

        <ConfirmationDialog
          modal={this.state.deleteModal}
          toggle={() => this.setState(({ deleteModal }) => ({ deleteModal: !deleteModal }))}
          handleResponse={this.handleConfirmation}
          confirmationMessage={
            <div>
              <div>{languageService("Are you sure you want to delete")} </div>
              <div style={{ color: "red" }}>
                <strong>{languageService("Note")}: </strong>
                {languageService("All the children asset in the selected asset will also be deleted")}
              </div>
            </div>
          }
          headerText={languageService("Confirm Deletion")}
        />
        {versionInfo.isTIMPS() && (
          <AssetBuilder
            modal={this.state.addModalTrack}
            modalState={this.state.modalState}
            toggle={this.handleAddEditModalClickTrackSetup}
            handleSubmitForm={this.handleSubmitFormTrackSetup}
            assets={this.props.assets}
            parentAsset={this.state.parentAssetSelected}
          />
        )}
        <AddAssets
          modal={this.state.addModal}
          modalState={this.state.modalState}
          toggle={this.handleAddEditModalClick}
          handleSubmitForm={this.handleSubmitForm}
          takeAssetTypeFromAddAsset={this.takeAssetTypeFromAddAsset}
          selectedAsset={this.state.selectedAsset}
          selectedLine={this.props.selectedLine}
          assets={this.props.assets}
          parentAsset={this.state.parentAssetSelected}
          plannableLocations={this.state.plannableLocations}
          //osama iqbal
          assetsList={this.props.assets.assetsList}
          showMap={true}
        />
        <ViewAssetDetail modal={this.state.viewModal} toggle={this.viewAssetDetail} selectedAsset={this.state.selectedAssetToDetailView} />
        {this.state.openEquipmentDialog && (
            <AssetEquipmentTreeView
              selectedAsset={this.state.selectedAsset}
              equipmentTypes={this.equipmentTypes}
              openEquipmentView={this.openEquipmentView}
              downloadFile={this.props.downloadFileFromServer}
              updateEquipmentData={this.updateEquipmentData}
            />
          )}
        <Row style={themeService(commonStyles.pageBorderRowStyle)}>
          <Col md="10" style={{ paddingLeft: "0px" }}>
            <div style={themeService(commonStyles.pageTitleStyle)}>{languageService("Assets")}</div>
          </Col>
          <Col md="2">
            <ViewChangerComponent
              LIST_VIEW_SELECTION={LIST_VIEW_SELECTION}
              listViewDataToShow={this.state.listViewDataToShow}
              handleListViewSelection={this.handleListViewSelection}
              placement="TOP_OF_PAGE"
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: "30px" }}>
          <Col md={12}>
            <MenuFilterLink
              assets={this.props.assets}
              //assets={tableData}
              assetActionType={this.props.actionType}
              handelMenuClickData={this.handelMenuClickData}
              defaultMenuItem={defaultMenuItem}
              menuFilterApplied={this.handelMenuClickData}
            />
          </Col>
        </Row>
        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.AssetsView && (
          <div style={{ margin: "0px 15px 30px" }}>
            <Row>
              <Col md={10}>
                <AllFilter
                  assetType={this.state.defaultFilter}
                  filterState={this.state.defaultFilter.filterState}
                  handleAssetTypeFilterClick={this.handleAssetTypeFilterClick}
                  assetTypeFilterComponent={this.state.assetTypeFilterComponent}
                  multipleLinesSelectHandler={this.multipleLinesSelectHandler}
                  setDefaultObjects={this.handleDefaultAssets}
                  lineAssetsToShow={this.state.plannableLocations} //{this.state.assetGroupsByAssetTypes["line"]}
                  locationAssetType="line"
                  // showLocationAsset={this.showLocationAsset}
                  clearLineFilter={this.clearLineFilter}
                  locationFilter={this.state.locationFilter}
                />
              </Col>
              {/* </Row>
        <Row>
          <Col md={11}>
            <div style={{ display: "inline-block", padding: "15px" }}>
              <AssetTypeFilter
                assetType={this.state.defaultFilter}
                filterState={this.state.defaultFilter.filterState}
                handleAssetTypeFilterClick={this.handleAssetTypeFilterClick}
              />
              <div style={{ display: "inline-block", color: "var(--first)" }}> | </div>
            </div>
            <div style={{ display: "inline-block", padding: "15px" }}> {this.state.assetTypeFilterComponent}</div>
          </Col> */}

              <Col md="2">
                {/* <AssetsSummary
              descriptions={this.state.summaryDesc}
              values={this.state.summaryValue}
              handleAddNewClick={this.handleAddEditModalClick}
              permissionCheckProps={true}
              permissionCheck={permissionCheck('TRACK', 'create')}
              AddButton
              addTootTipText={'Asset'}
              addToolTipId="Asset"
              buttonTitleText="Asset"
            /> */}
                <div style={{ textAlign: "right" }}>
                  {/* <div id={"toolTipAddAsset"} style={{ minHeight: "86px" }}>
                    {permissionCheck("ASSET", "create") && (
                      <ButtonCirclePlus
                        iconSize={50}
                        icon={withPlus}
                        handleClick={e => {
                          this.handleAddEditModalClick("Add");
                        }}
                        {...themeService(commonSummaryStyle.addButtonStyle(this.props))}
                        buttonTitleText={languageService("Add Asset")}
                      />
                    )}
                  </div> */}
                  {permissionCheck("ASSET", "create") && (
                    <React.Fragment>
                      {versionInfo.isTIMPS() && (
                        <React.Fragment>
                          <div
                            id={"toolTipAddTrack"}
                            style={{ display: "inline-block", marginRight: "15px", verticalAlign: "top" }}
                            onClick={(e) => {
                              this.handleAddEditModalClickTrackSetup();
                            }}
                          >
                            {/* <SvgIcon icon={road} size={25} /> */}

                            <ButtonCirclePlus
                              iconSize={30}
                              icon={road}
                              customClassName={"road"}
                              backgroundColor="#e3e9ef"
                              margin="5px 0px 0px 0px"
                              borderRadius="50%"
                              hoverBackgroundColor="#e3e2ef"
                              hoverBorder="0px"
                              activeBorder="3px solid #e3e2ef "
                              iconStyle={{
                                color: "#c4d4e4",
                                background: "var(--fifth)",
                                borderRadius: "50%",
                                border: "3px solid ",
                              }}
                            />
                          </div>
                          <Tooltip
                            isOpen={this.state.tooltipOpen.addTrack}
                            target={"toolTipAddTrack"}
                            toggle={(e) => {
                              this.toggleTooltip("addTrack");
                            }}
                          >
                            {languageService("Setup Tracks")}
                          </Tooltip>{" "}
                        </React.Fragment>
                      )}
                      {/* <div
                        id={"toolTipAddAsset"}
                        style={{ color: retroColors.second, textAlign: "center", display: "inline-block", marginLeft: "10px" }}
                        onClick={(e) => {
                          this.handleAddEditModalClick("Add");
                        }}
                      >
                        <SvgIcon icon={plus} size={25} />
                      </div> */}
                      <div
                        id={"toolTipAddAsset"}
                        style={{ display: "inline-block", margin: "0 20% 0 0" }}
                        onClick={(e) => {
                          this.handleAddEditModalClick("Add");
                        }}
                      >
                        <ButtonCirclePlus
                          iconSize={50}
                          icon={withPlus}
                          backgroundColor="#e3e9ef"
                          margin="5px 0px 0px 0px"
                          borderRadius="50%"
                          hoverBackgroundColor="#e3e2ef"
                          hoverBorder="0px"
                          activeBorder="3px solid #e3e2ef "
                          iconStyle={{
                            color: "#c4d4e4",
                            background: "var(--fifth)",
                            borderRadius: "50%",
                            border: "3px solid ",
                          }}
                          handleClick={(e) => {
                            this.handleAddEditModalClick("Add");
                          }}
                        />
                      </div>
                      <Tooltip
                        isOpen={this.state.tooltipOpen.addAsset}
                        target={"toolTipAddAsset"}
                        toggle={(e) => {
                          this.toggleTooltip("addAsset");
                        }}
                      >
                        {languageService("Add Asset")}
                      </Tooltip>
                    </React.Fragment>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <AssetsList
                  onColClick={this.onColClick}
                  sortable={false}
                  setPageResetHandler={this.setPageResetHandler}
                  assetsData={this.state.assetListToShow}
                  addAssetHandler={this.addAssetToParent}
                  handleExpandClick={this.handleExpandClick}
                  handleContractClick={this.handleContractClick}
                  handleSelectedClick={this.handleSelectedClick}
                  editAsset={this.editAsset}
                  viewAssetDetail={this.viewAssetDetail}
                  deleteAsset={this.deleteAsset}
                  actionType={this.props.actionType}
                  assetGroupByParent={this.state.assetGroupByParent}
                  handlePageSave={this.onPageChange}
                  onSortedChange={this.onSortedChange}
                  sorted={this.state.sorted}
                  manual={false}
                  defaultPageSize={15}
                  currentAssetFilter={this.state.currentAssetFilter}
                  openEquipmentView = {this.openEquipmentView}
                  openRelayView = {this.openRelayView}
                 inspectionTypes = {() => this.props.getApplookups(["inspectionTypes"])}
                />
              </Col>
            </Row>
          </div>
        )}

        {this.state.listViewDataToShow === LIST_VIEW_SELECTION_TYPES.GIS && (
          <Row style={{ margin: "0px 0px 30px", position: "relative", width: "100%", overflow: "hidden" }}>
            <div className="gis-nav" style={{ right: this.state.assetsRight + "px" }}>
              <div className="button" onClick={this.handleAssetsSideBarExpand} style={{ textTransform: "uppercase" }}>
                <span>
                  <Icon
                    icon={this.state.assetsRight == -560 ? arrowCircleLeft : arrowCircleRight}
                    style={{ verticalAlign: "text-bottom" }}
                    size={24}
                  />
                </span>
                {languageService("Assets")}
              </div>
              <GISList
                assetsData={this.state.assetListToShow}
                handleExpandClick={this.handleExpandClick}
                handleContractClick={this.handleContractClick}
                handleSelectedClick={this.handleSelectedClick}
              />
            </div>
            <div className="gis-nav one" style={{ right: this.state.assetsDetail + "px" }}>
              <div className="button" onClick={this.handleDetailSideBarExpand} style={{ textTransform: "uppercase" }}>
                <span>
                  <Icon
                    icon={this.state.assetsDetail == -400 ? arrowCircleLeft : arrowCircleRight}
                    style={{ verticalAlign: "text-bottom" }}
                    size={24}
                  />
                </span>
                {languageService("Detail")}
              </div>

              {/* <AssetsDetail
                assetsData={this.state.assetsDataToShow}
                // handleExpandClick={this.handleExpandClick}
                // handleContractClick={this.handleContractClick}
                // handleSelectedClick={this.handleSelectedClick}
              /> */}
            </div>
            <Col md={12}>
              {this.state.gisSelectedLine !== null && (
                <React.Fragment>
                  <MapBox
                    // assets={this.state.assetsDataToShow}
                    // lineAsset={this.state.lineAsset}
                    // lineWidth={2}
                    // lineColor={lineColor}
                    // selectedAsset={this.state.selectedAsset}
                    assets={{}}
                    lineAsset={this.state.gisSelectedLine}
                    selectedAsset={this.state.gisSelectedAsset}
                    lineGroups={this.state.lineGroups}
                    mapState={this.state.listViewDataToShow}
                    selectedAssetGISInfo={this.state.gisSelectedAssetInfo}
                  />
                  <GISLegend legendData={this.state.gisLegendData}></GISLegend>
                </React.Fragment>
              )}
            </Col>
          </Row>
        )}
      </Col>
    );
  }
}

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getAppMockupsTypes, savePageNum, clearPageNum, getMultiLineData, updateFilterState, uploadDocuments, downloadFileFromServer },
};

let variables = {
  diagnosticsReducer: {
    subdivisions: [],
    classLevels: [],
  },
  utilReducer: {
    // trackPageNum: 0,
    // trackPageSize: 10
  },
  assetGroupHelperReducer: {
    noVar: "",
  },
  lineSelectionReducer: {
    selectedLine: {},
    multiData: [],
  },
  filterStateReducer: {
    assetsFilter: null,
  },
  assetHelperReducer: {
    a: [],
  },
};
const customsReducers = [
  "diagnosticsReducer",
  "utilReducer",
  "assetGroupHelperReducer",
  "lineSelectionReducer",
  "filterStateReducer",
  "assetHelperReducer",
];
let customItems = [
  {
    name: "assetTree",
  },
  {
    name: "applookup",
    apiName: "applicationlookups",
  },
];
let AssetsLampult = CRUDFunction(AssetsLamp, "asset", actionOptions, variables, customsReducers, null, customItems);
export default AssetsLampult;

function checkAndAddAssetInList(limitedLines, asset, assetsDataToShow) {
  let check = false;
  if (limitedLines) {
    limitedLines.forEach((li) => {
      if (li == asset._id) {
        check = true;
      }
    });
    if (check) {
      assetsDataToShow.push(asset);
    }
  } else {
    assetsDataToShow.push(asset);
  }
}

export function recursivelyFindAssetId(id, treeBranch, foundAssetInsideTree, found) {
  if (!found) {
    let aIds = Object.keys(treeBranch);
    for (let key of aIds) {
      if (typeof treeBranch[key] === "object") {
        if (key == id) {
          foundAssetInsideTree.push(treeBranch[key]);
          found = true;
          break;
        } else {
          found = recursivelyFindAssetId(id, treeBranch[key], foundAssetInsideTree, found);
        }
      } else {
        return false;
      }
    }
  }
  return found;
}

function swapLatLon(geoMetryObj) {
  // if (geoMetryObj) {
  //   [geoMetryObj.coordinates[0], geoMetryObj.coordinates[1]] = [geoMetryObj.coordinates[1], geoMetryObj.coordinates[0]];
  // } else {
  //   console.log("Not a valid geometry object");
  // }
  return geoMetryObj;
}
