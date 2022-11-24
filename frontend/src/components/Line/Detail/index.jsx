import React, { Component } from 'react'
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ModalStyles } from 'components/Common/styles.js'
import ImageGallery from 'components/Common/ImageGallery/index'
import { MyButton } from 'components/Common/Forms/formsMiscItems'
import AssetImageArea from '../Add/AssetImageArea'
import AssetDetail from './AssetDetail'
import AssetAttributesDetail from './AssetAttributesDetail'
class LineDetailIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetObj: null,
      assetAttributes: null,
      imagesList: []
    };
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose() {
    this.props.toggle(null)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedAsset !== prevProps.selectedAsset && this.props.selectedAsset) {
      console.log(this.props.selectedAsset)
      this.setState({
        imagesList: this.props.selectedAsset.images,
        assetObj: this.props.selectedAsset,
        assetAttributes: this.props.selectedAsset.attributes
      })
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modal}
        toggle={e => {
          this.props.toggle(null)
        }}
        style={{ maxWidth: '98vw' }}
      >
        <ModalHeader style={ModalStyles.modalTitleStyle}>Asset Detail</ModalHeader>}
        <ModalBody>
          {!this.state.showImgGal && (
            <Row>
              <Col md={2}>
                <Row style={{ margin: '0px' }}>
                  <AssetImageArea imagesList={this.state.imagesList} showImageGallery={this.showImageGallery} />
                </Row>

                {/* <AssetDocumentsArea documentList={this.state.documentList} addDocument={this.addDocumentHandle} /> */}
              </Col>
              <Col md={10}>
                <Row>
                  <ModalHeader style={ModalStyles.modalTitleStyle}>Asset Attributes </ModalHeader>
                </Row>
                <Row>
                  <Col md={5}>
                    <AssetDetail assetDetail={this.state.assetObj ? this.state.assetObj : {}} />
                  </Col>
                  <Col md={5}>
                    <AssetAttributesDetail assetAttributes={this.state.assetAttributes ? this.state.assetAttributes : {}} />
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
          {this.state.showImgGal && (
            // <Modal isOpen={this.state.showImgGal}>
            <ImageGallery
              //handleSave={this.addSelectedImage}
              noSaveButton
              handleCancel={this.cancelImageGallery}

              // loadImgPath={'showAssetImgs'}
              // customFolder={'assetImages'}
              // uploadImageAllow
            />
            // </Modal>
          )}
        </ModalBody>
        {!this.state.showImgGal && (
          <ModalFooter style={ModalStyles.footerButtonsContainer}>
            <MyButton type="button" onClick={this.handleClose}>
              Close
            </MyButton>
          </ModalFooter>
        )}
      </Modal>
    )
  }
}

export default LineDetailIndex
