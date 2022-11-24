import React, { Component } from 'react'
import { Row, Col, Button } from 'reactstrap'
import { getServerEndpoint } from 'utils/serverEndpoint'
import SvgIcon from 'react-icons-kit'
import { plus } from 'react-icons-kit/icomoon/plus'
import './uploadbutton.css'
import noImage from 'images/noImage.png'
class AssetImageArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mainImageIndex: 0
    }
  }

  render() {
    let imagesList = null
   // console.log(this.props.imagesList)
    if (this.props.imagesList) {
      imagesList = this.props.imagesList.map((imageName, index) => {
        if (index > 0) {
          return (
            <div style={{ display: 'inline-block', width: '30%', margin: '0 3% 0 0', cursor: 'pointer' }} key={imageName + index}>
              <ImageMainComp imageName={imageName} borderStyle={'1px solid rgba(64, 118, 179)'} width={'100%'} />
            </div>
          )
        }
      })
    }

    return (
      <div>
        <Row>
          <Col md={12}>
            <ImageMainComp imageName={this.props.imagesList[this.state.mainImageIndex]} />
          </Col>
        </Row>
        <Row>
          <Col md={10}>
            <div className="scrollbarHor" style={{ overflow: 'auto', whiteSpace: 'nowrap', padding: '10px 0px 5px 0px' }}>
              {imagesList}
            </div>
          </Col>
          <Col md={2} style={{ padding: '0px' }}>
            <div style={{ padding: '25px 0px', margin: 'auto', width: '50%', color: 'rgba(64, 118, 179)' }}>
              {/* <div className="upload-btn-wrapper">
                <SvgIcon icon={plus} size={20} />

                <input type="file" name="myfile" accept="image/*" onChange={this.props.addImage} />
              </div> */}
              <SvgIcon icon={plus} size={20} onClick={this.props.showImageGallery} />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default AssetImageArea

class ImageMainComp extends Component {
  render() {
    let path = 'http://' + getServerEndpoint() + 'assetImages/' + this.props.imageName
    if(!this.props.imageName){
      path = noImage
    }
    return (
      <div style={{ width: this.props.width ? this.props.width : 'inherit' }}>
        <img
          style={{
            width: 'inherit',
            border: this.props.borderStyle ? this.props.borderStyle : '3px solid rgba(64, 118, 179)',
            borderRadius: '5px'
          }}
          src={path}
          alt="img"
        />
      </div>
    )
  }
}
