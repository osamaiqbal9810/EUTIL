import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { CommonModalStyle, ButtonStyle } from "../../style/basic/commonControls";
import { ModalStyles } from "../Common/styles";
import { themeService } from "../../theme/service/activeTheme.service";
import { languageService } from "../../Language/language.service";
import { MyButton } from "../Common/Forms/formsMiscItems";

import ThisTable from "components/Common/ThisTable/index";
import SelectMRs from "../WorkOrders/SelectMRs";
import CustomCheckbox from "../Common/CustomCheckbox";
import _ from "lodash";
export default class UnAssignedAssetsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAssetsToAdd: [],
    };
    this.tableColumns = [
      {
        Header: languageService("Asset"),
        id: "assetName",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.unitId} </div>;
        },
        minWidth: 100,
      },
      {
        Header: languageService("MP Start"),
        id: "mpStart",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.start} </div>;
        },
        minWidth: 100,
      },
      {
        Header: languageService("MP End"),
        id: "mpEnd",
        accessor: d => {
          return <div style={{ textAlign: "center" }}>{d.end} </div>;
        },
        minWidth: 100,
      },
      {
        Header: languageService("Action"),
        id: "selectAction",
        accessor: d => {
          return (
            <div style={{ marginRight: "8px", cursor: "pointer" }}>
              <CustomCheckbox
                containerStyle={{ float: "right" }}
                ch
                handleCheckChange={checkVal => {
                  this.handleAssetCheck(checkVal, d);
                }}
                disabled={props.disableCheckbox}
              />
            </div>
          );
        },
        width: 50,
      },
    ];
    this.handleAssetCheck = this.handleAssetCheck.bind(this);
  }

  handleAssetCheck(check, asset) {
    let selectedAssetsToAdd = [...this.state.selectedAssetsToAdd];
    if (check) {
      selectedAssetsToAdd.push(asset);
      asset.checkedToAdd = true;
    } else {
      let selectedAssetsToAdd = _.filter(selectedAssetsToAdd, { _id: !asset._id });
      asset.checkedToAdd = false;
    }
    this.setState({
      selectedAssetsToAdd: selectedAssetsToAdd,
    });
  }
  render() {
    return (
      <div>
        <Modal
          contentClassName={themeService({ default: this.props.className, retro: "retroModal" })}
          isOpen={this.props.modal}
          toggle={this.props.handleToggleModal}
          style={{ maxWidth: "98vw" }}
        >
          <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
            {languageService("Assets Assignment to ")} {this.props.newlyCreatedAsset ? this.props.newlyCreatedAsset.unitId : ""}
          </ModalHeader>
          <ModalBody style={themeService(CommonModalStyle.body)}>
            <ThisTable
              tableColumns={this.tableColumns}
              tableData={this.props.unassignedAssets}
              pageSize={this.props.unassignedAssets ? this.props.unassignedAssets.length : 0}
              handlePageChange={page => {
                if (this.props.handlePageSave) {
                  this.props.handlePageSave(page, this.state.pageSize);
                }
              }}
              page={0}
              defaultPageSize={0}
              showPagination={false}
            />
          </ModalBody>
          <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
            <MyButton
              style={themeService(ButtonStyle.commonButton)}
              type="button"
              onClick={e => {
                this.props.handleToggleModal(1, this.state.selectedAssetsToAdd);
              }}
            >
              {languageService("Update")}
            </MyButton>
            <MyButton
              style={themeService(ButtonStyle.commonButton)}
              type="button"
              onClick={e => {
                this.props.handleToggleModal();
              }}
            >
              {languageService("Close")}
            </MyButton>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
