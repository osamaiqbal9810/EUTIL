import React, { Component } from "react";
import ThisTable from "./index";
import { Col, Row } from "reactstrap";
import PropTypes from "prop-types";
import Radium from "radium";
import _ from "lodash";
import * as types from "reduxRelated/ActionTypes/actionTypes.js";
class FilterTableWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAllOrMe: true,
			taskStatus: [],
			showTaskStatus: this.props.showTaskStatus || true,
			actionType: "",
		};

		this.handleTaskStatusFilterClick = this.handleTaskStatusFilterClick.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (
			nextProps.taskStatus !== prevState.taskStatus &&
			nextProps.actionType !== prevState.actionType &&
			nextProps.actionType == types.TASKSTATUS_GET_SUCCESS
		) {
			let taskStatus = nextProps.taskStatus;
			let copyTaskStatus = [...taskStatus];

			copyTaskStatus.forEach((filter, index) => {
				filter.enabled = true;
			});
			return {
				taskStatus: copyTaskStatus,
				actionType: nextProps.actionType,
			};
		} else {
			return null;
		}
	}

	handleTaskStatusFilterClick(id) {
		const { taskStatus } = this.state;
		let copyTaskStatus = [...taskStatus];
		let result = _.find(copyTaskStatus, { _id: id });
		if (result) {
			result.enabled = !result.enabled;
			this.setState({
				taskStatus: copyTaskStatus,
			});
		}
	}

	componentDidMount() {
		if (this.props.getTaskFilters) {
			let query = {};
			query.filterable = true;
			query.type = this.props.filtersType;

			this.props.gettaskStatus(query);
		}
	}

	filterTableData() {
		let filteredData = [];
		const { tableData } = this.props;
		const { taskStatus } = this.state;
		if (this.props.getTaskFilters) {
			tableData.forEach((data, index) => {
				if (this.state.showTaskStatus) {
					taskStatus.forEach(filters => {
						if (data.status == filters.name && filters.enabled) {
							filteredData.push(data);
						}
					});
				}
			});
		} else {
			filteredData = tableData;
		}
		return filteredData;
	}

	render() {
		//console.log(this.state.taskStatus);
		let taskStatusContent = null;
		const styles = getStyles(this.props, this.state);

		if (this.state.taskStatus.length > 0) {
			taskStatusContent = this.state.taskStatus.map((filterObj, index) => {
				let splitter = null;
				if (index !== this.state.taskStatus.length - 1) {
					splitter = <div style={styles.splitter}>|</div>;
				}
				let filterObjtaskStatusStyle = {
					display: "inline-block",
					color: "#87a3b9",
					borderTop: "2px solid #e3e9ef",
					fontWeight: "normal",
					cursor: "pointer",
				};
				if (filterObj.enabled) {
					filterObjtaskStatusStyle.color = "#37668b";
					filterObjtaskStatusStyle.borderTop = "2px solid #37668b";
					filterObjtaskStatusStyle.fontWeight = "bold";
				}

				return (
					<div key={filterObj._id} style={styles.filterObjtaskStatusContainer}>
						<div
							style={filterObjtaskStatusStyle}
							onClick={e => {
								this.handleTaskStatusFilterClick(filterObj._id);
							}}
						>
							{filterObj.name}
						</div>
						{splitter && <div style={styles.splitterStyle}> {splitter}</div>}
					</div>
				);
			});
		}
		let filteredTableData = this.filterTableData();
		return (
			<div>
				<Row style={styles.filterContainer}>
					{this.props.getTaskFilters && <div style={styles.taskStatusArea}>Task Status: {taskStatusContent}</div>}
				</Row>
				<ThisTable tableColumns={this.props.tableColumns} tableData={filteredTableData} pageSize = {this.props.pageSize}  />
			</div>
		);
	}
}

FilterTableWrapper.propTypes = {
	getTaskFilters: PropTypes.bool,
	filtersType: PropTypes.string,
	tableColumns: PropTypes.array,
	tableData: PropTypes.array,
};
export default FilterTableWrapper;

let getStyles = (props, state) => {
	return {
		splitterStyle: {
			display: "inherit",
			padding: "0px 10px",
			fontSize: "smaller",
		},
		filterObjtaskStatusContainer: {
			display: "inline-block",
		},
		taskStatusArea: {
			color: "#87a3b9",
		},
		filterContainer: {
			fontFamily: "Arial",
			padding: "10px 0px",
			fontSize: "12px",
			margin: "0px",
			letterSpacing: "0.3px",
		},
	};
};
