import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
export const calenderCellStyle = {
    dayColmns: {
        default: {
            padding: "10px",
            color: basicColors.first,
            width: "14.28%",
            fontSize: "14px"

        },
        retro: {
            color: retroColors.second,
            padding: "10px",
            width: "14.28%",
            fontSize: "14px",
            borderRight: "1px solid " + retroColors.fourth,
            textTransform: "capitalize"

        },
        electric: {
            color: electricColors.second,
            padding: "10px",
            width: "14.28%",
            fontSize: "14px",
            borderRight: "1px solid " + electricColors.fourth,
            textTransform: "capitalize"

        }
    },
    dayRow: {
        default: {
            WebkitBoxShadow: "0 2px 15px 0 rgba(0, 0, 0, 0.15)",
            boxShadow: "0 2px 15px 0 rgba(0, 0, 0, 0.15)",
            border: "none",
            backgroundColor: "var(--eleventh)",
            height: "20px"
        },
        retro: {

            border: "none",
            backgroundColor: retroColors.first,
            height: "20px"
        },
        electric: {

            border: "none",
            backgroundColor: electricColors.first,
            height: "20px"
        }
    },
    dateCell: {
        default: {
            color: "var(--fifth)",
            fontSize: "12px", fontFamily: "Arial",
            letterSpacing: "0.3px",
            height: "120px",
            overflow: "hidden",
            border: "1px solid #efefef",
            paddingRight: "0"
        },
        retro: {
            height: "140px",
            overflow: "hidden",
            border: "1px solid" + retroColors.fourth,
            padding: "0",

        },
        electric: {
            height: "140px",
            overflow: "hidden",
            border: "1px solid" + electricColors.fourth,
            padding: "0",

        }
    }
}