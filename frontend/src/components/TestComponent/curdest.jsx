import React, { Component } from "react";
import { connect } from "react-redux";
import * as types from "reduxRelated/ActionTypes/actionTypes.js";
import { CALL_API } from "reduxRelated/middleware/api";
import { CRUDFunction } from "reduxCURD/container";

class testComponent extends Component {
	constructor(props) {
		super(props);
		this.state = { response: "" };
	}

	componentDidMount() {
		let updateObj = { _id: "123", name: "none" };
		this.props.getTest();
		//	this.props.customFunc(updateObj);
		//	this.props.customFuncSecond(updateObj);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.actionType == "TEST_READ_FAILURE" && this.props.actionType !== nextProps.actionType) {
			this.setState({
				response: "TEST request failed status : " + nextProps.errorMessage.status,
			});
		}
	}

	render() {
		return (
			<div>
				<div>{this.state.response} </div>
				<div>
					<ExampleComponent />
				</div>
			</div>
		);
	}
}

class ExampleComponent extends Component {
	render() {
		return <div>Another Component</div>;
	}
}

function customFunc(arg) {
	let argCreate = { [arg]: arg };
	const options = {
		headers: { "Content-Type": "application/json", Accept: "application/json" },
		method: "POST",
		body: JSON.stringify(argCreate),
	};
	return {
		[CALL_API]: {
			endpoint: "customFirst",
			authenticated: true,
			types: [types.MY_RANDOM_ACTION_START, types.MY_RANDOM_ACTION_STOP, types.MY_RANDOM_ACTION_END],
			config: options,
		},
	};
}

function customFuncSecond(arg) {
	let argCreate = { [arg]: arg };
	const options = {
		headers: { "Content-Type": "application/json", Accept: "application/json" },
		method: "POST",
		body: JSON.stringify(argCreate),
	};
	return {
		[CALL_API]: {
			endpoint: "customSecond",
			authenticated: true,
			types: [types.MY_RANDOM_ACTION_START, types.MY_RANDOM_ACTION_STOP, types.MY_RANDOM_ACTION_END],
			config: options,
		},
	};
}

// let testVariablesList = { test: "", testList: "" };
// let exampleVariablesList = { example: "", examples: "" };
let actionOptions = {
	create: true,
	update: true,
	read: true,
	delete: true,
	others: { customFunc: customFunc, customFuncSecond: customFuncSecond },
 };
// let test = CRUDFunction(testComponent, "test", actionOptions, null, null);
 export default testComponent;
