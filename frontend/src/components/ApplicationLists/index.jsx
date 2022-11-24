/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { curdActions } from "reduxCURD/actions";
import { CRUDFunction } from "reduxCURD/container";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import _ from "lodash";
// import SvgIcon from "react-icons-kit";
// import { ButtonCirclePlus } from "components/Common/Buttons";
import EditableTable from "components/Common/EditableTable";
import { guid } from "utils/UUID";
import { Row, Col } from "reactstrap";
import { languageService } from "../../Language/language.service";
import { MyButton } from "../Common/Forms/formsMiscItems";
import { themeService } from "../../theme/service/activeTheme.service";

import { commonStyles } from "../../theme/commonStyles";
import permissionCheck from "utils/permissionCheck.js";
// const Label = props => <label> {props.children}</label>
// const Field = props => <div className="field">{props.children}</div>
// const Required = () => <span className="required-fld">*</span>

const ListsToEdit = [
  { listName: "maintenanceTypes", text: "Maintenance Types" },
  { listName: "crewSkills", text: "Crew Skills" },
  { listName: "equipmentTypes", text: "Equipment Types" },
  { listName: "materialTypes", text: "Material Types" },
  //{ listName: "departments", text: "Departments" },
  { listName: "remedialAction", text: "Slow Orders" },
  //{ listName: "alphaNumericMilepostIOC", text: "Yard Markers List", listField:"opt1", listType:"text" }
];

const ListTableCols = [
  // {id:"Select", header: "Select", type:"bool", field: "selected", editable: false, minWidth: 20},
  //{id:"id", header: "id", type:"text",field: "code", editable: false, minWidth: 100},
  { id: "value", header: languageService("Value"), type: "text", field: "description", editable: false, minWidth: 100 },
  {
    id: "actions",
    header: languageService("Actions"),
    type: "action",
    immediate: ["Edit", "Delete"],
    editMode: ["Save", "Cancel"],
    editable: false,
    minWidth: 100,
  },
];

const ButtonedList = (props) => {
  let rets = null;
  if (props.options && props.options.length) {
    rets = props.options.map((v) => {
      // debugger;
      return (
        <MyButton
          key={v.text}
          onClick={(action) => {
            if (props.onClick) props.onClick(action, v);
          }}
          disabled={v.disabled ? v.disabled : false}
        >
          {v.text ? languageService(v.text) : languageService(v.toString())}
        </MyButton>
      );
    });
  }
  return <div className="button-list">{rets}</div>;
};

class ApplicationLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {},
      categories: _.cloneDeep(ListsToEdit),
      categoryNames: ListsToEdit.map((v) => {
        return v.listName;
      }),
      list: [],
      pageSize: 30,
      page: 0,
    };
    this.backup = new Map();
    this.originalApplicationListItem={};

    if (this.state.categories && this.state.categories.length && this.state.categories.length > 0) {
      this.state.category = this.state.categories[0];
      this.state.category.disabled = true;
    }

    this.onListSelect = this.onListSelect.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
    this.handleListChange = this.handleListChange.bind(this);
    this.addEntry = this.addEntry.bind(this);
    this.handlePageSave = this.handlePageSave.bind(this);
  }

  componentDidMount() {
    this.props.getApplicationlookupss(this.state.categoryNames);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType == "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {
      //console.log('APPLICATIONLOOKUPSS_READ_SUCCESS,', this.props.applicationlookupss);
      this.setApplicationLists(this.props.applicationlookupss);
      // this.onListSelect(null, this.state.categories[0]);
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType == "APPLICATIONLOOKUPS_UPDATE_SUCCESS"
    ) {
      this.props.getApplicationlookupss(this.state.categoryNames);
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType == "APPLICATIONLOOKUPS_CREATE_SUCCESS"
    ) {
      this.props.getApplicationlookupss(this.state.categoryNames);
    }
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType == "APPLICATIONLOOKUPS_DELETE_SUCCESS"
    ) {
      this.props.getApplicationlookupss(this.state.categoryNames);
    }
  }

  onListSelect(action, element) {
    // console.log('clicked', action, actionText);
    let selectedCat = null;
    let cats = _.cloneDeep(this.state.categories);
    cats.forEach((v) => {
      v.disabled = v.text === element.text;
      if (v.listName === element.listName) selectedCat = v;
    });

    this.setApplicationLists(this.props.applicationlookupss, selectedCat);
    this.setState({categories: cats, category: selectedCat, page: 0});
  }
  setApplicationLists(lists, newlySelectedCategory=null) {
    let selectedCategory = !newlySelectedCategory ? this.state.category :  newlySelectedCategory;
    let listName = selectedCategory.listName;
    // Filter the lists and get selected category list
    let listToDisplay = lists.filter((v) => {
      return v.listName === listName;
    });

    // if selected category is of type that holds all list in single field then extract list from field
    if(selectedCategory.listField)
    {
      // If this whole list resides in a field than more than one database entries will cause problems. Display error.
      if(listToDisplay.length>1)
        console.log('Applicationlists.index.setApplicationLists.warning: list', selectedCategory.listName, ' must not have more than one entry in database. The length is:', listToDisplay.length);

      if(listToDisplay[0] && listToDisplay[0][selectedCategory.listField])
       { 
        this.originalApplicationListItem = _.cloneDeep(listToDisplay[0]);
        listToDisplay = listToDisplay[0][selectedCategory.listField].map(t=>{return{_id:'id-'+t, id:'id-'+t, description: t}});
       }
      else
        console.log('Applicationlists.index.setApplicationLists.error: list', selectedCategory.listName,' doesnt have the required field', selectedCategory.listField);
      

    }

    this.setState({ list: listToDisplay });
  }
  handleActionClick(action, obj) {
    let list = _.cloneDeep(this.state.list);
    let deleteIndex = null,
      index = 0,
      dirty = false;
    //console.log(action, ' pressed on grid', obj);
    for (let item of list) {
      if (item._id === obj._id) {
        if (action === "Edit") {
          // make backup for cancel
          let itm = _.cloneDeep(item);
          this.backup.set(item._id, itm); // backup data for cancel edit
          item.editMode = true;
        } else if (action === "Save") {
          if (item.description.trim() !== "") {
            item.editMode = false;
            dirty = true;
          }
        } else if (action === "Cancel") {
          if (this.backup.has(item._id)) {
            let itembk = this.backup.get(item._id);

            item.editMode = itembk.editMode;
            // item.code = itembk.code;
            item.description = itembk.description;
          } //delete this row because it's a new one
          else {
            deleteIndex = index;
          }
        } else if (action === "Delete") {
          deleteIndex = index;
        }
         if(this.state.category.listField)  // If the whole list is in a field, then deal this list differently
         {
           let updateList=false;
            if(deleteIndex!==null) // delete item from the list and update
            {
              list.splice(deleteIndex, 1);
              updateList = true;
            }
            else if(dirty)
            {
              if(item.newItem)
              {
                delete item.newItem;
                delete item.editMode;
                delete item._id;
                list.push({id:'id-'+item.description, description: item.description});
                updateList = true;
              }
              else
              {
                delete item.editMode;
                let itm = list.find(it=>{return it.id==item.id});
                itm.description = item.description;
                itm.id = 'id-'+item.description;
                updateList = true;
              }
            }
            if(updateList)
              this.updateOriginalApplicationListItem(this.state.category, this.originalApplicationListItem, list);
         }
         else
         {
            if (deleteIndex != null) {
              this.props.deleteApplicationlookups(item);
              list.splice(deleteIndex, 1);
            } else if (dirty) {
              if (item.newItem) {
                delete item.newItem; // delete before it goes to server
                delete item.editMode;
                delete item._id;
                this.props.createApplicationlookups(item);
              } else {
                let itm = _.cloneDeep(item);
                delete itm.editMode;
                this.props.updateApplicationlookups(itm);
              }
            } 
        }

        this.setState({ list: list });
        break;
      }

      index++;
    }
  }
  addEntry() {
    let list = _.cloneDeep(this.state.list);

    list.push({ _id: guid(), description: "", listName: this.state.category.listName, editMode: true, newItem: true });

    let lastPage = Math.ceil(list.length / this.state.pageSize);

    lastPage = lastPage <= 0 ? 0 : lastPage - 1;

    this.setState({ list: list, page: lastPage });
  }
  handleListChange(name, value, obj) {
    let list = _.cloneDeep(this.state.list);
    for (let item of list) {
      if (item._id === obj._id) {
        item[name] = value;
        this.setState({ list: list });
        break;
      }
    }
  }
  updateOriginalApplicationListItem (category, originalApplicationListItem, list) {
    // put the list in desired field and issue update to server.
    if(category && category.listField)
    {
      // todo: determine the type list field and store appropriately. Currently it's just text
      originalApplicationListItem[category.listField] = list.map(item=>{return item.description;});
      this.props.updateApplicationlookups(originalApplicationListItem);
    }
  };

  handlePageSave(page, pageSize) {
    this.setState({
      page: page,
      pageSize: pageSize,
    });
  }

  handlePageReset = () => {
    this.setState({
      page: 0,
    });
  };

  
  render() {
    return (
      <Col md="12">
        <Row style={themeService(commonStyles.pageBorderRowStyle)}>
          <div style={themeService(commonStyles.pageTitleDetailStyle)}>{languageService("List")}</div>
        </Row>
        <Col md={12}>
          <ButtonedList options={this.state.categories} onClick={this.onListSelect} />
        </Col>
        <Row>
          <Col md="12">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("Data")}</h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <EditableTable
              columns={ListTableCols}
              data={this.state.list}
              handleActionClick={this.handleActionClick}
              onChange={this.handleListChange}
              pageSize={this.state.pageSize}
              pagination={true}
              handlePageSave={this.handlePageSave}
              page={this.state.page}
            />
          </Col>
        </Row>

        <Col md="2">
          {permissionCheck("SETUP LIST DATA", "create") && <MyButton onClick={this.addEntry}>{languageService("Add")}</MyButton>}
        </Col>
      </Col>
    );
  }
}
const getApplicationlookupss = curdActions.getApplicationlookupss;
const updateApplicationlookups = curdActions.updateApplicationlookups;
const deleteApplicationlookups = curdActions.deleteApplicationlookups;
const createApplicationlookups = curdActions.createApplicationlookups;

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    getApplicationlookupss: getApplicationlookupss,
    updateApplicationlookups: updateApplicationlookups,
    deleteApplicationlookups: deleteApplicationlookups,
    createApplicationlookups: createApplicationlookups,
  },
};
let variables = {
  applicationlookupsReducer: {
    applicationlookupss: [],
  },
};

const ApplicationListsContainer = CRUDFunction(ApplicationLists, "applicationLists", actionOptions, variables, [
  "applicationlookupsReducer",
]);

export default ApplicationListsContainer;
