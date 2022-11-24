import React, { Component } from "react";
import { Row, Col, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { CommonSummaryStyles } from "components/Common/styles";
import UnitList from "./UnitsList/UnitsList";
import UnitsSummary from "./UnitsSummary/UnitsSummary";
import { planningTableData } from "./UnitsData";

import UnitAddEdit from "./UnitAddEdit/UnitAdd";

class Units extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableData: [...planningTableData],
			AddModal: false,
		};

		this.handleAddNewClick = this.handleAddNewClick.bind(this);
	}

	handleAddNewClick() {
		this.setState({
			AddModal: !this.state.AddModal,
		});
	}

	render() {
		const { path } = this.props.match;
		return (
			<Col md="12">
				<UnitAddEdit modal={this.state.AddModal} toggle={this.handleAddNewClick} />
				<Row style={{ borderBottom: "2px solid #d1d1d1", margin: "0px 15px", padding: "10px 0px" }}>
					<Col md="6" style={{ paddingLeft: "0px" }}>
						<div
							style={{
								float: "left",
								fontFamily: "Myriad Pro",
								fontSize: "24px",
								letterSpacing: "0.5px",
								color: " rgba(64, 118, 179)",
							}}
						>
							Units
						</div>
					</Col>
				</Row>
				<Row>
					<Col md="12">
						<div style={CommonSummaryStyles.CommonSummaryStylesHeadingContainer}>
							<h4 style={CommonSummaryStyles.CommonSummaryStylesHeadingStyle}> Units Summary</h4>
						</div>
					</Col>
				</Row>

				<Row>
					<Col md="12">
						<UnitsSummary handleAddNewClick={this.handleAddNewClick} />
					</Col>
				</Row>				
				<Row>
					<Col md="12">
						<UnitList path={path} planningTableData={this.state.tableData} />
					</Col>
				</Row>
			</Col>
		);
	}
}

export default Units;
