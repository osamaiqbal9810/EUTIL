import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import { themeService } from "theme/service/activeTheme.service";
export const switchReportStyle = {
    mainStyle: {
        default: { padding: "30px", overflow: "hidden" },
        retro: { padding: "30px", overflow: "hidden", background: "var(--fifth)" },
        electricColors: { padding: "30px", overflow: "hidden", background: "var(--fifth)" },
    },
    logoStyle: {
        default: { display: "inline-block", padding: "0 5px 5px 5px", maxWidth: "100%", width: "120px" },
        retro: { display: "inline-block", padding: "0 5px 5px 5px", maxWidth: "100%", width: "120px" },
        electric: { display: "inline-block", padding: "0 5px 5px 5px", maxWidth: "100%", width: "120px" },
    },
    headingStyle: {
        default: { textTransform: "uppercase", display: "block", textAlign: "center", transform: "translateX(-14%)", marginBottom: "30px" },
        retro: { display: "block", textAlign: "center", transform: "translateX(-12%)", margin: "12px", fontWeight: "bold" },
        electric: { display: "block", textAlign: "center", transform: "translateX(-12%)", margin: "12px", fontWeight: "bold" },
    },
    labelStyle: {
        default: {},
        retro: {
            margin: "5px 5px 5px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "var(--second)",
            float: "none",
        },
        electric: {
            margin: "5px 5px 5px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "var(--second)",
            float: "none",
        },
    },
}