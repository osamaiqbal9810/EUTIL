import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'

class AssetDetail extends Component {
  constructor(props) {
    super(props)
    this.style = {
      lableStyle: {
        color: 'rgba(64, 118, 179)',
        fontSize: '14px'
      },
      FieldStyle: {
        color: 'rgba(64, 118, 179)',
        fontSize: '14px'
      },
      FieldContainerStyle: {
        padding: '5px 15px ',
        margin: '10px 0px',
        borderTop: '1px solid #e7e7e7',
        borderLeft: '1px solid #e7e7e7',
        borderRight: '1px solid #e7e7e7',
        borderBottom: '1px solid #e7e7e7', // removed if fields are together with no margin
        borderRadius: '3px'
      },
      FieldContainerLastStyle: {
        padding: '5px 15px ',
        borderBottom: '1px solid #e7e7e7',
        borderTop: '1px solid #e7e7e7',
        borderLeft: '1px solid #e7e7e7',
        borderRight: '1px solid #e7e7e7',
        borderRadius: '3px'
      }
    }
  }

  render() {
    let showLocationField = false
    let showLocationStart = false
    let showLocationEnd = false
    if (this.props.assetDetail.coordinates) {
      if (this.props.assetDetail.coordinates.length > 0) {
        showLocationField = true
        showLocationStart = true
      }
      if (this.props.assetDetail.coordinates.length > 1) {
        showLocationEnd = true
      }
    }
    return (
      <div>
        <Row style={this.style.FieldContainerStyle}>
          <Col md={4} style={this.style.lableStyle}>
            Subdivision :
          </Col>
          <Col md={8} style={this.style.FieldStyle}>
            {' '}
            {this.props.assetDetail.subdivision}{' '}
          </Col>
        </Row>
        <Row style={this.style.FieldContainerStyle}>
          <Col md={4} style={this.style.lableStyle}>
            {' '}
            Asset Type :{' '}
          </Col>
          <Col md={8} style={this.style.FieldStyle}>
            {' '}
            {this.props.assetDetail.assetType}{' '}
          </Col>
        </Row>
        <Row style={this.style.FieldContainerStyle}>
          <Col md={4} style={this.style.lableStyle}>
            Asset ID :
          </Col>
          <Col md={8} style={this.style.FieldStyle}>
            {this.props.assetDetail.unitId}
          </Col>
        </Row>
        <Row style={this.style.FieldContainerStyle}>
          <Col md={4} style={this.style.lableStyle}>
            {' '}
            Description{' '}
          </Col>
          <Col md={8} style={this.style.FieldStyle}>
            {' '}
            {this.props.assetDetail.description}{' '}
          </Col>
        </Row>
        {showLocationField && (
          <Row>
            <Col md={12}>
              {showLocationStart && (
                <Row style={this.style.FieldContainerStyle}>
                  <Col md={4} style={this.style.lableStyle}>
                    {' '}
                    Location Start:{' '}
                  </Col>
                  <Col md={8} style={this.style.FieldStyle}>
                    {this.props.assetDetail.coordinates[0][0]} , {this.props.assetDetail.coordinates[0][1]}
                  </Col>
                </Row>
              )}
              {showLocationEnd && (
                <Row style={this.style.FieldContainerStyle}>
                  <Col md={4} style={this.style.lableStyle}>
                    Location End:
                  </Col>
                  <Col md={8} style={this.style.FieldStyle}>
                    {this.props.assetDetail.coordinates[1][0]} , {this.props.assetDetail.coordinates[1][1]}
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        )}
        <Row style={this.style.FieldContainerStyle}>
          <Col md={4} style={this.style.lableStyle}>
            MilePost Start
          </Col>
          <Col md={8} style={this.style.FieldStyle}>
            {this.props.assetDetail.start}
          </Col>
        </Row>
        {this.props.assetDetail.end && (
          <Row style={this.style.FieldContainerStyle}>
            <Col md={4} style={this.style.lableStyle}>
              MilePost End
            </Col>
            <Col md={8} style={this.style.FieldStyle}>
              {this.props.assetDetail.end}
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default AssetDetail
