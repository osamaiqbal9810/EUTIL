import React from "react";
import { Row, Col, Panel } from "reactstrap";
import Gravatar from "react-gravatar";
import PermissionTabs from "./PermissionTabs.jsx";
import { mapObject } from "utils/objectFunctions.js";
import PermissionRow from "./PermissionRow.jsx";
import Radium from "radium";
import { UserProfileHeaderIcon } from "../../../images/imageIcons/index.js";
import { UserProfileViewTitleBar } from "./UserFormViews.jsx";
import { languageService } from "Language/language.service";
class UserPermissions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: [],
      selectedTab: "",
      currentPermissionList: [],
      userPermissions: [],
      orignalUserPermissions: [],
    };

    this.handleClickedTab = this.handleClickedTab.bind(this);
    this.handlePermissionClick = this.handlePermissionClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    let permList = this.props.permissionList;
    let userPermList = this.props.userPermissions;
    let tempTabArray = [];
    let permessionListFrontEnd = {};
    permList.forEach(element => {
      mapObject(element, function(key, item) {
        let permTabName = _.capitalize(key);
        tempTabArray.push(permTabName);
        permessionListFrontEnd[key] = item;
      });
    });
    let lowerCaseString = _.lowerCase(tempTabArray[0]);
    let firstSelectedTab = _.capitalize(lowerCaseString);
    //  console.log(tempTabArray);
    //  console.log(permessionListFrontEnd);
    this.setState({
      tabs: tempTabArray,
      selectedTab: firstSelectedTab,
      currentPermissionList: permessionListFrontEnd,
      userPermissions: userPermList,
      orignalUserPermissions: userPermList,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userPermissions.length !== nextProps.userPermissions.length) {
      this.setState({
        userPermissions: nextProps.userPermissions,
        orignalUserPermissions: nextProps.userPermissions,
      });
    }
    if (this.props.permissionList.length !== nextProps.permissionList.length) {
      let permList = nextProps.permissionList;
      let tempTabArray = [];
      let permessionListFrontEnd = {};
      permList.forEach(element => {
        mapObject(element, function(key, item) {
          let permTabName = _.capitalize(key);
          tempTabArray.push(permTabName);
          permessionListFrontEnd[key] = item;
        });
      });
      let lowerCaseString = _.lowerCase(tempTabArray[0]);
      let firstSelectedTab = _.capitalize(lowerCaseString);
      //    console.log(tempTabArray);
      //    console.log(permessionListFrontEnd);

      this.setState({
        tabs: tempTabArray,
        selectedTab: firstSelectedTab,
        currentPermissionList: permessionListFrontEnd,
      });
    }
  }

  handleClickedTab(selectedTab) {
    //    console.log(selectedTab);
    this.setState({
      selectedTab: selectedTab,
    });
  }

  handlePermissionClick(selectedPermission) {
    //   console.log(selectedPermission);
    const permList = this.state.currentPermissionList;
    let copyCurrentPermList = { ...permList };
    const { userPermissions } = this.state;
    let copyUserPermissionList = [...userPermissions];
    const { tabs } = this.state;
    const { selectedTab } = this.state;
    let selectedTabIndex = 0;
    tabs.forEach((element, index) => {
      if (element == selectedTab) {
        selectedTabIndex = index;
      }
    });
    let lowerCaseTab = _.lowerCase(selectedTab);
    let result = _.find(copyUserPermissionList, function(perm) {
      return perm == selectedPermission;
    });
    if (result) {
      _.pull(copyUserPermissionList, selectedPermission);
    } else {
      copyUserPermissionList.push(selectedPermission);
    }
    // console.log(copyUserPermissionList);
    this.setState({
      userPermissions: copyUserPermissionList,
    });
  }

  handleCancel() {
    this.setState({
      userPermissions: this.state.orignalUserPermissions,
    });
    this.props.cancelAndBackView();
  }

  handleUpdate() {
    this.props.updateHandler(this.state.userPermissions);
  }

  render() {
    const styles = getStyles(this.props, this.state);
    let permissionsCategory = this.state.tabs.map(tab => {
      let selected = false;
      if (tab == this.state.selectedTab) {
        selected = true;
      }
      return <PermissionTabs key={tab} tab={tab} clickedTab={this.handleClickedTab} selectedState={selected} />;
    });
    const { selectedTab } = this.state;
    const { currentPermissionList } = this.state;
    const { tabs } = this.state;
    const { userPermissions } = this.state;
    let permRow = null;
    let lowerCaseTab = _.lowerCase(selectedTab);
    if ((permRow = currentPermissionList[lowerCaseTab])) {
      permRow = currentPermissionList[lowerCaseTab].map((permission, index) => {
        let selected = false;
        userPermissions.forEach(userPerm => {
          if (userPerm == permission) {
            selected = true;
          }
        });

        return (
          <PermissionRow
            key={index}
            index={index}
            permission={permission}
            selected={selected}
            handlePermClick={this.handlePermissionClick}
          />
        );
      });
    }
    return (
      <div>
        <Row>
          <UserProfileViewTitleBar profileTitlebarImg={UserProfileHeaderIcon} titleName="Permissions" />
        </Row>
        <Row>
          <Col md={12}>
            <div style={styles.container}>
              <Row>
                <div style={styles.topContainer}>
                  <div style={styles.avatarStyle}>
                    <Gravatar email={this.props.email} default="mm" className="center-block img-responsive img-circle  " />
                  </div>
                  <div style={styles.UserNameContainerStyle}>
                    <div style={styles.topUserName}>{this.props.userName}</div>
                  </div>
                  <div style={styles.buttonContainer}>
                    <button className="custom-button-theme-4" style={{ marginRight: "5px" }} onClick={this.handleCancel}>
                      {languageService("Cancel")}
                    </button>
                    <button className="custom-button-theme-2" onClick={this.handleUpdate}>
                      {languageService("Update")}
                    </button>
                  </div>
                </div>
              </Row>
              <Row>
                <div>
                  <div>User Permissions</div>
                </div>
              </Row>
              <Row style={styles.tabsContainer}>{permissionsCategory}</Row>
              <Row>
                <Col md={12} style={styles.permisssionsRowContainer}>
                  <div style={styles.permissionHeader}>
                    <div style={styles.permissionHeaderCell}>Permission</div>
                    <div style={styles.permissionHeaderCellRight}>Allow</div>
                  </div>
                  {permRow}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

let getStyles = (props, state) => {
  return {
    container: {
      marginLeft: "20px",
    },
    topContainer: {
      margin: "20px 0px 10px 0px",
    },
    topUserName: {
      fontSize: "20px",
    },
    tabsContainer: {
      border: "1px solid #bebebe",
      marginRight: "5px",
      backgroundColor: "#ead21a",
      borderRadius: "3px",
    },
    avatarStyle: {
      padding: "0px 15px 0px 0px",
      display: "inline-block",
    },
    UserNameContainerStyle: {
      display: "inline-block",
      verticalAlign: "top",
      paddingTop: "10px",
    },
    buttonContainer: {
      display: "inline-block",
      float: "right",
      marginRight: "20px",
    },
    permisssionsRowContainer: {
      scroll: "auto",
      height: "100%",
      padding: "0px",
      margin: "30px 0px",
      width: "100%",
    },
    permissionsRow: {
      padding: "10px ",
      border: "1px solid grey",
      width: "200px",
      cursor: "pointer",
      margin: "10px 10px 10px 0px",
      transitionDuration: "0.4s",
    },
    permissionHeader: {
      backgroundColor: "rgb(179, 179, 179)",
      border: "none",
      color: "rgb(255, 255, 255)",
      height: "35px",
      lineHeight: "25px",
      flex: "100 0 auto",
      width: "97%",
      display: "inline-table",
      margin: "0px 31px 5px 0px",
      padding: "5px 30px 5px 7px",
    },
    permissionHeaderCell: {
      display: "inline-table",
    },
    permissionHeaderCellRight: {
      display: "inline-table",
      float: "right",
      marginRight: "5px",
    },
    permBox: {
      margin: "auto",
      padding: "2em",
      background: "#fcfcfc",
      boxShadow: "0 1px 2px rgba(0,0,0,.3)",
    },
    permRow: {
      margin: "1em 0",
      font: "1.5em/1.4 'Open Sans Condensed', sans-serif",
      color: "#777",
    },
  };
};

export default Radium(UserPermissions);
