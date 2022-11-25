import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
export const tableCellStyle = {
    tableDate: {
        default: {
            fontSize: "16px",
            fontWeight: "700",
            color: basicColors.first
        },
        retro: {
            fontSize: "16px",
            fontWeight: "700",
            color: retroColors.fifth,
            backgroundColor: retroColors.eight,
            padding: "5px",
            lineHeight: "13px",
            display: "inline-block",
            marginBottom: "5px"
        },
        electric: {
            fontSize: "16px",
            fontWeight: "700",
            color: electricColors.fifth,
            backgroundColor: "rgb(64, 118, 179)",
            padding: "5px",
            lineHeight: "13px",
            display: "inline-block",
            marginBottom: "5px"
        }
    },
    detailIcon: {
        default: { display: "inline-block", width: "15%", verticalAlign: "top", padding: "5px 10px 5px 2px" },
        retro: { display: "none" },
        electric: { display: "none" }
    },
    detailText: {
        default: {
            display: "inline-block",
            width: "85%",
            padding: "5px 10px 5px 5px",
            background: "rgba(255, 255, 255, 0.3)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            OTextOverflow: "ellipsis",
            textOverflow: "ellipsis",
            height: "100%",
            marginBottom: "-5px"
        },
        retro: {
            display: "inline-block",
            width: "100%",
            padding: "5px 10px 5px 5px",
            background: retroColors.fifth,
            whiteSpace: "nowrap",
            overflow: "hidden",
            OTextOverflow: "ellipsis",
            textOverflow: "ellipsis",
            height: "100%",
            marginBottom: "-5px",
            color: retroColors.second

        },
        electric: {
            display: "inline-block",
            width: "100%",
            padding: "5px 10px 5px 5px",
            background: electricColors.fifth,
            whiteSpace: "nowrap",
            overflow: "hidden",
            OTextOverflow: "ellipsis",
            textOverflow: "ellipsis",
            height: "100%",
            marginBottom: "-5px",
            color: electricColors.second

        }
    },
    detailTitle: detailTitleMethod
}
function detailTitleMethod(bgClr) {
    return { default: { background: bgClr }, retro: { border: "1px solid" + bgClr, borderLeft: "5px solid" + bgClr, borderRadius: "0", margin: "2px 10px " }, electric: { border: "1px solid" + bgClr, borderLeft: "5px solid" + bgClr, borderRadius: "0", margin: "2px 10px " } }
}