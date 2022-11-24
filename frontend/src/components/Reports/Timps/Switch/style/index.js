import { basicColors, retroColors } from "style/basic/basicColors";
import { themeService } from "theme/service/activeTheme.service";
export const switchReportStyle = {
    mainStyle: {
        default: { padding: "30px", overflow: "hidden" },
        retro: { padding: "30px", overflow: "hidden", background: "#fff" },
    },
    logoStyle: {
        default: { display: "inline-block", padding: "0 5px 5px 5px", maxWidth: "100%", width: "120px" },
        retro: { display: "inline-block", padding: "0 5px 5px 5px", maxWidth: "100%", width: "120px" },
    },
    headingStyle: {
        default: { textTransform: "uppercase", display: "block", textAlign: "center", transform: "translateX(-14%)", marginBottom: "30px" },
        retro: { display: "block", textAlign: "center", transform: "translateX(-12%)", margin: "12px", fontWeight: "bold" },
    },
    labelStyle: {
        default: {},
        retro: {
            margin: "5px 5px 5px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "rgb(26, 26, 26)",
            float: "none",
        },
    },
}