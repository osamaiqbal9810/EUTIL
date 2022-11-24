import React, { Component } from "react";
import _ from "lodash";
import { Col, Row } from "reactstrap";
import TabsWrapperV2 from "components/Common/TabsV2/TabsWrapper";
import { getFilteredAsset } from "../../../services/methods";
import { recursivelyFindAssetId } from "components/LampAssets";
import { isJSON } from "utils/isJson";

class MenuFilterLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "",

      selectedMenuItems: [],
      displayName: { name: this.props.defaultMenuItem, multi: true, all: true },
      tabActive: true,
      defaultMenuState: true,
      lineNames: [],
      assetChildren: [],
    };
    this.handleElementClick = this.handleElementClick.bind(this);
    this.handelParentClick = this.handelParentClick.bind(this);
    // this.getActualNameOfAsset = this.getActualNameOfAsset.bind(this);
  }
  componentDidMount() {
    //console.log("this.props.assets", this.props.assets, this.props.assetActionType);
    //this.setState({ assetChildren: this.props.assetChildren });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.assetActionType == "ASSETS_READ_SUCCESS" && this.props.assetActionType !== prevProps.assetActionType) {
      this.props.assets && this.props.assets.assetsList && this.props.assets.assetsTypes && this.setLocations(this.props.assets);
    }
  }
  // getActualNameOfAsset(searchId, assetsLists) {
  //   //console.log("key", assetsLists);
  //   // return _.find(assetsLists, () => {
  //   //   return _id == searchId;
  //   // });
  //   return _.find(assetsLists, { _id: searchId });
  // }
  setLocations = (assets, callback) => {
    let assetChildren = [];
    let filteredAssets = getFilteredAsset(assets.assetsList, assets.assetsTypes, {
      menuFilter: true,
    });

    this.setState({ assetWithChildren: assets });
    let options = [];
    let allFlatChild = [];
    // console.log("assets", this.props.assets);

    if (filteredAssets.length < 1 && assets.assetTree && assets.assetTree[Object.keys(assets.assetTree)[0]].properties.plannable == true) {
      let userObj = localStorage.getItem("loggedInUser");
      if (userObj) {
        userObj = isJSON(userObj);
      }

      let foundArray = _.cloneDeep(assets.assetTree);
      let childAssets = [];
      //this.getActualNameOfAsset(foundArray.properties.unitId, assets.assetsList);
      //console.log("foundArray.properties", foundArray.properties.unitId);
      if (foundArray[Object.keys(foundArray)[0]].properties.unitId != undefined) {
        childAssets.push({
          title: foundArray[Object.keys(foundArray)[0]].properties.unitId,
          id: userObj.assignedLocation,
          state: true,
        });
      }
      allFlatChild = [...allFlatChild, ...childAssets];
      assetChildren.push(childAssets);
      // this.setState({ assetChildren });
    } else if (filteredAssets.length < 1) {
      options = [
        {
          val: assets.assetTree[Object.keys(assets.assetTree)[0]].properties.assetTypeClassify,
          value: assets.assetTree[Object.keys(assets.assetTree)[0]].properties.unitId,
          text: assets.assetTree[Object.keys(assets.assetTree)[0]].properties.unitId,
          state: this.state.tabActive,
        },
      ];

      let children = options.forEach((item) => {
        let foundArray = _.cloneDeep(assets.assetTree);

        let childAssets = [];
        Object.keys(foundArray).map((key) => {
          if ("properties" in foundArray[key]) {
            if (foundArray[key].properties.plannable && foundArray[key].properties.location) {
              // console.log("foundArray.properties1", foundArray.properties.unitId);
              if (foundArray[key].properties.unitId != undefined) {
                childAssets.push({
                  title: foundArray[key].properties.unitId,
                  id: key,
                  state: true,
                });
              }
            }
          }
        });
        item.children = childAssets;
        assetChildren.push(childAssets);
        allFlatChild = [...allFlatChild, ...childAssets];
      });
      //    this.setState({ lineNames: [...options], assetChildren });
    } else {
      options = filteredAssets
        ? filteredAssets.map((asset) => ({ val: asset._id, value: asset.unitId, text: asset.unitId, state: this.state.tabActive }))
        : [];

      let children = options.forEach((item) => {
        let foundArray = [];
        let found = false;

        found = recursivelyFindAssetId(item.val, assets.assetTree, foundArray, found);
        //console.log("found", found, item);
        let childAssets = [];

        if (found) {
          let countElements = 0;
          Object.keys(foundArray[0]).map((key) => {
            //console.log("foundArray.properties2", key);
            if ("properties" in foundArray[0][key]) {
              countElements++;
              if (foundArray[0][key].properties.plannable && foundArray[0][key].properties.location) {
                //console.log("foundArray.properties2", foundArray[0][key], key);
                // console.log(this.getActualNameOfAsset(key, assets.assetsList));
                if (foundArray[0][key].properties.unitId != undefined) {
                  childAssets.push({
                    title: foundArray[0][key].properties.unitId,
                    id: key,
                    state: true,
                  });
                }
              }
            }
          });
          if (countElements == 0) {
            item.state = false;
          }

          item.children = childAssets;
          allFlatChild = [...allFlatChild, ...childAssets];
        }

        assetChildren.push(childAssets);
      });
      // console.log("allFlatChild", allFlatChild);
      //    this.setState({ lineNames: [...options], assetChildren });
    }
    // assetChildren.forEach((child, index) => {
    //   children = [...children, ...child];
    // });

    let displayName = { name: "All", multi: true, all: true };
    let activeCounts = 0;
    allFlatChild.forEach((element) => {
      let existingElement = _.find(this.props.assetChildren, { id: element.id });
      if (existingElement) {
        element.state = existingElement.state;
      }
      if (element.state == false) {
        displayName.all = false;
      } else {
        displayName.name = element.title;
        activeCounts++;
      }
    });
    if (activeCounts < 2) {
      if (activeCounts == 0) {
        displayName.name = "No Option Selected";
      }
      displayName.multi = false;
    } else {
      displayName.name = "Multiple";
    }
    // let receivedAssetChildren = [];
    // this.props.lineNames.forEach(ln => {
    //   receivedAssetChildren.push(ln.children);
    // });
    this.setState({
      lineNames: [...options],
      assetChildren: assetChildren,
      displayName: displayName,
      defaultMenuState: displayName.all ? true : false,
    });

    this.props.menuFilterApplied(allFlatChild, options);

    //console.log("options", options);
  };

  handleElementClick(title, id, state) {
    const { displayName, assetChildren } = this.state;
    let assetChildrenCopy = _.cloneDeep(assetChildren);
    let displayNameCopy = _.cloneDeep(displayName);
    displayNameCopy.all = false;
    let countChildren = 0;
    let allChild = 0;
    let defaultMenuStateUpdated = this.state.defaultMenuState;
    let allFlatChild = [];
    assetChildrenCopy.forEach((child, index) => {
      allChild += child.length;

      child.forEach((element, index2) => {
        //console.log("element", element);
        if (assetChildrenCopy[index][index2].state) {
          countChildren++;
          if (element.id != id) {
            displayNameCopy.name = assetChildrenCopy[index][index2].title;
          }
        }

        if (title == "All" && id == "All") {
          assetChildrenCopy[index][index2].state = true;
          countChildren = allChild;
        }
        if (title == "All" && id == "All" && this.state.displayName.all == true) {
          assetChildrenCopy[index][index2].state = false;
          countChildren = 0;
        }

        if (element.id == id) {
          //console.log("title, id, state", title, id, state);
          assetChildrenCopy[index][index2].state = state;
          if (state) {
            countChildren++;
            displayNameCopy.name = assetChildrenCopy[index][index2].title;
          } else {
            countChildren--;
          }
        }
        if (allChild == countChildren) {
          displayNameCopy.all = true;
          defaultMenuStateUpdated = true;
        } else if (countChildren > 0) {
          defaultMenuStateUpdated = false;
          displayNameCopy.all = false;
          if (countChildren > 1) {
            displayNameCopy.multi = true;
            defaultMenuStateUpdated = false;
          } else {
            displayNameCopy.multi = false;
          }
        } else {
          displayNameCopy.multi = false;
          defaultMenuStateUpdated = false;
          displayNameCopy.name = "No Option Selected";
        }
        allFlatChild = [...allFlatChild, element];
      });
    });
    //console.log(assetChildrenCopy);

    const { lineNames } = this.state;
    let lineNamesCopy = _.cloneDeep(lineNames);
    lineNamesCopy.forEach((tab, index) => {
      tab.children = assetChildrenCopy[index];
    });
    this.setState({
      assetChildren: assetChildrenCopy,
      displayName: displayNameCopy,
      lineNames: lineNamesCopy,
      defaultMenuState: defaultMenuStateUpdated,
    });
    //console.log(assetChildrenCopy);
    //this.props.handelAssetChange();
    this.props.handelMenuClickData(allFlatChild, displayNameCopy.all, lineNamesCopy);
  }
  handelParentClick(title, id, state) {
    // console.log(title, id, state);
    const { displayName, assetChildren, lineNames } = this.state;
    let assetChildrenCopy = _.cloneDeep(assetChildren);
    let displayNameCopy = _.cloneDeep(displayName);
    let lineNamesCopy = _.cloneDeep(lineNames);
    displayNameCopy.all = false;
    let countChildren = 0;
    //let allChild = 0;
    let defaultMenuStateUpdated = this.state.defaultMenuState;
    let allFlatChild = [];
    assetChildrenCopy.forEach((child, index) => {
      // allChild += child.length;

      child.forEach((element, index2) => {
        // // console.log(assetChildrenCopy[index].id + " " + "==" + " " + id);
        // if (assetChildrenCopy[index].id == id) {
        //   countChildren++;

        //   displayNameCopy.name = assetChildrenCopy[index].title;
        //   // assetChildrenCopy[index][index2].state = true;
        //   defaultMenuStateUpdated = false;
        // } else {
        //   //  assetChildrenCopy[index][index2].state = false;
        //   countChildren = 0;
        // }

        allFlatChild = [...allFlatChild, element];
      });
    });
    //console.log(assetChildrenCopy);

    //const { lineNames } = this.state;
    //let lineNamesCopy = _.cloneDeep(lineNames);
    lineNamesCopy.forEach((tab, index) => {
      tab.children = assetChildrenCopy[index];
      // console.log("tab" + tab.value);
      if (tab.val == id) {
        displayNameCopy.name = tab.value;
        displayNameCopy.multi = false;
        defaultMenuStateUpdated = false;

        tab.children.forEach((child, index2) => {
          assetChildrenCopy[index][index2].state = true;
        });
      } else {
        tab.children.forEach((child, index2) => {
          assetChildrenCopy[index][index2].state = false;
        });
      }
    });
    this.setState({
      assetChildren: assetChildrenCopy,
      displayName: displayNameCopy,
      lineNames: lineNamesCopy,
      defaultMenuState: defaultMenuStateUpdated,
    });
    //console.log(assetChildrenCopy);
    //this.props.handelAssetChange();
    this.props.handelMenuClickData(allFlatChild, displayNameCopy.all, lineNamesCopy);
  }
  render() {
    return (
      <React.Fragment>
        <Row
          style={{
            borderBottom: "2px solid #d1d1d1",
            margin: "10px 15px 0px 15px",
            padding: "5px 0px",
          }}
        >
          <Col md={12} style={{ padding: "0" }}>
            <div style={{ width: "100%" }} className="scrollbar">
              <TabsWrapperV2
                selectedTab={this.state.selectedTab}
                tabsArray={this.state.lineNames}
                assetTree={this.state.assetChildren}
                selectedMenuItems={this.state.selectedMenuItems}
                handleElementClick={this.handleElementClick}
                handelParentClick={this.handelParentClick}
                type="fancy"
                displayName={this.state.displayName}
                defaultMenuItem={this.props.defaultMenuItem}
                defaultMenuState={this.state.defaultMenuState}
                displayMenuAll={this.state.displayName.all}
              />
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default MenuFilterLink;
