import React, { Component } from "react";
import _ from "lodash";
import { basicColors, retroColors, electricColors } from "../../../../style/basic/basicColors";
import { MyButton } from "../../../Common/Forms/formsMiscItems";
class AssetTestSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      listsIndex: 0,
      selectedItemsInList: [],
      selectedAsset: null,
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }
  componentDidMount() {
    if (this.props.listItems && this.props.listItems.length > 0) {
      this.setState({
        lists: [this.props.listItems],
        listIndex: 0,
        selectedItemsInList: [],
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listItems !== this.props.listItems && this.props.listItems) {
      this.setState({
        lists: [this.props.listItems],
        listIndex: 0,
      });
    }
  }
  handleListItemClick(listItem, listIndex) {
    let listToUp = [...this.state.lists];
    let selectedItemsInList = [...this.state.selectedItemsInList];
    let selectedAsset = { ...this.state.selectedAsset };
    this.checkIfPrevListClicked(listToUp, listIndex);
    this.checkIfPrevListClicked(selectedItemsInList, listIndex);
    listToUp.push(listItem.children);
    let newIndex = listToUp.length - 1;
    if (listIndex > 0) selectedAsset = listItem;
    else selectedAsset = null;
    selectedItemsInList[listIndex] = listItem.id;
    this.setState({ lists: listToUp, listIndex: newIndex, selectedItemsInList, selectedAsset });
  }

  checkIfPrevListClicked(listToUp, listIndex) {
    if (listIndex < this.state.listIndex) {
      _.remove(listToUp, (l, i) => {
        return i > listIndex;
      });
    }
  }

  render() {
    let listsRenders = this.state.lists.map((list, index) => {
      return (
        <ListRenderer
          listIndex={index}
          key={list.id}
          list={list}
          handleListItemClick={this.handleListItemClick}
          selectedId={this.state.selectedItemsInList[index]}
        />
      );
    });
    return (
      <div>
        <SelectedAsset
          selectedAsset={this.state.selectedAsset}
          onSelectionItem={(e) => {
            this.props.onSelectItem(this.state.selectedAsset);
          }}
        />

        <div style={allListContainerStyle}>{listsRenders}</div>
      </div>
    );
  }
}

export default AssetTestSelector;

const ListRenderer = (props) => {
  let ListToShow =
    props.list &&
    props.list.map((item) => {
      return (
        <RowItem
          title={item.title}
          handleListItemClick={(e) => {
            props.handleListItemClick(item, props.listIndex);
          }}
          selected={item.id == props.selectedId}
        />
      );
    });
  return (
    <div style={listContainerStyle} className="scrollbar">
      {ListToShow}{" "}
    </div>
  );
};

const RowItem = (props) => {
  let adjustStyler = props.selected ? { background: "var(--first)" } : {};
  return (
    <div style={{ ...rowItemStyle, ...adjustStyler }} onClick={props.handleListItemClick}>
      {props.title}
    </div>
  );
};

const SelectedAsset = (props) => {
  return (
    <div>
      <div style={selectedAssetStyle}> {props.selectedAsset ? props.selectedAsset.title : "Please Select Asset"}</div>
      <div style={{ cursor: "pointer", display: "inline-block" }}>
        <MyButton disabled={!props.selectedAsset} onClick={props.onSelectionItem}>
          Load
        </MyButton>
      </div>
    </div>
  );
};

const rowItemStyle = {
  background: "var(--fifth)",
  fontSize: "12px",
  color: "var(--second)",
  padding: "5px",
  marginRight: "10px",
  minWidth: "350px",
  cursor: "pointer",
};
const listContainerStyle = { display: "inline-block", maxHeight: "70vh", overflow: "auto" };
const allListContainerStyle = { display: "inline-flex" };
const selectedAssetStyle = {
  display: "inline-block",
  background: "var(--fifth)",
  fontSize: "12px",
  color: "var(--second)",
  padding: "5px 10px",
  marginRight: "30px",
  marginBottom: "15px",
  minWidth: "350px",
  border: "1px solid ",
};
