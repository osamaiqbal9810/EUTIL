import React, { Component } from 'react'
import FieldMonitoringList from './FieldMonitoringList/FieldMonitoringList'
import { Container, Col, Row, Modal } from 'reactstrap'
import { fieldMonitoringStyles } from './styles/FieldMonitoringPageStyle'
import FieldMonitoringSummary from 'components/Common/Summary/CommonSummary'
import { getSODs } from 'reduxRelated/actions/sodActions.js'
import { updateInspectionPlanFromSocket } from 'utils/planUpdateSocketObj'
import { CRUDFunction } from 'reduxCURD/container'
import { curdActions } from 'reduxCURD/actions'
import moment from 'moment'
import _ from 'lodash'

import SpinnerLoader from 'components/Common/SpinnerLoader'

class FieldMonitoring extends Component {
  constructor(props) {
    super(props)
    this.state = {
      journeyPlans: [],
      spinnerLoading: false,
      actionType: '',
      fieldMonitoringData: [],
      summaryDesc: {
        first: 'Work Plans',
        second: 'Issues',
        third: 'Tasks Completed',
        fourth: 'Total Tasks',
        fifth: 'High Priority',
        sixth: 'Marked On Site'
      },
      summaryValue: { first: 0, second: 0, third: 0, fourth: 0, fifth: 0, sixth: 0 }
    }
    this.calculateIssuesData = this.calculateIssuesData.bind(this)
  }

  componentDidMount() {
    // if (this.props.journeyPlans.length > 0 && this.props.journeyPlanActionType == 'JOURNEYPLANS_READ_SUCCESS') {
    //   this.calculateIssuesData(this.props.journeyPlans)
    //   this.setState({
    //     journeyPlans: this.props.journeyPlans
    //   })
    // } else {
      this.props.getJourneyPlan()
    // }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.journeyPlans !== prevState.journeyPlans &&
      nextProps.journeyPlans &&
      nextProps.journeyPlanActionType !== prevState.actionType &&
      nextProps.journeyPlanActionType == 'JOURNEYPLANS_READ_SUCCESS'
    ) {
      return {
        spinnerLoading: false,
        journeyPlans: nextProps.journeyPlans,
        actionType: nextProps.journeyPlanActionType
      }
    } else if (nextProps.journeyPlanActionType == 'JOURNEYPLANS_READ_REQUEST' && prevState.actionType !== nextProps.journeyPlanActionType) {
      return {
        spinnerLoading: true,
        actionType: nextProps.journeyPlanActionType
      }
    } else if (nextProps.journeyPlanActionType == 'JOURNEYPLANS_READ_FAILURE' && prevState.actionType !== nextProps.journeyPlanActionType) {
      return {
        spinnerLoading: false,
        actionType: nextProps.journeyPlanActionType
      }
    } else {
      return null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.journeyPlanActionType == 'JOURNEYPLANS_READ_SUCCESS' && this.state.actionType !== prevState.actionType) {
      this.calculateIssuesData(this.state.journeyPlans)
    }
    if (prevState.actionType !== this.state.actionType && this.state.actionType == 'JOURNEYPLANS_READ_FAILURE') {
      if (this.props.journeyPlanErrorMessage !== prevProps.journeyPlanErrorMessage && this.props.journeyPlanErrorMessage.status == 401) {
        //console.log('Logged out from Field Monitoring on unauthorized and failure')
        this.props.history.push('/login')
      }
    }
    // if (this.props.sodActionType == 'SOD_LIST_GET_SUCCESS' && this.state.actionType !== prevState.actionType) {

