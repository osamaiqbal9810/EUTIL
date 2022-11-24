import React, { Component } from 'react'
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ModalStyles } from 'components/Common/styles.js'
import { ic_arrow_drop_down } from 'react-icons-kit/md/ic_arrow_drop_down'
import { ic_arrow_drop_up } from 'react-icons-kit/md/ic_arrow_drop_up'
import SvgIcon from 'react-icons-kit'
import _ from 'lodash'

const MyButton = props => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
)

class TasksUnits extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedUnits: []
    }

    this.handleChangeUnitClick = this.handleChangeUnitClick.bind(this)
  }

  componentDidMount() {
    if (this.props.task.units) {
      this.setState({
        selectedUnits: this.props.task.units
      })
    }
  }

  handleChangeUnitClick(check, unit, track, task) {
    let selectedUnits = this.state.selectedUnits
    let copySelectedUnits = [...selectedUnits]
    let result = _.find(this.state.selectedUnits, { id: unit.id })
    if (result) {
      _.remove(copySelectedUnits, { id: unit.id })
    } else {
      let customUnit = { id: unit.id, unitId: track.trackId + '-' + unit.unitId, track_id: track._id, assetType: unit.assetType }
      copySelectedUnits.push(customUnit)
    }
    this.setState({
      selectedUnits: copySelectedUnits
    })
  }

  render() {
    let trackRows = null
    let tracksProps = Array.isArray(this.props.tracks) ? this.props.tracks : []
    if (tracksProps.length > 0) {
      trackRows = this.props.tracks.map((track, index) => {
        return (
          <TrackRows
            track={track}
            selectedUnits={this.state.selectedUnits}
            key={track._id}
            handleChangeUnitClick={this.handleChangeUnitClick}
            task={this.props.task}
          />
        )
      })
    } else {
      // console.log('NO TRACKS IN RENDER')
      // console.log(this.props.tracks)
    }
    return (
      <div>
        <ModalHeader style={ModalStyles.modalTitleStyle}>Select Assets</ModalHeader>
        {trackRows}
        <ModalBody />
        <ModalFooter style={ModalStyles.footerButtonsContainer}>
          <MyButton
            onClick={e => {
              this.props.handleSave(this.state.selectedUnits)
            }}
          >
            Save
          </MyButton>
          <MyButton onClick={this.props.handleCancel}>Cancel </MyButton>
        </ModalFooter>
      </div>
    )
  }
}

export default TasksUnits

class TrackRows extends Component {
  constructor(props) {
    super(props)
    this.state = {
      units: [],
      selectedTrackUnits: [],
      showUnits: false
    }
    this.styles = {
      rowContainer: {
        padding: '8px 16px'
      },
      row: {
        fontSize: '12px',
        color: 'rgba(64, 118, 179)',
        padding: '6px 12px',
        border: '1px solid #a4a4a480',
        boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.05)'
      },
      dropdown: {
        float: 'right'
      }
    }

    this.toggleUnitsRows = this.toggleUnitsRows.bind(this)
  }

  toggleUnitsRows(track) {
    let units = []
    if (!this.state.showUnits) {
      units = track.units
    }
    this.setState({
      units: units,
      showUnits: !this.state.showUnits
    })
  }
  componentDidMount() {
    if (this.props.selectedTaskUnits) {
      this.setState({
        selectedTrackUnits: this.props.selectedTaskUnits
      })
    }
  }

  render() {
    let trackID = this.props.track._id
    let unitsRow = this.state.units.map((unit, index) => {
      let selectedCheck = false
      //console.log(this.props.selectedUnits)
      let result = _.find(this.props.selectedUnits, { id: unit.id })
      if (result) {
        selectedCheck = true
      }

      return (
        <UnitsRow
          unit={unit}
          key={unit.id}
          handleChangeUnitClick={this.props.handleChangeUnitClick}
          initialCheck={selectedCheck}
          task={this.props.task}
          track={this.props.track}
        />
      )
    })
    return (
      <div style={this.styles.rowContainer}>
        <div style={this.styles.row}>
          {this.props.track.trackId}
          <div
            style={this.styles.dropdown}
            onClick={e => {
              this.toggleUnitsRows(this.props.track)
            }}
          >
            <SvgIcon size={20} icon={this.state.showUnits ? ic_arrow_drop_up : ic_arrow_drop_down} />
          </div>
        </div>
        {unitsRow}
      </div>
    )
  }
}

class UnitsRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      check: false
    }
    this.styles = {
      row: {
        fontSize: '12px',
        color: 'rgba(64, 118, 179)',
        padding: '12px 10px 6px 18px',
        borderLeft: '1px solid #e3e9ef',
        borderRight: '1px solid #e3e9ef',
        borderBottom: '1px solid #e3e9ef',
        boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.05)',
        transitionDuration: '2s'
      },
      dropdown: {
        float: 'right'
      }
    }
    this.handleUnitClick = this.handleUnitClick.bind(this)
  }

  componentDidMount() {
    if (this.props.initialCheck) {
      this.setState({
        check: true
      })
    }
  }

  handleUnitClick(e) {
    let checked = e.target.checked
    this.setState({
      check: checked
    })
    let unit = this.props.unit

    this.props.handleChangeUnitClick(checked, this.props.unit, this.props.track, this.props.task)
  }

  render() {
    return (
      <div style={this.styles.row}>
        - {this.props.unit.unitId} {this.props.unit.assetType}
        <div style={this.styles.dropdown}>
          <input type="checkbox" checked={this.state.check} onChange={this.handleUnitClick} />
        </div>
      </div>
    )
  }
}
