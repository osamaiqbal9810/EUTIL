import { basicColors, retroColors, electricColors } from "style/basic/basicColors";

export const DropDownStyle = {
    lblDropDown: {
        default: {
            marginBottom: "0",
            cursor: "pointer",


        },
        retro: {
            marginBottom: "0",
            cursor: "pointer",


        },
        electric: {
            marginBottom: "0",
            cursor: "pointer",


        }
    },
    iconStyle: {
        default: {
            verticalAlign: "middle", marginRight: "10px", display: "inline-block", width: "15px",

        },
        retro: {
            verticalAlign: "middle", marginRight: "10px", display: "inline-block", width: "15px",

        },
        electric: {
            verticalAlign: "middle", marginRight: "10px", display: "inline-block", width: "15px",

        }
    },
    dropdownItem: {
        default: {
            backgroundColor: basicColors.fourth,
            color: basicColors.first,
            ":hover": { backgroundColor: basicColors.first, color: basicColors.fourth, }

        },
        retro: {
            backgroundColor: retroColors.fifth,
            ":hover": { backgroundColor: retroColors.first }

        },

        electric: {
            backgroundColor: electricColors.fifth,
            ":hover": { backgroundColor: electricColors.first }

        }
    }
}