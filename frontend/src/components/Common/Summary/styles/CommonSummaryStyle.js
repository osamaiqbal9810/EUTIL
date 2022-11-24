import { addButtonCircleStyleMethod } from "../../../../theme/commonStyles";

export const commonSummaryStyle = {
  cardContainer: {
    default: {
      padding: "0px 15px 0px 0px",
      cursor: "pointer",
    },
  },
  allCardSummaryContainer: {
    default: {
      padding: "0px 30px",
    },
  },
  summaryContainer: summaryContainerMethod,
  summaryMainStyle: summaryMainStyleMethod,
  addButtonStyle: addButtonCircleStyleMethod,
};

function summaryMainStyleMethod(props) {
  return {
    default: {
      marginTop: props.summaryShowHide ? "0" : "-250px",
      transition: "all 1s ease-in-out",
    },
  };
}

function summaryContainerMethod(props) {
  return {
    default: { overflow: props.noHideSummary ? "unset" : "hidden" },
  };
}
