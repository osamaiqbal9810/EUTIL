import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import ImageGallery from "components/Common/ImageGallery/index";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import AssetImageArea from "../AddAsset/AssetImageArea";
import AssetDetail from "./AssetDetail";
import AssetAttributesDetail from "./AssetAttributesDetail";
import LinearDisplay from "components/Common/LinearDisplay/LinearDisplay";
import { linearData } from "./linearassets";
import AssetDocumentsArea from "../AddAsset/AssetDocumentsArea";

class ViewAssetDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetObj: null,
      assetAttributes: null,
      imagesList: [],
      documentList: [],
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.toggle(null);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedAsset !== prevProps.selectedAsset && this.props.selectedAsset) {
      console.log(this.props.selectedAsset);
      this.setState({
        imagesList: this.props.selectedAsset.images,
        documentList: this.props.selectedAsset.documents,
        assetObj: this.props.selectedAsset,
        assetAttributes: this.props.selectedAsset.attributes,
      });
    }
  }

  render() {
    let dataCollection = new Map();
    linearData.assets.forEach(function(asset) {
      if (!dataCollection.has(asset.name)) {
        let d = [];
        dataCollection.set(asset.name, d);
      }
      let d = dataCollection.get(asset.name);
      d.push({ start: asset.start, end: asset.end, text: asset.text });
    });

    let scaleData = []; //[{start:0, end:0.25, text:'1'},{start:0.25, end:0.50, text:''},{start:0.50, end:0.75, text:''},{start:0.75, end:1, text:'1'},{start:1, end:1.25, text:''},{start:1.25, end:1.5, text:''},{start:1.5, end:1.75, text:''},{start:1.75, end:2, text:'2'},{start:2, end:14, text:''}];
    let inc = 0.1;
    for (let i = 0; i <= 13.5; ) {
      let n = { start: i, end: this.precisionRound(i + inc, 2), text: " " + Math.floor(i) };
      scaleData.push(n);
      i = this.precisionRound(i + inc, 2);
    }

    let height = 20,
      width = 2600;

    return (
      <Modal
        isOpen={this.props.modal}
        toggle={e => {
          this.props.toggle(null);
        }}
        style={{ maxWidth: "98vw" }}
      >
        <ModalHeader style={ModalStyles.modalTitleStyle}>Asset Detail</ModalHeader>
        <ModalBody>
          {!this.state.showImgGal && (
            <Row>
              <Col md={2}>
                <Row style={{ margin: "0px" }}>
                  <AssetImageArea imagesList={this.state.imagesList} showImageGallery={this.showImageGallery} />
                </Row>

                <AssetDocumentsArea documentList={this.state.documentList} addDocument={this.addDocumentHandle} />
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
                {/* <Row>
                {(this.props.selectedAsset && this.props.selectedAsset.assetType=='rail' )&& (
                 <div style={{backgroundColor: 'white', position:'relative', padding:'50px', paddingRight:'100px', width:'100%', scroll: 'auto', overflow:'auto'}}>
          <LinearDisplay padding={{left: 0, right: 1, top: 0, bottom: 0}} logicalWidth = {15} width={width} title={" "} titleWidth={180} height={height+3} textcolor='black' color='black' vertical={height} data={scaleData} displayType='scale'/>
          <LinearDisplay padding={{left: 0, right: 1, top: 0, bottom: 0}} logicalWidth = {15} title={"TIES"} width={width} height={height} titleWidth={180} background='white' textcolor='black' color='black' vertical={height} data={dataCollection.get('TIES')}/>
          <LinearDisplay padding={{left: 0, right: 1, top: 0, bottom: 0}} logicalWidth = {15} title={"SURFACING"} width={width} height={height} titleWidth={180} background='white' data={dataCollection.get('SURFACING')} textcolor='green' color='black' vertical={height}/>
          <LinearDisplay padding={{left: 0, right: 1, top: 0, bottom: 0}} logicalWidth = {15} title={"ADJ. RAIL TEMP"} width={width} height={height}  titleWidth={180} background='white' data={dataCollection.get('ADJ.  RAIL TEMP')}  textcolor='red' color='black' vertical={height}/>
          <LinearDisplay padding={{left: 0, right: 1, top: 0, bottom: 0}} logicalWidth = {15} title={"RAIL"} width={width} height={height}  titleWidth={180} background='white' data={dataCollection.get('RAIL')}  textcolor='blue' color='black' vertical={height}/>
          <LinearDisplay padding={{left: 0, right: 1, top: 0, bottom: 0}} logicalWidth = {15} title={"BRUSH CUTTING"} width={width} height={height}  titleWidth={180} background='white' data={dataCollection.get('BRUSH CUTTING')}  textcolor='cyan' color='black' vertical={height}/>
                </div>)}
                </Row> */}
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
              Ok
            </MyButton>
          </ModalFooter>
        )}
      </Modal>
    );
  }
  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }
}

export default ViewAssetDetail;
