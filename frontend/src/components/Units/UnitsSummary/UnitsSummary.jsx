import React, { Component } from "react";
import { CardTypeOne } from "components/Common/Cards";
import { Row, Col, Label, Button } from "reactstrap";
import { SummaryStyle } from "components/Common/styles";
import { plusCircle } from "react-icons-kit/fa/plusCircle";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import SvgIcon from "react-icons-kit";
import { ButtonCirclePlus } from "components/Common/Buttons";
class UnitsSummary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			totalUnits: "12",
			assigned: "4",
			reports: "5",
			planned: "6",
		};
	}

	render() {
		return (
			<div>
				<Row>
					<Col md="11">
						<Row style={SummaryStyle.allCardSummaryContainer}>
							<Col md="3" style={SummaryStyle.cardContainer}>
								<CardTypeOne number={this.state.totalUnits} numberColor="rgba(64, 118, 179)" topRight="13" text="TOTAL Units" />
							</Col>
							<Col md="3" style={SummaryStyle.cardContainer}>
								<CardTypeOne number={this.state.assigned} numberColor="#37B34A" topRight="5" text="ASSIGNED" />
							</Col>
							<Col md="3" style={SummaryStyle.cardContainer}>
								<CardTypeOne number={this.state.reports} numberColor="#EC1C24" topRight="" text="REPORTS" />
							</Col>
							<Col md="3" style={SummaryStyle.cardContainer}>
								<CardTypeOne number={this.state.planned} numberColor="#F6921E" topRight="2" text="PlANNED" />
							</Col>
							{/* <Col md="2" style={SummaryStyle.cardContainer}>
								<CardTypeOne number={this.state.onHold} numberColor="#EC1C24" topRight="2" text="ON HOLD" />
							</Col>
							<Col md="2" style={SummaryStyle.cardContainer}>
								<CardTypeOne number={this.state.finished} numberColor="#37B34A" topRight="1" text="FINISHED" />
							</Col> */}
						</Row>
					</Col>
					<Col md="1">
						<div>
							<ButtonCirclePlus
								iconSize={70}
								icon={withPlus}
								handleClick={this.props.handleAddNewClick}
								backgroundColor="#e3e9ef"
								margin="20px 0px 0px 0px"
								borderRadius="50%"
								hoverBackgroundColor="#e3e2ef"
								hoverBorder="0px"
								activeBorder="3px solid #e3e2ef "
								iconStyle={{
									color: "#c4d4e4",
									background: "#fff",
									borderRadius: "50%",
									border: "3px solid ",
								}}
							/>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

export default UnitsSummary;
