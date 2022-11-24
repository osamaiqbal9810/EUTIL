/* eslint eqeqeq: 0 */

import { basicColors, retroColors } from "style/basic/basicColors";

export const thisTableStyle = {
  outerStyle: {
    default: {
      backgroundColor: basicColors.fourth,
      padding: "15px",
    },
    retro: {
      backgroundColor: retroColors.fifth,
      padding: "0",
      width: "100%",
    },
  },
  HeaderPropsStyle: {
    default: {
      border: "none",
      color: basicColors.first,
      fontSize: "12px",
      letterSpacing: "0.3px",
      backgroundColor: basicColors.second,
    },
    retro: {
      border: "none",
      color: retroColors.secoud,
      fontSize: "12px",
      fontWeight: "bold",
      letterSpacing: "0.3px",
      backgroundColor: retroColors.fourth,
      padding: "10px 0",
    },
  },
  rowStyle: rowStyleMethod,
  detailBtnStyle: {
    default: {
      fontFamily: "Arial",
      fontSize: "11px",
      letterSpacing: "0.28px",
      color: "#a7cdb8",
      float: "right",
      margin: "5px 10px 0 0",
    },
    retro: {
      fontFamily: "Arial",
      fontSize: "11px",
      letterSpacing: "0.28px",
      color: retroColors.second,
      margin: "-15px 0 0 15px",
      padding: "8px",
      backgroundColor: retroColors.first,
    },
  },
  cellStyle: {
    default: {
      textAlign: "left",
      display: "flex",
      padding: "0px 5px",
      flexDirection: "column",
      justifyContent: "center",
    },
    retro: {
      textAlign: "left",
      display: "flex",
      padding: "0px 5px",
      flexDirection: "column",
      justifyContent: "center",
      borderColor: retroColors.seventh,
      border: "1px solid #ddd",
    },
  },
  tableStyle: {
    default: {
      border: "none",
    },
    retro: {
      border: "none",

      display: "block",
    },
  },
};
function rowStyleMethod(indexRow, state, props, rowInfo) {
  let textColorOverride = null;
  //console.log(props.rowStyleMap);
  if (props.rowStyleMap && props.rowStyleMap.length && rowInfo && rowInfo.original) {

    for (let rmap of props.rowStyleMap) {
      if (rmap && rmap.fieldName && rowInfo.original[rmap.fieldName] && rowInfo.original[rmap.fieldName].toUpperCase() === rmap.value.toUpperCase()) {
        textColorOverride = rmap.textColor;
      }
    }
  }

  return {
    default: {
      background: (indexRow || indexRow == 0) && indexRow === state.selected ? "#5e8d8f" : "#fff",
      color: (indexRow || indexRow == 0) && indexRow === state.selected ? "#fff" : textColorOverride ? textColorOverride : "rgba(64, 118, 179)",
      fontSize: "12px",
      fontFamily: "Arial",
      letterSpacing: "0.3px",
      height: props.forDashboard ? "20px" : "35px",
      ":hover": {
        backgroundColor: " rgba(64, 118, 179) !important",
        color: "#fff !important",
        cursor: "pointer",
      },

    },
    retro: {
      background: (indexRow || indexRow == 0) && indexRow === state.selected ? retroColors.first : "#fff",
      color: (indexRow || indexRow == 0) && indexRow === state.selected ? retroColors.second : textColorOverride ? textColorOverride : retroColors.second,
      fontSize: "12px",
      fontFamily: "Arial",
      letterSpacing: "0.3px",
      height: props.forDashboard ? "20px" : "35px",

      ":hover": {
        backgroundColor: retroColors.first + " !important",
        //color: "#fff !important",
        cursor: "pointer",
      },

    },
  };
}
