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
import AudioComponent from 'components/IssuesReports/IssuesList/AudioComponent'
import { ic_keyboard_arrow_left } from 'react-icons-kit/md/ic_keyboard_arrow_left'
import { ic_keyboard_arrow_right } from 'react-icons-kit/md/ic_keyboard_arrow_right'
class FieldMonitorIssueTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedImg: '',
      imgModal: false,
      tableData: [],
      imgsList: [],
      showMultipleImgs: false,
      imgDescription: '',
      showBackButton: false,
      showAllDefects: false,
      showAllDefectsIssueGuid: null,
      showIframeIssue: null,
      showIframeModalState: false,
      indexAudioFileMap: {},
      columns: [
        {
          Header: 'Issue',
          accessor: 'description',
          Aggregated: row => <span />,
          id: 'description',
          minWidth: 120
        },
        {
          Header: 'Issue Time',
          id: 'issuetime',
          accessor: d => {
            let issueTimeStamp = ''
            if (d.timeStamp) {
              issueTimeStamp = moment
                .utc(d.timeStamp)
                .local()
                .format('LLLL')
            }
            return <div style={{ textAlign: 'center' }}>{issueTimeStamp}</div>
          },
          minWidth: 240
        },
        {
          Header: 'Marked',
          id: 'marked',
          accessor: d => {
            return <div style={{ color: 'inherit', textAlign: 'center' }}>{d.marked && <SvgIcon size={20} icon={check} />}</div>
          },
          Aggregated: row => <span />,

          minWidth: 60
        },
        {
          Header: 'Audio',
          id: 'audio',
          accessor: d => {
            let audioList = []
            let audioName = ''
            let nextPrevButtons = false
            let indexToShow = ''
            if (d.voiceList) {
              audioList = d.voiceList
              if (d.voiceList.length > 0) {
                if (d.voiceList.length > 1) {
                  nextPrevButtons = true
                  indexToShow = '1/' + d.voiceList.length
                }
                if (this.state.indexAudioFileMap[d.timeStamp]) {
                  let aduioListObj = audioList[this.state.indexAudioFileMap[d.timeStamp]]
                  if (aduioListObj) {
                    audioName = aduioListObj.voiceName
                  }
                } else {
                  let aduioListObj = audioList[0]
                  if (aduioListObj) {
                    audioName = aduioListObj.voiceName
                  }
                }
              }
              if (this.state.indexAudioFileMap[d.timeStamp] || this.state.indexAudioFileMap[d.timeStamp] == 0) {
                indexToShow = this.state.indexAudioFileMap[d.timeStamp] + 1 + '/' + d.voiceList.length
                if (d.voiceList.length < 2) {
                  nextPrevButtons = false
                  indexToShow = ''
                }
              }
            }

            let paths = 'http://' + getServerEndpoint() + 'audio/' + audioName
            return (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', minWidth: '20px', verticalAlign: 'super' }}>{indexToShow} </div>
                {nextPrevButtons && (
                  <div
                    style={{ display: 'inline-block', minWidth: '10px' }}
                    onClick={e => {
                      this.handlePrevNext('Prev', audioList, d.timeStamp)
                    }}
                  >
                    <SvgIcon size={20} icon={ic_keyboard_arrow_left} />
                  </div>
                )}
                <div style={{ display: 'inline-block' }}>
                  {/* <div style={{ textAlign: 'center' }}>{indexToShow} </div> */}
                  <AudioComponent paths={paths} />
                </div>
                {nextPrevButtons && (
                  <div
                    style={{ display: 'inline-block' }}
                    onClick={e => {
                      this.handlePrevNext('Next', audioList, d.timeStamp)
                    }}
                  >
                    <SvgIcon size={20} icon={ic_keyboard_arrow_right} />
                  </div>
                )}
              </div>
            )
          },
          Aggregated: row => <span />,
          minWidth: 320,
          getHeaderProps: () => {
            return {
              style: {
                border: 'none',
                color: 'rgba(64, 118, 179)',
                fontSize: '12px',
                letterSpacing: '0.3px',
                backgroundColor: 'rgba(227, 233, 239, 1)'
              }
            }
          }
        },
        {
          Header: 'Images',
          id: 'imgList',
          width: 160,
          Aggregated: row => <span />,
          accessor: d => {
            let imgListing = null
            let more = ''
            if (d.imgList) {
              imgListing = d.imgList.map((img, index) => {
                if (index < 3) {
                  let imgName = ''
                  if (img) {
                    imgName = img.imgName
                  }
                  let paths = 'http://' + getServerEndpoint() + 'thumbnails/' + imgName
                  return (
                    <div className="colsIssueImgs" key={index}>
                      <img
                        onClick={e => {
                          this.handleImgShow(imgName, d)
                        }}
                        src={paths}
                        style={{
                          display: 'block',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          border: '1px solid #e3e9ef',
                          borderRadius: '50%'
                        }}
                      />
                    </div>
                  )
                }
              })

              if (d.imgList.length > 2) {
                more = '...'
              }
            }

            return (
              <div>
                {' '}
                {imgListing}
                <div
                  className="moreImgs"
                  onClick={e => {
                    this.handleImgMultiples(d)
                  }}
                >
                  {' '}
                  {more}
                </div>{' '}
              </div>
            )
          }
        },
        {
          Header: 'Priority',
          id: 'priority',
          minWidth: 150,
          Aggregated: row => <span />,
          width: 150,
          accessor: d => {
            return (
              <div
                style={{
                  background: getStatusColor(d.priority),
                  padding: '5px',
                  margin: '15px',
                  borderRadius: '2px',
                  color: '#fff'
                }}
              >
                {d.priority}
              </div>
            )
          }
        }
      ]
    }

    this.handleImgShow = this.handleImgShow.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleImgMultiples = this.handleImgMultiples.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.handleSingleImgFromMultiple = this.handleSingleImgFromMultiple.bind(this)
    this.setTableDataState = this.setTableDataState.bind(this)
    this.handleFilterPivotBy = this.handleFilterPivotBy.bind(this)
    this.showAllDefects = this.showAllDefects.bind(this)
    this.showIframeLocation = this.showIframeLocation.bind(this)
    this.handleIframeToggle = this.handleIframeToggle.bind(this)
    this.handlePrevNext = this.handlePrevNext.bind(this)
  }

  handlePrevNext(action, voiceList, timeStamp) {
    const { indexAudioFileMap } = this.state
    let copyIndexAudioMap = { ...indexAudioFileMap }
    let tableDataObj = _.cloneDeep(this.state.tableData) // Creating copy of state so table is reloaded so we can change the audio index
    if (action == 'Prev') {
      if (this.state.indexAudioFileMap[timeStamp] !== 0) {
        copyIndexAudioMap[timeStamp] = copyIndexAudioMap[timeStamp] - 1
        this.setState({
          indexAudioFileMap: copyIndexAudioMap,
          tableData: tableDataObj
        })
      }
    } else {
      if (this.state.indexAudioFileMap[timeStamp] + 1 !== voiceList.length && voiceList.length > 0) {
        copyIndexAudioMap[timeStamp] = copyIndexAudioMap[timeStamp] + 1
        this.setState({
          indexAudioFileMap: copyIndexAudioMap,
          tableData: tableDataObj
        })
      }
    }
  }

  handleIframeToggle() {
    this.setState({
      showIframeModalState: !this.state.showIframeModalState,
      showIframeIssue: null
    })
  }

  showIframeLocation(issue) {
    this.setState({
      showIframeModalState: !this.state.showIframeModalState,
      showIframeIssue: issue
    })
  }

  showAllDefects(issue) {
    let issueVal = issue.uniqueGuid
    if (this.state.showAllDefects && this.state.showAllDefectsIssueGuid == issueVal) {
      issueVal = null
    }
    this.setState({
      showAllDefects: !this.state.showAllDefects,
      showAllDefectsIssueGuid: issueVal
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

  componentDidMount() {
    if (this.props.tableData) {
      if (this.props.tableData.length > 0) {
        this.setTableDataState()
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tableData.length !== this.props.tableData.length) {
      this.setTableDataState()
    }
  }

  setTableDataState() {
    let updatedTableData = []
    if (this.props.tableData) {
      updatedTableData = _.cloneDeep(this.props.tableData)
    }

    const { indexAudioFileMap } = this.state
    let copyIndexAudioMap = { ...indexAudioFileMap }
    this.props.tableData.forEach(issue => {
      if (!copyIndexAudioMap[issue.timeStamp]) {
        copyIndexAudioMap[issue.timeStamp] = 0
      }
    })

    this.setState({
      tableData: updatedTableData,
      indexAudioFileMap: copyIndexAudioMap
    })
  }

  handleFilterPivotBy(filterName) {
    this.setState({
      pivot: filterName
    })
  }

  render() {
    let imgComp = null
    if (this.state.imgsList && this.state.showMultipleImgs) {
      imgComp = this.state.imgsList.map((img, index) => {
        let imgName = ''
        if (img) {
          imgName = img.imgName
        }
        let paths = 'http://' + getServerEndpoint() + 'thumbnails/' + imgName
        //  console.log(paths)
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

    let locationSrc = this.state.showIframeIssue ? 'https://www.google.com/maps/place/' + this.state.showIframeIssue.location : '#'

    return (
      <div style={{ width: '-webkit-fill-available' }}>
        <Modal isOpen={this.state.showIframeModalState} toggle={this.handleIframeToggle}>
          <ModalHeader style={ModalStyles.modalTitleStyle}>
            {this.state.showIframeIssue ? this.state.showIframeIssue.description : ''}
          </ModalHeader>
          <ModalBody />
          <ModalFooter style={ModalStyles.footerButtonsContainer}>
            <ButtonMain
              buttonText="Close"
              handleClick={e => {
                this.handleIframeToggle()
              }}
            />
          </ModalFooter>
        </Modal>
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

        <div style={{ background: '#fff', boxShadow: 'rgb(207, 207, 207) 2px 4px 15px 1px' }}>
          <div style={{ padding: '15px' }}>
            <ReactTable
              data={this.state.tableData}
              columns={this.state.columns}
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
                    height: '40px'
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
            />
          </div>
        </div>
      </div>
    )
  }
}

export default FieldMonitorIssueTable
