import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import FilterTableWrapper from "containers/FilterTableContainer";

class TableExample extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userList: [
				{ name: "ABC1", email: "abc@abc.com", status: "Not Started" },
				{ name: "DEF2", email: "abc@abc.com", status: "Not Started" },
				{ name: "GHI3", email: "abc@abc.com", status: "Not Started" },
				{ name: "JKL4", email: "abc@abc.com", status: "Finished" },
				{ name: "MNO5", email: "abc@abc.com", status: "In Progress" },
				{ name: "PQR6", email: "abc@abc.com", status: "On Hold" },
				{ name: "STU7", email: "abc@abc.com", status: "Not Started" },
				{ name: "VWX8", email: "abc@abc.com", status: "Not Started" },
				{ name: "YZA9", email: "abc@abc.com", status: "Not Started" },
				{ name: "BCD10", email: "abc@abc.com", status: "Testing" },
				{ name: "EFG11", email: "abc@abc.com", status: "Finished" },
				{ name: "GHI12", email: "abc@abc.com", status: "Not Started" },
				{ name: "JKL13", email: "abc@abc.com", status: "Not Started" },
				{ name: "MNO14", email: "abc@abc.com", status: "Not Started" },
				{ name: "PQR15", email: "abc@abc.com", status: "In Progress" },
				{ name: "STU16", email: "abc@abc.com", status: "Not Started" },
				{ name: "VWX17", email: "abc@abc.com", status: "Not Started" },
				{ name: "YZA18", email: "abc@abc.com", status: "Not Started" },
			],
			selected: null,
		};

		this.columns = [
			{
				Header: "Name",
				accessor: "name",
			},
			{
				Header: "Email",
				accessor: "email",
				minWidth: 130,
			},
			{
				Header: "Edit",
				Cell: ({ row }) => <div>AA</div>,
			},
		];
	}

	render() {
		return (
			<Col md="12" style={{ padding: "15px" }}>
				<FilterTableWrapper
					tableColumns={this.columns}
					tableData={this.state.userList}
					getTaskFilters
					filtersType="Project"
					pageSize={this.props.pageSize}
				/>
			</Col>
		);
	}
}

export default TableExample;
