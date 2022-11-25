import React, { Component } from "react";
import ThisTable from "components/Common/ThisTable/index";
import moment from "moment";
import ReactTable from "react-table";
import Gravatar from "react-gravatar";
import { check } from "react-icons-kit/metrize/check";
import SvgIcon from "react-icons-kit";
import { getStatusColor } from "utils/statusColors.js";
import PaginationComponent from "components/Common/ThisTable/PaginationComponent";
import { ButtonActionsTable } from "components/Common/Buttons";
import "./imgstyle.css";
import "components/Common/ImageGallery/style.css";
import { ModalStyles } from "components/Common/styles.js";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { getServerEndpoint } from "utils/serverEndpoint";
import _ from "lodash";
import { ButtonMain } from "components/Common/Buttons";
import { isNullOrUndefined } from "util";
import IssueFilter from "./IssueFilter.jsx";
import ResponseForm from "components/JourneyPlan/JourneyPlanDetail/TasksTableList/ResponseForm";

class FieldMonitoringList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImg: "",
      imgModal: false,
      filteredData: [],
      filterTodayOrAll: "today",
      imgsList: [],
      showMultipleImgs: false,
      imgDescription: "",
      pivot: ["userName", "taskTitle"],
      showBackButton: false,
      formModal: false,
      selectedTaskForms: {},
    };

    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.showTaskResponseForms = this.showTaskResponseForms.bind(this);
    this.columns = [
      {
        Header: "User",
        id: "userName",
        // PivotValue: ({ value, subRows }) => {
        //   let activeTaskCount = subRows.length.toString()
        //   let updatedVal = value.replace('activeTasks', activeTaskCount)
        //   return <span>{updatedVal}</span>
        // },
        accessor: (d) => {
          let userName = "";
          let activeByTotal = "";
          if (d.userName) {
            userName = d.userName;
          }
          if (d.totalTasks) {
            let totalLength = d.totalTasks;
            activeByTotal = "(" + "activeTasks" + "/" + totalLength + ")";
          }

          return userName;
        },

        Aggregated: (row) => <span />,
        minWidth: 150,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      {
        Header: "Task Title",
        accessor: (d) => {
          let taskTitle = "";
          let activeByTotal = "";
          if (d.userName) {
            taskTitle = d.taskTitle;
          }
          if (d.issuesCount) {
            let totalLength = d.issuesCount;
            activeByTotal = "(" + totalLength + ")";
          }

          return taskTitle + " " + activeByTotal;
        },
        PivotValue: ({ value, subRows }) => {
          return <span>{value}</span>;
        },

        Aggregated: (row) => <span />,
        id: "taskTitle",
        minWidth: 140,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      {
        Header: "Issue",
        accessor: "description",
        Aggregated: (row) => <span />,
        id: "description",
        minWidth: 120,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      {
        Header: "Date",
        id: "date",
        accessor: (d) => {
          let date = "";
          let planDate = { date: "", taskDate: true };

          if (d.timeStamp) {
            date = moment.utc(d.timeStamp).local().format("llll");
          }
          if (d.date) {
            planDate = { date: moment(d.date).format("LL"), taskDate: true };
          }
          if (d.date && d.taskTitle !== "No Task Started") {
            planDate = { date: moment(d.date).format("LL"), taskDate: false };
          }
          return <div value={planDate}>{date} </div>;
        },
        aggregate: (values, rows) => {
          let date = "";
          if (rows[0]._nestingLevel == 1) {
            let jPlanDate = rows[0]._subRows[0]._original.date;
            if (jPlanDate) {
              date = moment(jPlanDate).format("LL");
            }
            return date;
          }
          if (rows[0]._nestingLevel == 0) {
            if (rows[0]._original.taskTitle !== "No Task Started") {
              date = moment(rows[0]._original.date).format("LL");
              return date;
            }
          }
        },
        Aggregated: (row) => {
          return <span>{row.value}</span>;
        },
        minWidth: 170,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      {
        Header: "Start Time",
        id: "startTime",
        accessor: (d) => {
          return <div>{""} </div>;
        },
        aggregate: (values, rows, row) => {
          if (rows[0]._nestingLevel == 1) {
            let date = "";
            let jPlanStartTimeHere = rows[0]._subRows[0]._original.jPlanStartTime;
            if (jPlanStartTimeHere !== "N/A" && jPlanStartTimeHere) {
              let momentDate = moment(jPlanStartTimeHere);

              date = momentDate.format("lll");
            }
            return date;
          }
          if (rows[0]._nestingLevel == 0) {
            let date = "";
            let taskStartTime = rows[0]._original.tStartTime;
            if (taskStartTime) {
              date = moment(taskStartTime).format("lll");
            }
            return date;
          }
        },
        Aggregated: (row) => {
          // //console.log('aggreateRow')
          // //console.log(row)
          return <span>{row.value}</span>;
        },
        minWidth: 170,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      {
        Header: "End Time",
        id: "endTime",
        accessor: (d) => {
          return <div>{""} </div>;
        },
        aggregate: (values, rows) => {
          if (rows[0]._nestingLevel == 1) {
            let date = "";
            let jPlanEndTimeHere = rows[0]._subRows[0]._original.jPlanEndTime;
            if (jPlanEndTimeHere !== "N/A" && jPlanEndTimeHere) {
              let momentDate = moment(jPlanEndTimeHere);

              date = momentDate.format("LTS");
            }
            return date;
          }
          if (rows[0]._nestingLevel == 0) {
            let date = "";
            let taskEndTime = rows[0]._original.tEndTime;
            if (taskEndTime) {
              date = moment(taskEndTime).format("lll");
            }
            return date;
          }
        },
        Aggregated: (row) => {
          return <span>{row.value}</span>;
        },
        minWidth: 170,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      // {
      //   Header: 'Latitude',
      //   id: 'locationLat',
      //   Aggregated: row => <span />,
      //   accessor: d => {
      //     let str = d.location
      //     let loc = ''
      //     if (str) {
      //       const [lat, lon] = str.split(',')
      //       loc = lat
      //     }
      //     return <div>{loc}</div>
      //   },
      //   minWidth: 75,

      //   getHeaderProps: () => {
      //     return {
      //       style: {
      //         border: 'none',
      //         color: '"var(--first)"',
      //         fontSize: '12px',
      //         letterSpacing: '0.3px',
      //         backgroundColor: 'rgba(227, 233, 239, 1)'
      //       }
      //     }
      //   }
      // },
      // {
      //   Header: 'Longitude',
      //   id: 'locationLon',
      //   Aggregated: row => <span />,
      //   accessor: d => {
      //     let str = d.location
      //     let loc = ''
      //     if (str) {
      //       const [lat, lon] = str.split(',')
      //       loc = lon
      //     }

      //     return <div>{loc}</div>
      //   },
      //   minWidth: 75,

      //   getHeaderProps: () => {
      //     return {
      //       style: {
      //         border: 'none',
      //         color: '"var(--first)"',
      //         fontSize: '12px',
      //         letterSpacing: '0.3px',
      //         backgroundColor: 'rgba(227, 233, 239, 1)'
      //       }
      //     }
      //   }
      // },
      {
        Header: "Start Location Lat/Lon",
        id: "startLocation",
        aggregate: (values, rows) => {
          if (rows[0]._nestingLevel == 1) {
            let planStr = rows[0]._subRows[0]._original.jPlanStartLocation;
            let valueTaskStartLoc = "";
            let linkSrc = "#";
            if (planStr !== "N/A" && planStr) {
              const [lat, lon] = planStr.split(",");
              valueTaskStartLoc = `Lat: ${lat}, Lon: ${lon}`;
              linkSrc = "https://www.google.com/maps/place/" + planStr;
            }
            return (
              <a href={linkSrc} style={{ color: "inherit" }} target="_blank">
                {valueTaskStartLoc}
              </a>
            );
          }
          if (rows[0]._nestingLevel == 0) {
            let taskStr = rows[0]._original.tStartLoc;
            let valueTaskStartLoc = "";
            let linkSrc = "#";
            if (taskStr) {
              const [lat, lon] = taskStr.split(",");
              valueTaskStartLoc = `Lat: ${lat}, Lon: ${lon}`;
              linkSrc = "https://www.google.com/maps/place/" + taskStr;
            }
            return (
              <a href={linkSrc} style={{ color: "inherit" }} target="_blank">
                {valueTaskStartLoc}
              </a>
            );
          }
        },
        Aggregated: (row) => {
          return <span>{row.value}</span>;
        },
        accessor: (d) => {
          let str = d.location;
          let valueTaskStartLoc = "";
          let linkSrc = "#";
          if (str) {
            const [lat, lon] = str.split(",");
            valueTaskStartLoc = `Lat: ${lat}, Lon: ${lon}`;
            linkSrc = "https://www.google.com/maps/place/" + str;
          }

          return (
            <div>
              <a href={linkSrc} style={{ color: "inherit" }} target="_blank">
                {valueTaskStartLoc}
              </a>
            </div>
          );
        },
        minWidth: 240,

        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      {
        Header: "End Location Lat/Lon",
        id: "endLocation",
        Aggregated: (row) => <span />,
        accessor: (d) => {
          return <div />;
        },
        minWidth: 240,
        aggregate: (values, rows) => {
          if (rows[0]._nestingLevel == 1) {
            let planStr = rows[0]._subRows[0]._original.jPlanEndLocation;
            let valuePlanEndLoc = "";
            let linkSrc = "#";
            if (planStr !== "N/A" && planStr) {
              const [lat, lon] = planStr.split(",");
              valuePlanEndLoc = `Lat: ${lat}, Lon: ${lon}`;
              linkSrc = "https://www.google.com/maps/place/" + planStr;
            }
            return (
              <a href={linkSrc} style={{ color: "inherit" }} target="_blank">
                {valuePlanEndLoc}
              </a>
            );
          }
          if (rows[0]._nestingLevel == 0) {
            let taskStr = rows[0]._original.tEndLoc;
            let valueTaskEndLoc = "";
            let linkSrc = "#";
            if (taskStr) {
              const [lat, lon] = taskStr.split(",");
              valueTaskEndLoc = `Lat: ${lat}, Lon: ${lon}`;
              linkSrc = "https://www.google.com/maps/place/" + taskStr;
            }
            return (
              <a href={linkSrc} style={{ color: "inherit" }} target="_blank">
                {valueTaskEndLoc}
              </a>
            );
          }
        },
        Aggregated: (row) => {
          return <span>{row.value}</span>;
        },
        accessor: (d) => {
          return <div />;
        },
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      {
        Header: "Forms",
        id: "forms",
        accessor: (d) => {
          return <div />;
        },
        aggregate: (values, rows, row) => {
          if (rows[0]._nestingLevel == 0) {
            let date = "";
            let taskStartTime = rows[0]._original.tStartTime;
            if (taskStartTime) {
              date = moment(taskStartTime).format("lll");
            }
            return (
              <div>
                {rows[0]._original.taskTitle !== "No Task Started" && (
                  <ButtonActionsTable
                    handleClick={(e) => {
                      this.showTaskResponseForms(rows[0]._original);
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={"Forms"}
                  />
                )}
              </div>
            );
          }
        },
        minWidth: 50,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
      },
      {
        Header: "Marked",
        id: "marked",
        accessor: (d) => {
          return <div style={{ color: "inherit" }}>{d.marked && <SvgIcon size={20} icon={check} />}</div>;
        },
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
        Aggregated: (row) => <span />,

        minWidth: 60,
      },

      {
        Header: "Images",
        id: "imgList",
        minWidth: 140,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
        Aggregated: (row) => <span />,
        accessor: (d) => {
          let imgListing = null;
          let more = "";
          if (d.imgList) {
            imgListing = d.imgList.map((img, index) => {
              if (index < 3) {
                let imgName = "";
                if (img) {
                  imgName = img.imgName;
                }
                let paths = getServerEndpoint() + "thumbnails/" + imgName;
                return (
                  <div className="colsIssueImgs" key={index}>
                    <img
                      onClick={(e) => {
                        this.handleImgShow(imgName, d);
                      }}
                      src={paths}
                      style={{
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        border: "1px solid #e3e9ef",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                );
              }
            });

            if (d.imgList.length > 2) {
              more = "...";
            }
          }

          return (
            <div>
              {" "}
              {imgListing}
              <div
                className="moreImgs"
                onClick={(e) => {
                  this.handleImgMultiples(d);
                }}
              >
                {" "}
                {more}
              </div>{" "}
            </div>
          );
        },
      },
      {
        Header: "Priority",
        id: "priority",
        minWidth: 150,
        getHeaderProps: () => {
          return {
            style: {
              border: "none",
              color: "var(--first)",
              fontSize: "12px",
              letterSpacing: "0.3px",
              backgroundColor: "rgba(227, 233, 239, 1)",
            },
          };
        },
        Aggregated: (row) => <span />,
        width: 150,
        accessor: (d) => {
          return (
            <div
              style={{
                background: getStatusColor(d.priority),
                padding: "5px",
                margin: "15px",
                borderRadius: "2px",
                color: "var(--fifth)",
              }}
            >
              {" "}
              {d.priority}
            </div>
          );
        },
      },
      // {
      //   Header: 'Actions',
      //   id: 'actions',
      //   Aggregated: row => <span />,
      //   accessor: d => {
      //     return (
      //       <div>
      //         <ButtonActionsTable
      //           handleClick={e => {
      //             this.props.handleResolveClick(d)
      //           }}
      //           margin="0px 10px 0px 0px"
      //           buttonText={'Resolve'}
      //         />
      //       </div>
      //     )
      //   },
      //   minWidth: 150,
      //   getHeaderProps: () => {
      //     return {
      //       style: {
      //         border: 'none',
      //         color: '"var(--first)"',
      //         fontSize: '12px',
      //         letterSpacing: '0.3px',
      //         backgroundColor: 'rgba(227, 233, 239, 1)'
      //       }
      //     }
      //   }
      // }
    ];

    this.handleImgShow = this.handleImgShow.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleImgMultiples = this.handleImgMultiples.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleSingleImgFromMultiple = this.handleSingleImgFromMultiple.bind(this);
    this.checkTodayAllFilter = this.checkTodayAllFilter.bind(this);
    this.handleFilterPivotBy = this.handleFilterPivotBy.bind(this);
  }

  showTaskResponseForms(data) {
    console.log(data);
    let task = {};
    let findPlan = _.find(this.props.journeyPlans, { _id: data.planId });
    if (findPlan) {
      let findTask = _.find(findPlan.tasks, { taskId: data.taskId });
      task = findTask ? findTask : {};
    }
    this.setState({
      formModal: !this.state.formModal,
      selectedTaskForms: task,
    });
  }

  handleImgShow(img, data) {
    let imgDescription = "";
    if (data) {
      imgDescription = data.description;
    }
    this.setState({
      imgModal: !this.state.imgModal,
      selectedImg: img,
      showMultipleImgs: false,
      imgDescription: imgDescription,
      showBackButton: false,
    });
  }

  handleImgMultiples(data) {
    let imgDescription = "";
    let imgList = [];
    if (data) {
      imgList = data.imgList;
      imgDescription = data.description;
    }

    this.setState({
      imgModal: !this.state.imgModal,
      imgsList: imgList,
      showMultipleImgs: true,
      imgDescription: imgDescription,
    });
  }

  handleSingleImgFromMultiple(img) {
    this.setState({
      selectedImg: img,
      showMultipleImgs: false,
      showBackButton: true,
    });
  }

  handleToggle() {
    this.setState({
      imgModal: !this.state.imgModal,
      showMultipleImgs: false,
      showBackButton: false,
    });
  }

  handleBackButton() {
    this.setState({
      showMultipleImgs: true,
      showBackButton: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tableData.length !== this.props.tableData.length) {
      this.checkTodayAllFilter(this.state.filterTodayOrAll);
    }
  }

  checkTodayAllFilter(filterName) {
    let filteredData = [];
    if (filterName == "today") {
      this.props.tableData.forEach((issueObj) => {
        let issueDate = moment(issueObj.date).format("ll");
        let today = moment().format("ll");
        let todayCheck = moment(issueDate).isSame(moment(today));
        if (todayCheck) {
          filteredData.push(issueObj);
        }
      });
      if (filteredData.length == 0) {
        filteredData = this.props.tableData;
        filterName = "all";
      }
    } else if (filterName == "all") {
      filteredData = this.props.tableData;
    }
    this.setState({
      filteredData: filteredData,
      filterTodayOrAll: filterName,
    });
  }

  handleFilterPivotBy(filterName) {
    this.setState({
      pivot: [filterName],
    });
  }

  handleModalToggle() {
    this.setState({
      formModal: !this.state.formModal,
    });
  }

  render() {
    let columns = this.columns;
    if (this.props.forDashboard) {
      _.remove(this.columns, { id: "actions" });
      _.remove(this.columns, { id: "description" });

      _.remove(this.columns, { id: "imgList" });
      _.remove(this.columns, { id: "locationLat" });
      _.remove(this.columns, { id: "locationLon" });
    }

    let imgComp = null;
    if (this.state.imgsList && this.state.showMultipleImgs) {
      imgComp = this.state.imgsList.map((img, index) => {
        let imgName = "";
        if (img) {
          imgName = img.imgName;
        }
        let paths = getServerEndpoint() + "thumbnails/" + imgName;
        //  //console.log(paths)
        return (
          <div className="colsImgs" key={index}>
            <img
              src={paths}
              style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
              alt={imgName}
              onClick={(e) => {
                this.handleSingleImgFromMultiple(imgName);
              }}
            />
          </div>
        );
      });
    }
    let imgSelect = (
      <div style={{ padding: "10px", transitionDuration: " 0.4s", background: "#f7f7f7", border: " 1px solid #e0e0e0" }}>
        <img
          src={getServerEndpoint() + "applicationresources/" + this.state.selectedImg}
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            border: "1px solid #e3e9ef",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
    );

    if (this.state.showMultipleImgs) {
      imgSelect = (
        <div>
          <div className="rowsOfImgs">{imgComp}</div>
        </div>
      );
    }

    return (
      <div style={{ padding: "15px", width: "-webkit-fill-available" }}>
        <ResponseForm
          modal={this.state.formModal}
          task={this.state.selectedTaskForms}
          toggle={this.handleModalToggle}
          handleClose={this.handleModalToggle}
        />
        <Modal isOpen={this.state.imgModal} toggle={this.handleToggle}>
          <ModalHeader style={ModalStyles.modalTitleStyle}>{this.state.imgDescription}</ModalHeader>
          <ModalBody>{imgSelect}</ModalBody>
          <ModalFooter style={ModalStyles.footerButtonsContainer}>
            <ButtonMain
              buttonText="Close"
              handleClick={(e) => {
                this.handleImgShow("");
              }}
            />
            {this.state.showBackButton && (
              <ButtonMain
                buttonText="Back"
                margin="0px 0px 0px 10px"
                handleClick={(e) => {
                  this.handleBackButton();
                }}
              />
            )}
          </ModalFooter>
        </Modal>
        {!this.props.noFilter && (
          <IssueFilter
            checkTodayAllFilter={this.checkTodayAllFilter}
            handleFilterPivotBy={this.handleFilterPivotBy}
            filterTodayOrAll={this.state.filterTodayOrAll}
          />
        )}
        <div style={{ padding: "15px", background: "var(--fifth)", boxShadow: "3px 3px 5px #cfcfcf" }}>
          <div>
            <ReactTable
              data={this.props.tableData}
              columns={columns}
              pivotBy={this.state.pivot}
              showPagination={true}
              minRows={1}
              pageSize={10}
              className="scrollbar"
              style={{
                border: "none",
              }}
              collapseOnDataChange={false}
              getTableProps={(state, rowInfo, column, instance) => {
                return {
                  className: "scrollbarHor",
                };
              }}
              getTbodyProps={(state, rowInfo, column, instance) => {
                return {
                  className: "scrollbar",
                };
              }}
              getTrProps={(state, rowInfo, column, instance) => {
                let indexRow = null;
                if (rowInfo) {
                  indexRow = rowInfo.index;
                }
                return {
                  className: "rowHover",
                  style: {
                    fontSize: "12px",
                    color: "var(--first)",
                    fontFamily: "Arial",
                    letterSpacing: "0.3px",
                    height: "35px",
                  },
                };
              }}
              getTrGroupProps={(state, rowInfo, column, instance) => {
                return {
                  style: {
                    borderBottom: "1px solid rgb(227, 233, 239)",
                  },
                };
              }}
              getTdProps={(state, rowInfo, column, instance) => {
                return {
                  style: {
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  },
                };
              }}
              showPageJump={false}
              PaginationComponent={PaginationComponent}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default FieldMonitoringList;
