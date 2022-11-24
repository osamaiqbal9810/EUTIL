// import React, { Component } from 'react'
// import ThisTable from 'components/Common/ThisTable/index'
// import moment from 'moment'
// import Gravatar from 'react-gravatar'
// import { getStatusColor } from 'utils/statusColors.js'
// import { Link, Route } from 'react-router-dom'
// import { ButtonActionsTable } from 'components/Common/Buttons'
// import _ from 'lodash'
// import CommonFilters from 'components/Common/Filters/CommonFilters'
// import permissionCheck from 'utils/permissionCheck.js'
// import SelectOption from 'components/Common/SelectOption';

// class EditableTable extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       selected: null,
//       filteredData: [],
//       tableOptions: {}
//     }
//     // Each coloumn should contain: id, Header, minWidth, type(text, date, time, datetime, gps, status, action),
//     //            fieldName, editing
//     //        
//     this.updateColumns();
//   }
//   getAccessor(name, type, field, possibleValues, immediate, editModeText)
//   {
//     // type(text, date, time, datetime, gps, status, action),
//     //            fieldName, editing      
//         let ret = d =>{
//             let val = null;
//             //console.log('accessor:', type, field, d);
//             if((d && d[field]!=undefined) || (immediate && immediate.length>0))
//             {
//                 if(immediate && immediate.length>0)
//                 {
//                     val = immediate.map((v,i)=>{
//                         return v;
//                     });
                    
//                     if(d.editMode && editModeText && editModeText.length>0)
//                     {
//                         val = editModeText.map((v, i)=>{
//                             return v;
//                         });
//                     }
//                 }
//                 else
//                  val=d[field];

//                 if(type=='text')
//                 {
//                     //val=d[field];
//                     if(d.editMode)
//                     {
//                         if(possibleValues && possibleValues.length > 0)
//                         {
//                             // display select option
//                             val = <SelectOption name={name} options={possibleValues} selected={val} onChange={(n,v)=>{this.props.onChange(n,v,d);}}/>
//                         }
//                         else
//                         {
//                             // display editable text field
//                             //console.log('text area', val); //console.log('onchange', {e}, e.target.value);
//                             val = <textarea value={val} onChange={(e)=>{this.props.onChange(name, e.target.value, d);}}></textarea>

//                         }
//                     }
//                 }
//                 else if(type=='timestamp' || type=='datetime')
//                 {
//                         val = moment.utc(val).format('llll')
//                 }
//                 else if(type=='gps')
//                 {
//                     let valueTaskStartLoc = '', planStr=val;
//                     let linkSrc = '#'
//                     if (planStr !== '' && planStr) {
//                     const [lat, lon] = planStr.split(',')
//                     valueTaskStartLoc = `Lat: ${lat}, Lon: ${lon}`
//                     linkSrc = 'https://www.google.com/maps/place/' + planStr
//                     }
                
//                 val =  (<a href={linkSrc} style={{ color: 'inherit' }} target="_blank">{valueTaskStartLoc} </a>);
//                 }
//                 else if(type=='status')
//                 {
//                     val = (<div style={{
//                         background: getStatusColor(val),
//                         padding: '5px',
//                         textAlign: 'center',
//                         margin: '15px',
//                         borderRadius: '2px',
//                         color: '#fff'
//                     }}>
//                     {val}
//                     </div>);
//                 }
//                 else if(type=='action')
//                 {
//                    if(val.length && val.length > 0)
//                    {
//                        val = val.map((v,i)=>{return (<ButtonActionsTable
//                                 handleClick={e => {
//                                 this.props.handleActionClick(v, d)
//                                 }}
//                                 margin="0px 10px 0px 0px"
//                                 buttonText={v}
//                                 key={i}
//                             />)});
//                    }
                   
//                 }
//             }
//             //else console.log(field not found)

//             return val;
//     }

//         return ret;

//   }
//   updateColumns()
//   {
//     let cols = this.props.columns;
//     let columns=[];

//     cols.forEach((col, index)=>{
//         let c={
//             id : col.id ? col.id : col.header,
//             Header : col.header,
//             minWidth : col.minWidth ? col.minWidth : 150,
//             accessor : col.accessor ? col.accessor : this.getAccessor(col.field, col.type, col.field, col.possibleValues, col.immediate ? col.immediate:{}, col.editMode ? col.editMode:{})
//         };
//         columns.push(c);
//         if(index===cols.length-1)
//         {
//           this.setState({columns: columns});
//         }
//     });
//   }
//   componentDidUpdate(prevProps, prevState) 
//   {
//     if(this.props.columns.length != prevProps.columns.length)    
//     {
//       this.updateColumns();
//     }
//     // if(this.props.actionType=='MAINTENANCES_READ_SUCCESS' && this.props.maintenanceData)
//     // {
//     //     let l=this.props.maintenanceData.length;
//     //     if(l !=this.state.dataLength && l > 0 )
//     //     {
//     //         //console.log('MaintenanceList->componentDidUpdate', this.props.maintenanceData);
//     //         this.setState({filteredData: this.props.maintenanceData, dataLength: l});
//     //     }
//     // }
//             // console.log('maintenancelist->componentdidupdate', this.props.maintenanceData);
//             // console.log(prevProps.actionType !== this.props.actionType, this.props.actionType=='MAINTENANCES_READ_SUCCESS', this.props.maintenanceData.length);
//             // if(prevProps.actionType !== this.props.actionType && this.props.actionType=='MAINTENANCES_READ_SUCCESS')
//             // {
//             //     if(this.props.maintenanceData.length > 0)
//             //     {
//             //         console.log('MaintenanceList->componentDidUpdate', this.props.maintenanceData);
//             //        // console.log('got data in maintenance list componentdidupdate', this.props.maintenaceData);
//             //         this.setState({filteredData: this.props.maintenaceData});
//             //     }    
//             // }

// }
// componentDidMount() 
// {

// }

// static getDerivedStateFromProps(nextProps, prevState) 
// {
//     return {filteredData: nextProps.data, tableOptions:nextProps.tableOptions};
// }

// render() {
//     let columns = this.state.columns;
//     if (this.props.noActionColumn) {
//       _.remove(this.columns, { id: 'actions' })
//     }
//     return (
//       <div style={{ padding: '0px 15px 15px', width: '-webkit-fill-available' }}>
//         {!this.props.noFilter && (
//           <CommonFilters
//             noFilters
//             tableInFilter
//             //checkTodayAllFilter={this.props.checkTodayAllFilter}
//             showCustomFilter
//             customFilterComp = {this.props.customFilterComp}
//             tableColumns={columns}
//             tableData={this.state.filteredData}
//             pageSize={this.props.pageSize}
//             pagination={true}
//             handlePageSave={this.props.handlePageSave}
//             page={this.props.page}
//           />
//         )}
//       </div>
//     )
//   }
// }

// export default EditableTable;
