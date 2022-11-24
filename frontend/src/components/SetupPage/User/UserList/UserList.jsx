import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import ReactTable from "react-table";
import * as types from "reduxRelated/ActionTypes/actionTypes.js";
import _ from "lodash";
import SvgIcon from "react-icons-kit";
import { pencilSquare } from "react-icons-kit/fa/pencilSquare";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginationComponent from "components/Common/ThisTable/PaginationComponent";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { languageService } from "Language/language.service";
import ThisTable from "components/Common/ThisTable/index";


class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      selected: null,
      spinnerLoading: false,
      page: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.showToastInfo = this.showToastInfo.bind(this);
    this.handlePageSave = this.handlePageSave.bind(this);
    this.showToastError = this.showToastError.bind(this);

    this.columns = [
      {
        Header: languageService("Name"),
        accessor: "name",
      },
      {
        Header: languageService("Email"),
        accessor: "email",
        minWidth: 130,
      },
      {
        Header: languageService("Edit"),
        Cell: ({ row }) => (
          <SvgIcon
            // onClick={e => {
            //     console.log(this);
            //     this.handleClick(e, row);
            // }}
            size={20}
            icon={pencilSquare}
          />
        ),
      },
    ];
  }

  showToastInfo(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  showToastError(message, error) {
    toast.error(message + ": " + error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  componentDidMount() {
    this.props.getUserList();
    this.setState({
      spinnerLoading: true,
    });
  }

  handleClick(e, rowInfo) {
    this.props.handleClick(e, rowInfo);
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_LIST_REQUEST) {
    //   this.setState({
    //     spinnerLoading: true
    //   })
    // }
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_LIST_SUCCESS) {
      const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
      let users = nextProps.userList;

      let isFound = users.find(u => u._id === currentUser._id);

      if (!isFound) {
        users = [currentUser, ...users];
      }

      this.setState({
        userList: users,
        spinnerLoading: false,
      });
    }
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_LIST_FAILURE) {
      this.setState({
        spinnerLoading: false,
      });
    }

    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_CREATE_SUCCESS) {
      this.showToastInfo(languageService("User Created Successfully !"));
      this.props.getUserList();
    }
    if (this.props.actionType !== nextProps.actionType && nextProps.actionType == types.USER_DELETE_SUCCESS) {
    }
    if (this.props.addingUser !== nextProps.addingUser && nextProps.addingUser) {
      this.setState({
        selected: null,
      });
    }
  }
  handlePageSave(page) {
    this.setState({
      page: page,
    });
  }

  render() {
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <div>
        {modelRendered}
        <ThisTable
          tableColumns={this.columns}
          tableData={this.state.userList}
          pageSize={20}
          minRows={1}
          pagination={true}
          forDashboard={this.props.forDashboard ? this.props.forDashboard : false}
          handlePageChange={page => this.handlePageSave(page)}
          page={this.state.page}
          height={"auto"}
          classNameCustom={this.props.classNameCustom}
          handleSelectedClick={this.handleClick}
          onClickSelect
        />

        {/* <ReactTable
          previousText={languageService("previous")}
          nextText={languageService("next")}
          loadingText={languageService("Loading...")}
          noDataText={languageService("No rows found")}
          pageText={languageService("Page")}
          ofText={languageService("of")}
          rowsText={languageService("rows")}
          pageJumpText={languageService("jump to page")}
          rowsSelectorText={languageService("rows per page")}
          data={this.state.userList}
          columns={this.columns}
          showPagination={true}
          showPageJump={false}
          style={{
            border: "none",
            height: this.props.height ? this.props.height : "inherit",
          }}
          PaginationComponent={PaginationComponent}
          pageSize={20}
          minRows={1}
          getTheadGroupProps={(state, rowInfo, column, instance) => {
            return {
              style: {
                backgroundColor: "#B3B3B3",
                //  backgroundColor: "rgba(179, 179, 179, 1)",
              },
            };
          }}
          getTrProps={(state, rowInfo, column, instance) => {
            let index = null;
            if (rowInfo) {
              index = rowInfo.index;
            }
            return {
              onClick: e => {
                this.setState({
                  selected: index,
                });
                this.handleClick(e, rowInfo);
              },
              className: "rowHover",
              style: {
                background: index === this.state.selected ? "rgba(64, 118, 179)" : "#fff",
                color: index === this.state.selected ? "#fff" : "rgba(64, 118, 179)",
                fontSize: "small",
                height: "35px",
              },
            };
          }}
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              style: {
                textAlign: "center",
              },
            };
          }}
        /> */}
      </div>
    );
  }
}

export default UserList;
