import React, { Component } from 'react'
import { Row, Col, Button } from 'reactstrap'
import { serverEndpoint } from 'utils/serverEndpoint'
import SvgIcon from 'react-icons-kit'
import { plus } from 'react-icons-kit/icomoon/plus'
class LineDocumentsArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mainDocumentIndex: 0
    }
  }

  render() {
    let documentList = null
    if (this.props.documentList) {
      documentList = this.props.documentList.map((doc, index) => {
        if (index > 0) {
          return (
            <div style={{ display: 'inline-block', margin: '0 3% 0 0', cursor: 'pointer' }} key={doc + index}>
              <DocumentComp docName={doc} borderStyle={'1px solid rgba(64, 118, 179)'} width={'100%'} />
            </div>
          )
        }
      })
    }
    return (
      <Row>
        <Col md={12}>
          <h5 style={{ padding: '10px 0px', font: '18px sans-serif', color: 'rgba(64, 118, 179)' }}> Documents</h5>
        </Col>
        <Col md={10}>
          <div className="scrollbarHor" style={{ overflow: 'auto', whiteSpace: 'nowrap', padding: '10px 0px 5px 0px' }}>
            {documentList}
          </div>
        </Col>
        <Col md={2} style={{ padding: '0px' }}>
          <div style={{ padding: '15px 0px', margin: 'auto', width: '50%', color: 'rgba(64, 118, 179)', cursor: 'pointer' }}>
            <SvgIcon icon={plus} size={20} />
          </div>
        </Col>
      </Row>
    )
  }
}

export default LineDocumentsArea

class DocumentComp extends Component {
  render() {
    return (
      <div style={{ padding: '5px 5px', border: this.props.borderStyle ? this.props.borderStyle : '3px solid rgba(64, 118, 179)' }}>
        {this.props.docName}
      </div>
    )
  }
}
