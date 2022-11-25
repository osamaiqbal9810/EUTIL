import "./style.css";
import React, { Component, Fragment } from "react";
import { equipmentIconsImageLookup } from "./images-index";
import { EquipmentTreeActionIconGroup } from "./library-schemas/EquipmentTreeActionIconGroup";
import CustomIcon from "../../../libraries/CustomIcon";
import { ArrowHead, ArrowHeadIconGroup } from "./ArrowHead";
import { UnderlinedTextButton, HyperlinkTextButton, PillTextButton } from "../../../libraries/GeneralButtons";

class AssetDetailsBox extends Component {
  render() {
    let { attributes } = this.props;
    return (
      attributes && (
        <Fragment>
          <div className={"asset-details-box"}>
            {Object.keys(attributes).map((key, i) => {
              return <div key={i}> {`${key}: ${attributes[key]}`} </div>;
            })}
          </div>
        </Fragment>
      )
    );
  }
}

class EquipmentDetailsBox extends Component {
  render() {
    let { attributes, filesToUpload } = this.props;
    let [properties, softwares] = attributes.reduce(
      (result, attr) => {
        result[attr.key == "Application Software" ? 1 : 0].push(attr); // Determine and push to small/large arr
        return result;
      },
      [[], []],
    );
    return (
      <Fragment>
        <div className={"equipment-details-box"}>
          {properties.map((attribute, index) => {
            return <div key={index}> {`${attribute.key}: ${attribute.value}`} </div>;
          })}
          {softwares.length > 0 && (
            <React.Fragment>
              <div className="separation-bar"></div>
              {softwares.map((attribute, i) => {
                let val = null;
                let url = "";
                let urlRel = "";
                let uploadRequired = false;
                if (attribute.value && attribute["url-rel"]) {
                  val = attribute.value;
                  urlRel = attribute["url-rel"];
                  uploadRequired = filesToUpload.includes(urlRel);
                } else if (attribute.value && attribute.url) {
                  val = attribute.value;
                  url = attribute.url;
                }
                return (
                  <div key={i}>
                    {`${attribute.key}: `}
                    {val && uploadRequired ? (
                      <label>{`${val} (update required)`}</label>
                    ) : url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {val}
                      </a>
                    ) : (
                      <HyperlinkTextButton title={val} onClick={() => this.props.downloadFile(urlRel)} />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          )}
        </div>
      </Fragment>
    );
  }
}

class EquipmentItem extends Component {
  constructor(props) {
    super(props);
    let { parentAction } = props;
    this.state = {
      open: parentAction && parentAction.expand ? true : false,
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.parentAction !== this.props.parentAction) {
      let { parentAction } = this.props;
      this.setState({
        open: parentAction && parentAction.expand ? true : false,
      });
    }
  }
  render() {
    let {
      addNew,
      editMode,
      equipment,
      editEquipmentCallback,
      path,
      filesToUpload,
      allowedDepth,
      equipmentTypeIcons,
      parentAction,
    } = this.props;
    let { open } = this.state;
    let currentDepth = this.props.currentDepth + 1;
    let iconGroup =
      equipment && equipment.equipmentType && equipmentTypeIcons[equipment.equipmentType]
        ? equipmentTypeIcons[equipment.equipmentType]
        : "equipment";
    let icon_path = equipmentIconsImageLookup[iconGroup] ? equipmentIconsImageLookup[iconGroup] : equipmentIconsImageLookup["equipment"];
    return (
      <Fragment>
        <div className={`equipment-item`}>
          <div className={"equipment-item-tree-borders-parent"}>
            <div className="equipment-item-tree-borders-child"></div>
          </div>
          {addNew ? (
            <CustomIcon
              status="Add"
              iconGroup={EquipmentTreeActionIconGroup}
              className={"equipment-user-action-icon"}
              onShortPress={() => editEquipmentCallback && editEquipmentCallback("create", [...path])}
            />
          ) : (
            <Fragment>
              <div style={{ position: "relative" }}>
                <ArrowHead
                  open={open}
                  toggle={() => {
                    this.setState({ open: !open });
                  }}
                />
                <img className="equipment-icon" src={icon_path} />
                <span>
                  {`${equipment.name} `} <span style={{ fontWeight: "bold" }}>{`(${equipment.equipmentType})`}</span>
                </span>
                {editMode && (
                  <Fragment>
                    <CustomIcon
                      status="Delete"
                      iconGroup={EquipmentTreeActionIconGroup}
                      className={"equipment-user-action-icon-delete"}
                      onShortPress={() => editEquipmentCallback && editEquipmentCallback("delete", [...path])}
                    />
                    <CustomIcon
                      status="Edit"
                      iconGroup={EquipmentTreeActionIconGroup}
                      className={"equipment-user-action-icon"}
                      onShortPress={() => editEquipmentCallback && editEquipmentCallback("edit", [...path])}
                    />
                  </Fragment>
                )}
              </div>
              {(
                <div className={`${open ? 'open' : 'close'}`}>
                  <div>
                    {equipment.attributes && equipment.attributes.length > 0 && (
                      <EquipmentDetailsBox
                        attributes={equipment.attributes}
                        filesToUpload={filesToUpload}
                        downloadFile={this.props.downloadFile}
                      />
                    )}
                    {/* allowedDepth === null => unlimited depth */}
                    {(allowedDepth === null || currentDepth <= allowedDepth) && (
                      <div>
                        {editMode && (
                          <EquipmentItem
                            editEquipmentCallback={editEquipmentCallback}
                            addNew={true}
                            path={[...path]}
                            filesToUpload={[]}
                          />
                        )}
                        {equipment.equipments &&
                          equipment.equipments.length > 0 &&
                          equipment.equipments.map((equipment, index) => (
                            <EquipmentItem
                              equipment={equipment}
                              editEquipmentCallback={editEquipmentCallback}
                              editMode={editMode}
                              key={index}
                              path={[...path, index]}
                              filesToUpload={filesToUpload}
                              downloadFile={this.props.downloadFile}
                              allowedDepth={allowedDepth}
                              currentDepth={currentDepth}
                              equipmentTypeIcons={equipmentTypeIcons}
                              parentAction={parentAction}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  }
}

class EquipmentTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentAction: {
        expand: true,
      },
    };
  }

  render() {
    let { parentAction } = this.state;
    let { asset, editEquipmentCallback, editMode, filesToUpload, allowedDepth, equipmentTypeIcons } = this.props;
    let { equipments, attributes } = asset;
    return (
      <div className={"asset-equipment-config-data scrollbar"}>
        <PillTextButton title={"Collapse All"} onClick={() => this.setState({ parentAction: { expand: false } })} iconState={'down'} iconGroup={ArrowHeadIconGroup}/>
        <PillTextButton title={"Expand All"} onClick={() => this.setState({ parentAction: { expand: true } })}  iconState={'right'} iconGroup={ArrowHeadIconGroup}/>
        <div className={"asset-type"}>
          <img className="equipment-icon" src={equipmentIconsImageLookup["equipment"]} />
          <span>{asset.unitId}</span>
        </div>
        {attributes && Object.keys(attributes).length > 0 && <AssetDetailsBox attributes={attributes} />}
        <div>
          {editMode && <EquipmentItem addNew={true} editEquipmentCallback={editEquipmentCallback} path={[]} filesToUpload={[]} />}
          {equipments &&
            equipments.length > 0 &&
            equipments.map((equipment, index) => (
              <EquipmentItem
                equipment={equipment}
                editMode={editMode}
                editEquipmentCallback={editEquipmentCallback}
                key={index}
                path={[index]}
                filesToUpload={filesToUpload}
                downloadFile={this.props.downloadFile}
                allowedDepth={allowedDepth}
                currentDepth={1}
                equipmentTypeIcons={equipmentTypeIcons}
                parentAction={parentAction}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default EquipmentTree;
