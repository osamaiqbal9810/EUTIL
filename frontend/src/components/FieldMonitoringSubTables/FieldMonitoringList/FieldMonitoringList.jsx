import React, { Component } from 'react'
import ThisTable from 'components/Common/ThisTable/index'
import moment from 'moment'
import ReactTable from 'react-table'
import Gravatar from 'react-gravatar'
import { check } from 'react-icons-kit/metrize/check'
import SvgIcon from 'react-icons-kit'
import { getStatusColor } from 'utils/statusColors.js'
import PaginationComponent from 'components/Common/ThisTable/PaginationComponent'
import { ButtonActionsTable } from 'components/Common/Buttons'
import './imgstyle.css'
import 'components/Common/ImageGallery/style.css'
import { ModalStyles } from 'components/Common/styles.js'
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { getServerEndpoint } from 'utils/serverEndpoint'
import _ from 'lodash'
import { ButtonMain } from 'components/Common/Buttons'
import { isNullOrUndefined } from 'util'
import IssueFilter from './IssueFilter.jsx'
import ResponseForm from 'components/JourneyPlan/JourneyPlanDetail/TasksTableList/ResponseForm'
import AudioComponent from 'components/IssuesReports/IssuesList/AudioComponent'
import { ic_keyboard_arrow_left } from 'react-icons-kit/md/ic_keyboard_arrow_left'
import { ic_keyboard_arrow_right } from 'react-icons-kit/md/ic_keyboard_arrow_right'
import FieldMonitorIssueTable from './FieldMonitorIssueTable'
class FieldMonitoringList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedImg: '',
      imgModal: false,
      filteredData: [],
      filterTodayOrAll: 'today',
      imgsList: [],
      showMultipleImgs: false,
      imgDescription: '',
      pivot: ['userName', 'taskTitle'],
      showBackButton: false,
      formModal: false,
      selectedTaskForms: {}
    }

    this.columns = [
      {
        Header: 'User',
        id: 'userName',
        // PivotValue: ({ value, subRows }) => {
        //   let activeTaskCount = subRows.length.toString()
        //   let updatedVal = value.replace('activeTasks', activeTaskCount)
        //   return <span>{updatedVal}</span>
        // },
        accessor: d => {
          let userName = ''
          let activeByTotal = ''
          if (d.user) {
            userName = d.user.name
          }

          return userName
        },
        minWidth: 150
      },
      {
        Header: 'Title',
        accessor: 'title',
        minWidth: 150
      },
      {
        Header: 'Start Date',
        id: 'startDatePlan',
        accessor: d => {
          let planDate = ''
          if (d.startDateTime) {
            planDate = moment(d.startDateTime).format('LLLL')
          }
          return <div style={{ textAlign: 'center' }}>{planDate}</div>
        },
        minWidth: 240
      },
      {
        Header: 'Start Location Lat/Lon',
        id: 'startLocationPlan',
        accessor: d => {
          let str = d.startLocation
          let valueStartLoc = ''
          let linkSrc = '#'
          if (str) {
            const [lat, lon] = str.split(',')
            valueStartLoc = `Lat: ${lat}, Lon: ${lon}`
            linkSrc = 'https://www.google.com/maps/place/' + str
          }
          return (
            <div style={{ textAlign: 'center' }}>
              <a href={linkSrc} style={{ color: 'inherit' }} target="_blank">
                {valueStartLoc}
              </a>
            </div>
          )
        },
        minWidth: 240
      }
    ]

    // TASK COLUMNS

    this.taskColumns = [
      {
        Header: 'Task Title',
        accessor: d => {
          return d.title
        },
        id: 'taskTitle',
        minWidth: 140
      },
      {
        Header: 'Start Time',
        id: 'startTimeTask',
        accessor: d => {
          let taskDate = ''
          if (d.startTime) {
            taskDate = moment(d.startTime).format('LLLL')
          }
          return <div style={{ textAlign: 'center' }}>{taskDate}</div>
        },
        minWidth: 240
      },
      {
        Header: 'Start Location Lat/Lon',
        id: 'startLocationTask',
        accessor: d => {
          let str = d.startLocation
          let valueStartLoc = ''
          let linkSrc = '#'
          if (str) {
            const [lat, lon] = str.split(',')
            valueStartLoc = `Lat: ${lat}, Lon: ${lon}`
            linkSrc = 'https://www.google.com/maps/place/' + str
          }
          return (
            <div style={{ textAlign: 'center' }}>
              <a href={linkSrc} style={{ color: 'inherit' }} target="_blank">
                {valueStartLoc}
              </a>
            </div>
          )
        },
        minWidth: 240
      },
      {
        Header: 'End Location Lat/Lon',
        id: 'endLocationTask',
        accessor: d => {
          let str = d.endLocation
          let valueEndLoc = ''
          let linkSrc = '#'
          if (str) {
            const [lat, lon] = str.split(',')
            valueEndLoc = `Lat: ${lat}, Lon: ${lon}`
            linkSrc = 'https://www.google.com/maps/place/' + str
          }
          return (
            <div style={{ textAlign: 'center' }}>
              <a href={linkSrc} style={{ color: 'inherit' }} target="_blank">
                {valueEndLoc}
              </a>
            </div>
          )
        },
        minWidth: 240
      },
      {
        Header: 'End Time',
        id: 'endDateTask',
        accessor: d => {
          let taskDate = ''
          if (d.endTime) {
            taskDate = moment(d.endTime).format('LLLL')
          }
          return <div style={{ textAlign: 'center' }}>{taskDate}</div>
        },
        minWidth: 240
      },
      {
        Header: 'Forms',
        id: 'forms',
        accessor: d => {
          return <div />
        },
        aggregate: (values, rows, row) => {
          if (rows[0]._nestingLevel == 0) {
            let date = ''
            let taskStartTime = rows[0]._original.tStartTime
            if (taskStartTime) {
              date = moment(taskStartTime).format('lll')
            }
            return (
              <div>
                {rows[0]._original.taskTitle !== 'No Task Started' && (
                  <ButtonActionsTable
                    handleClick={e => {
                      this.showTaskResponseForms(rows[0]._original)
                    }}
                    margin="0px 10px 0px 0px"
                    buttonText={'Forms'}
                  />
                )}
              </div>
            )
          }
        },
        minWidth: 50
      }
    ]
    // ISSUE COLUMNS
    // this.issueColumns = [
    //   {
    //     Header: 'Issue',
    //     accessor: 'description',
    //     Aggregated: row => <span />,
    //     id: 'description',
    //     minWidth: 120
    //   },
    //   {
    //     Header: 'Issue Time',
    //     id: 'issuetime',
    //     accessor: d => {
    //       let issueTimeStamp = ''
    //       if (d.timeStamp) {
    //         issueTimeStamp = moment(d.timeStamp).format('LLLL')
    //       }
    //       return <div style={{ textAlign: 'center' }}>{issueTimeStamp}</div>
    //     },
    //     minWidth: 240
    //   },
    //   {
    //     Header: 'Marked',
    //     id: 'marked',
    //     accessor: d => {
    //       return <div style={{ color: 'inherit', textAlign: 'center' }}>{d.marked && <SvgIcon size={20} icon={check} />}</div>
    //     },
    //     Aggregated: row => <span />,

    //     minWidth: 60
    //   },
    //   {
    //     Header: 'Audio',
    //     id: 'audio',
    //     accessor: d => {
    //       let audioList = []
    //       let audioName = ''
    //       let nextPrevButtons = false
    //       let indexToShow = ''
    //       if (d.voiceList) {
    //         audioList = d.voiceList
    //         if (d.voiceList.length > 0) {
    //           if (d.voiceList.length > 1) {
    //             nextPrevButtons = true
    //             indexToShow = '1/' + d.voiceList.length
    //           }
    //           if (this.state.indexAudioFileMap[d.timeStamp]) {
    //             audioName = audioList[this.state.indexAudioFileMap[d.timeStamp]].voiceName
    //           } else {
    //             audioName = audioList[0].voiceName
    //           }
    //         }
    //         if (this.state.indexAudioFileMap[d.timeStamp] || this.state.indexAudioFileMap[d.timeStamp] == 0) {
    //           indexToShow = this.state.indexAudioFileMap[d.timeStamp] + 1 + '/' + d.voiceList.length
    //           if (d.voiceList.length < 2) {
    //             nextPrevButtons = false
    //             indexToShow = ''
    //           }
    //         }
    //       }

    //       let paths = 'http://' + serverEndpoint + 'audio/' + audioName
    //       return (
    //         <div style={{ textAlign: 'center' }}>
    //           <div style={{ display: 'inline-block', minWidth: '20px', verticalAlign: 'super' }}>{indexToShow} </div>
    //           {nextPrevButtons && (
    //             <div
    //               style={{ display: 'inline-block', minWidth: '10px' }}
    //               onClick={e => {
    //                 this.handlePrevNext('Prev', audioList, d.timeStamp)
    //               }}
    //             >
    //               <SvgIcon size={20} icon={ic_keyboard_arrow_left} />
    //             </div>
    //           )}
    //           <div style={{ display: 'inline-block' }}>
    //             {/* <div style={{ textAlign: 'center' }}>{indexToShow} </div> */}
    //             <AudioComponent paths={paths} />
    //           </div>
    //           {nextPrevButtons && (
    //             <div
    //               style={{ display: 'inline-block' }}
    //               onClick={e => {
    //                 this.handlePrevNext('Next', audioList, d.timeStamp)
    //               }}
    //             >
    //               <SvgIcon size={20} icon={ic_keyboard_arrow_right} />
    //             </div>
    //           )}
    //         </div>
    //       )
    //     },
    //     Aggregated: row => <span />,
    //     minWidth: 320,
    //     getHeaderProps: () => {
    //       return {
    //         style: {
    //           border: 'none',
    //           color: 'rgba(64, 118, 179)',
    //           fontSize: '12px',
    //           letterSpacing: '0.3px',
    //           backgroundColor: 'rgba(227, 233, 239, 1)'
    //         }
    //       }
    //     }
    //   },
    //   {
    //     Header: 'Images',
    //     id: 'imgList',
    //     width: 160,
    //     Aggregated: row => <span />,
    //     accessor: d => {
    //       let imgListing = null
    //       let more = ''
    //       if (d.imgList) {
    //         imgListing = d.imgList.map((img, index) => {
    //           if (index < 3) {
    //             let imgName = ''
    //             if (img) {
    //               imgName = img.imgName
    //             }
    //             let paths = 'http://' + serverEndpoint + 'thumbnails/' + imgName
    //             return (
    //               <div className="colsIssueImgs" key={index}>
    //                 <img
    //                   onClick={e => {
    //                     this.handleImgShow(imgName, d)
    //                   }}
    //                   src={paths}
    //                   style={{
    //                     display: 'block',
    //                     marginLeft: 'auto',
    //                     marginRight: 'auto',
    //                     border: '1px solid #e3e9ef',
    //                     borderRadius: '50%'
    //                   }}
    //                 />
    //               </div>
    //             )
    //           }
    //         })

    //         if (d.imgList.length > 2) {
    //           more = '...'
    //         }
    //       }

    //       return (
    //         <div>
    //           {' '}
    //           {imgListing}
    //           <div
    //             className="moreImgs"
    //             onClick={e => {
    //               this.handleImgMultiples(d)
    //             }}
    //           >
    //             {' '}
    //             {more}
    //           </div>{' '}
    //         </div>
    //       )
    //     }
    //   },
    //   {
    //     Header: 'Priority',
    //     id: 'priority',
    //     minWidth: 150,
    //     Aggregated: row => <span />,
    //     width: 150,
    //     accessor: d => {
    //       return (
    //         <div
    //           style={{
    //             background: getStatusColor(d.priority),
    //             padding: '5px',
    //             margin: '15px',
    //             borderRadius: '2px',
    //             color: '#fff'
    //           }}
    //         >
    //           {' '}
    //           {d.priority}
    //         </div>
    //       )
    //     }
    //   }
    // ]

    this.handleImgShow = this.handleImgShow.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleImgMultiples = this.handleImgMultiples.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.handleSingleImgFromMultiple = this.handleSingleImgFromMultiple.bind(this)
    this.checkTodayAllFilter = this.checkTodayAllFilter.bind(this)
    this.handleFilterPivotBy = this.handleFilterPivotBy.bind(this)
    //  this.updateIndexAudioFileMap = this.updateIndexAudioFileMap.bind(this)
    //  this.handlePrevNext = this.handlePrevNext.bind(this)
    this.handleModalToggle = this.handleModalToggle.bind(this)
    this.showTaskResponseForms = this.showTaskResponseForms.bind(this)
  }

  // updateIndexAudioFileMap(tableData) {
  //   const { indexAudioFileMap } = this.state
  //   let copyIndexAudioMap = { ...indexAudioFileMap }
  //   tableData.forEach(plan => {
  //     if (plan.tasks) {
  //       plan.tasks.forEach(task => {
  //         if (task.issues) {
  //           task.issues.forEach(issue => {
  //             if (issue) {
  //               if (!copyIndexAudioMap[issue.timeStamp]) {
  //                 copyIndexAudioMap[issue.timeStamp] = 0
  //               }
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })

  //   this.setState({
  //     indexAudioFileMap: copyIndexAudioMap
  //   })
  // }

  // handlePrevNext(action, voiceList, timeStamp) {
  //   const { indexAudioFileMap } = this.state
  //   let copyIndexAudioMap = { ...indexAudioFileMap }
  //   if (action == 'Prev') {
  //     if (this.state.indexAudioFileMap[timeStamp] !== 0) {
  //       copyIndexAudioMap[timeStamp] = copyIndexAudioMap[timeStamp] - 1
  //       this.setState({
  //         indexAudioFileMap: copyIndexAudioMap
  //       })
  //     }
  //   } else {
  //     if (this.state.indexAudioFileMap[timeStamp] + 1 !== voiceList.length && voiceList.length > 0) {
  //       copyIndexAudioMap[timeStamp] = copyIndexAudioMap[timeStamp] + 1
  //       this.setState({
  //         indexAudioFileMap: copyIndexAudioMap
  //       })
  //     }
  //   }
  // }

  showTaskResponseForms(data) {
    let task = {}
    let findPlan = _.find(this.props.journeyPlans, { _id: data.planId })
    if (findPlan) {
      let findTask = _.find(findPlan.tasks, { taskId: data.taskId })
      task = findTask ? findTask : {}
    }
    this.setState({
      formModal: !this.state.formModal,
      selectedTaskForms: task
    })
  }

  handleImgShow(img, data) {
    let imgDescription = ''
    if (data) {
      imgDescription = data.description
    }
    this.setState({
      imgModal: !this.state.imgModal,
      selectedImg: img,
      showMultipleImgs: false,
      imgDescription: imgDescription,
      showBackButton: false
    })
  }

  handleImgMultiples(data) {
    let imgDescription = ''
    let imgList = []
    if (data) {
      imgList = data.imgList
      imgDescription = data.description
    }

    this.setState({
      imgModal: !this.state.imgModal,
      imgsList: imgList,
      showMultipleImgs: true,
      imgDescription: imgDescription
    })
  }

  handleSingleImgFromMultiple(img) {
    this.setState({
      selectedImg: img,
      showMultipleImgs: false,
      showBackButton: true
    })
  }

  handleToggle() {
    this.setState({
      imgModal: !this.state.imgModal,
      showMultipleImgs: false,
      showBackButton: false
    })
  }

  handleBackButton() {
    this.setState({
      showMultipleImgs: true,
      showBackButton: false
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tableData.length !== this.props.tableData.length) {
      this.checkTodayAllFilter(this.state.filterTodayOrAll)
      //  this.updateIndexAudioFileMap(this.props.tableData)
    }
  }

  checkTodayAllFilter(filterName) {
    let filteredData = []
    // if (filterName == 'today') {
    //   this.props.tableData.forEach(issueObj => {
    //     let issueDate = moment(issueObj.date).format('ll')
    //     let today = moment().format('ll')
    //     let todayCheck = moment(issueDate).isSame(moment(today))
    //     if (todayCheck) {
    //       filteredData.push(issueObj)
    //     }
    //   })
    //   if (filteredData.length == 0) {
    //     filteredData = this.props.tableData
    //     filterName = 'all'
    //   }
    // } else if (filterName == 'all') {
    filteredData = this.props.tableData
    // }
    this.setState({
      filteredData: filteredData,
      filterTodayOrAll: filterName
    })
  }

  handleFilterPivotBy(filterName) {
    this.setState({
      pivot: [filterName]
    })
  }

  handleModalToggle() {
    this.setState({
      formModal: !this.state.formModal
    })
  }

  render() {
    let columns = this.columns
    if (this.props.forDashboard) {
      _.remove(this.columns, { id: 'actions' })
      _.remove(this.columns, { id: 'description' })

      _.remove(this.columns, { id: 'imgList' })
      _.remove(this.columns, { id: 'locationLat' })
      _.remove(this.columns, { id: 'locationLon' })
    }

    let imgComp = null
    if (this.state.imgsList && this.state.showMultipleImgs) {
      imgComp = this.state.imgsList.map((img, index) => {
        let imgName = ''
        if (img) {
          imgName = img.imgName
        }
        let paths = 'http://' + getServerEndpoint() + 'thumbnails/' + imgName
        //  //console.log(paths)
        return (
          <div className="colsImgs" key={index}>
            <img
              src={paths}
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
              alt={imgName}
              onClick={e => {
                this.handleSingleImgFromMultiple(imgName)
              }}
            />
          </div>
        )
      })
    }
    let imgSelect = (
      <div style={{ padding: '10px', transitionDuration: ' 0.4s', background: '#f7f7f7', border: ' 1px solid #e0e0e0' }}>
        <img
          src={'http://' + getServerEndpoint() + 'applicationresources/' + this.state.selectedImg}
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            border: '1px solid #e3e9ef',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
    )

    if (this.state.showMultipleImgs) {
      imgSelect = (
        <div>
          <div className="rowsOfImgs">{imgComp}</div>
        </div>
      )
    }

    return (
      <div style={{ padding: '15px', width: '-webkit-fill-available' }}>
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
              handleClick={e => {
                this.handleImgShow('')
              }}
            />
            {this.state.showBackButton && (
              <ButtonMain
                buttonText="Back"
                margin="0px 0px 0px 10px"
                handleClick={e => {
                  this.handleBackButton()
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
        <div style={{ padding: '15px', background: '#fff', boxShadow: '3px 3px 5px #cfcfcf' }}>
          <div>
            <ReactTable
              data={this.props.tableData}
              columns={columns}
              showPagination={true}
              minRows={1}
              pageSize={10}
              className="scrollbar"
              style={{
                border: 'none'
              }}
              collapseOnDataChange={false}
              getTheadThProps={() => {
                return {
                  style: {
                    border: 'none',
                    color: 'rgba(64, 118, 179)',
                    fontSize: '12px',
                    letterSpacing: '0.3px',
                    backgroundColor: 'rgba(227, 233, 239, 1)'
                  }
                }
              }}
              getTableProps={(state, rowInfo, column, instance) => {
                return {
                  className: 'scrollbarHor'
                }
              }}
              getTbodyProps={(state, rowInfo, column, instance) => {
                return {
                  className: 'scrollbar'
                }
              }}
              getTrProps={(state, rowInfo, column, instance) => {
                let indexRow = null
                if (rowInfo) {
                  indexRow = rowInfo.index
                }
                return {
                  className: 'rowHover',
                  style: {
                    fontSize: '12px',
                    color: 'rgba(64, 118, 179)',
                    fontFamily: 'Arial',
                    letterSpacing: '0.3px',
                    height: '35px'
                  }
                }
              }}
              getTrGroupProps={(state, rowInfo, column, instance) => {
                return {
                  style: {
                    borderBottom: '1px solid rgb(227, 233, 239)'
                  }
                }
              }}
              getTdProps={(state, rowInfo, column, instance) => {
                return {
                  style: {
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }
                }
              }}
              showPageJump={false}
              PaginationComponent={PaginationComponent}
              SubComponent={row => {
                return (
                  <div style={{ padding: '15px' }}>
                    <div style={{ padding: '15px', boxShadow: 'rgb(207, 207, 207) 2px 4px 15px 1px' }}>
                      <ReactTable
                        data={row.original.tasks}
                        columns={this.taskColumns}
                        showPagination={true}
                        minRows={1}
                        pageSize={10}
                        className="scrollbar"
                        style={{
                          border: 'none'
                        }}
                        collapseOnDataChange={false}
                        getTheadThProps={() => {
                          return {
                            style: {
                              border: 'none',
                              color: 'rgba(64, 118, 179)',
                              fontSize: '12px',
                              letterSpacing: '0.3px',
                              backgroundColor: 'rgba(227, 233, 239, 1)'
                            }
                          }
                        }}
                        getTableProps={(state, rowInfo, column, instance) => {
                          return {
                            className: 'scrollbarHor'
                          }
                        }}
                        getTbodyProps={(state, rowInfo, column, instance) => {
                          return {
                            className: 'scrollbar'
                          }
                        }}
                        getTrProps={(state, rowInfo, column, instance) => {
                          let indexRow = null
                          if (rowInfo) {
                            indexRow = rowInfo.index
                          }
                          return {
                            className: 'rowHover',
                            style: {
                              fontSize: '12px',
                              color: 'rgba(64, 118, 179)',
                              fontFamily: 'Arial',
                              letterSpacing: '0.3px',
                              height: '35px'
                            }
                          }
                        }}
                        getTrGroupProps={(state, rowInfo, column, instance) => {
                          return {
                            style: {
                              borderBottom: '1px solid rgb(227, 233, 239)'
                            }
                          }
                        }}
                        getTdProps={(state, rowInfo, column, instance) => {
                          return {
                            style: {
                              textAlign: 'left',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center'
                            }
                          }
                        }}
                        showPageJump={false}
                        PaginationComponent={PaginationComponent}
                        SubComponent={row => {
                          return (
                            <div style={{ padding: '15px' }}>
                              <FieldMonitorIssueTable tableData={row.original.issues ? row.original.issues : []} />
                            </div>
                          )
                        }}
                      />
                    </div>
                  </div>
                )
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default FieldMonitoringList
