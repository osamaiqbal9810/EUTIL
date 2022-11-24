import React, { Component } from "react";
import ThisTable from "components/Common/ThisTable/index";
import moment from "moment";
import Gravatar from "react-gravatar";
import { Container, Col, Row } from "reactstrap";
import { circle } from "react-icons-kit/fa/circle";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import { getStatusColor } from "utils/statusColors.js";
import { Link, Route } from "react-router-dom";
import { check } from "react-icons-kit/metrize/check";
import SvgIcon from "react-icons-kit";
import { withPlus } from "react-icons-kit/entypo/withPlus";

class Units extends Component {
	constructor(props) {
		super(props);
		this.columns = [
			{
				Header: "Name",
				accessor: "name",
				minWidth: 150,
			},
			{
				Header: "MilepostStart",
				id: "rangestart",
				accessor: d => {
					return <div style={{ color: "rgba(64, 118, 179)", textAlign: "center" }}>{d.range.start}</div>;
				},
				minWidth: 100,
			},
			{
				Header: "Milepost End",
				id: "rangeend",
				accessor: d => {
					return <div style={{ color: "rgba(64, 118, 179)", textAlign: "center" }}>{d.range.end}</div>;
				},
				minWidth: 100,
			},
			{
				Header: "Assigned",
				id: "asssigned",
				accessor: d => {
					return <div style={{ color: "rgba(64, 118, 179)", textAlign: "center" }}>{d.asssigned && <SvgIcon size={20} icon={check} />}</div>;
				},
				minWidth: 75,
			},
			{
				Header: "Reports Count",
				id: "issues",
				accessor: d => {
					return <div style={{ color: "rgba(64, 118, 179)", textAlign: "center" }}>{d.issues.length > 0 ? d.issues.length : ""}</div>;
				},
				minWidth: 50,
			},
			{
				Header: "Plans Involved",
				id: "plans",
				accessor: d => {
					return <div style={{ color: "rgba(64, 118, 179)", textAlign: "center" }}>{d.plans.length > 0 ? d.plans.length : ""}</div>;
				},
				minWidth: 50,
			},
			{
				Header: "Length",
				id: "distanceLength",
				accessor: d => {
					return <div style={{ color: "rgba(64, 118, 179)", textAlign: "center" }}>{d.distanceLength}</div>;
				},
				minWidth: 50,
			},
		];
	}

	render() {
		return (
			<div>
				<div style={{ padding: "15px" }}>
					<div style={{ background: "#fff", boxShadow: "3px 3px 5px #cfcfcf" }}>
						<div
							style={{
								textAlign: "left",
								color: "rgba(64, 118, 179)",
								padding: "15px",
								fontSize: "12px",
								fontFamily: "Arial",
								letterSpacing: ".75px",
							}}
						>
							Units in the system
						</div>
					</div>
					<div style={{ boxShadow: "3px 3px 5px #cfcfcf" }}>
						<ThisTable tableColumns={this.columns} tableData={this.props.planningTableData} pageSize={10} pagination={true} />
					</div>
				</div>
			</div>
		);
	}
}

export default Units;