    // }
    if (
      this.props.journeyPlanActionType !== prevProps.journeyPlanActionType &&
      this.props.journeyPlanActionType == 'JOURNEYPLAN_READ_SUCCESS' &&
      this.props.journeyPlan
    ) {
      let jPlans = updateInspectionPlanFromSocket(this.props.journeyPlans, this.props.journeyPlan)
      this.calculateIssuesData(jPlans)
    }
  }

  calculateIssuesData(jPlans) {
    let sumVal = {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      fifth: 0,
      sixth: 0
    }
    let fieldmonitorDataObj = []
    let workPlans = _.cloneDeep(jPlans)
    workPlans.forEach((plan, jIndex) => {
      let tasks = plan.tasks

      let jDate = moment(plan.date).format('YYYY-MM-DD')
      let today = moment().format('YYYY-MM-DD')
      let planDateToday = moment(jDate).isSame(moment(today))

      let sodPlanStartTime = plan.startDateTime ? plan.startDateTime : 'N/A'
      let sodPlanEndTime = plan.endDateTime ? plan.endDateTime : 'N/A'
      let sodPlanStartLoc = plan.startLocation ? plan.startLocation : null
      let sodPlanEndLoc = plan.endLocation ? plan.endLocation : null
      let sodToday = false

      if (plan.status == 'In Progress') {
        fieldmonitorDataObj.push(plan)
        sumVal.first = sumVal.first + 1
        let anyTaskStart = false
        tasks.forEach((task, tIndex) => {
          let taskStart = task.startTime
          let issues = task.issues
          sumVal.fourth = sumVal.fourth + 1
          if (task.endTime) {
            sumVal.third = sumVal.third + 1
          }
          anyTaskStart = true
          if (issues) {
            if (issues.length > 0) {
              issues.forEach((issue, iIndex) => {
                sumVal.second = sumVal.second + 1
                if (issue.priority == 'High') {
                  sumVal.fifth = sumVal.fifth + 1
                }
                if (issue.marked) {
                  sumVal.sixth = sumVal.sixth + 1
                }
              })
            }
          }
        })
      }
    })
    this.setState({
      fieldMonitoringData: fieldmonitorDataObj,
      summaryValue: sumVal
    })
  }

  render() {
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />
    return (
      <Col md={12}>
        {modelRendered}
        <Row style={{ borderBottom: '2px solid #d1d1d1', margin: '0px 15px', padding: '10px 0px' }}>
          <Col md="6" style={{ paddingLeft: '0px' }}>
            <div
              style={{
                float: 'left',
                fontFamily: 'Myriad Pro',
                fontSize: '24px',
                letterSpacing: '0.5px',
                color: ' rgba(64, 118, 179)'
              }}
            >
              Field Monitoring
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div style={fieldMonitoringStyles.fieldMonitoringSummaryHeadingContainer}>
              <h4 style={fieldMonitoringStyles.fieldMonitoringSummaryHeadingStyle}>Issues Summary</h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FieldMonitoringSummary descriptions={this.state.summaryDesc} values={this.state.summaryValue} />
          </Col>
        </Row>

        <FieldMonitoringList tableData={this.state.fieldMonitoringData} noFilter journeyPlans={this.state.journeyPlans} />
      </Col>
    )
  }
}

const getJourneyPlan = curdActions.getJourneyPlan
const updateJourneyPlan = curdActions.updateJourneyPlan
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getJourneyPlan, updateJourneyPlan, getSODs }
}

let variableList = { journeyPlanReducer: { journeyPlans: '', journeyPlan: {} } }

const FieldMonitoringContainer1 = CRUDFunction(FieldMonitoring, 'fieldMonitoring', actionOptions, variableList, ['journeyPlanReducer'])

export default FieldMonitoringContainer1

function otherFieldsGet(plan, task, tasks, sodPlanStartTime, sodPlanEndTime, sodPlanStartLoc, sodPlanEndLoc, jIndex, tIndex, iIndex) {
  let index = jIndex
  if (tIndex) {
    index = jIndex + '-' + tIndex
    if (iIndex) {
      index = jIndex + '-' + tIndex + '-' + iIndex
    }
  }
  let otherFields = {
    planId: plan._id,
    taskId: task.taskId,
    taskTitle: task.title,
    index: index,
    date: plan.date,
    user: plan.user,
    userName: plan.user.name,
    jPlanStartTime: sodPlanStartTime,
    jPlanEndTime: sodPlanEndTime,
    jPlanStartLocation: sodPlanStartLoc,
    jPlanEndLocation: sodPlanEndLoc,
    tStartTime: task.startTime,
    tEndTime: task.endTime,
    tStartLoc: task.startLocation,
    tEndLoc: task.endLocation,
    totalTasks: tasks.length
  }
  return otherFields
}

function otherFieldsNoTaskGet(plan, tasks, sodPlanStartTime, sodPlanEndTime, sodPlanStartLoc, sodPlanEndLoc, jIndex) {
  let index = jIndex
  let otherFields = {
    planId: plan._id,
    taskId: '',
    taskTitle: 'No Task Started',
    index: index,
    date: plan.date,
    user: plan.user,
    userName: plan.user.name,
    jPlanStartTime: sodPlanStartTime,
    jPlanEndTime: sodPlanEndTime,
    jPlanStartLocation: sodPlanStartLoc,
    jPlanEndLocation: sodPlanEndLoc,
    tStartTime: null,
    tEndTime: null,
    tStartLoc: null,
    tEndLoc: null,
    totalTasks: null
  }
  return otherFields
}
