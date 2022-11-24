import { connect } from "react-redux";

import FilterTableWrapper from "components/Common/ThisTable/FilterTableWrapper";
import { gettaskStatus } from "../reduxRelated/actions/filtertableActions.js";

const mapStateToProps = state => {
	const { filterTableReducer } = state;
	const { actionType, errorMessage, isFetching,taskStatus } = filterTableReducer;
	return {
		isFetching,
		errorMessage,
		actionType,
        taskStatus
	};
};

const mapDispatchToProps = dispatch => {
	return {
		gettaskStatus: query => {
			return dispatch(gettaskStatus(query));
		},
	};
};
const FilterTableWrapperContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(FilterTableWrapper);
export default FilterTableWrapperContainer;
