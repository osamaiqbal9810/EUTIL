import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
export const ButtonStyle = {
    commonButton: {
        default: {
            "height": "30px",
            "minWidth": "150px",
            "marginBottom": "20px",
            "backgroundColor": "var(--first)",
            "border": "1px solid #e3e9ef",
            "color": "var(--fifth)",
            "fontSize": "12px",
            "cursor": "pointer",
            "borderRadius": "4px",
            "WebkitTransitionDuration": "0.4s",
            "OTransitionDuration": "0.4s",
            "transitionDuration": "0.4s"
        },
        retro: {
            "height": "30px",
            "minWidth": "150px",
            "marginBottom": "20px",
            "backgroundColor": retroColors.fifth,
            "border": "1px solid" + retroColors.ten,
            "color": retroColors.second,
            "fontSize": "12px",
            "cursor": "pointer",
            "borderRadius": "0px",
            "WebkitTransitionDuration": "0.4s",
            "OTransitionDuration": "0.4s",
            "transitionDuration": "0.4s",
            fontWeight: "bold"
        },
        electric: {
            "height": "30px",
            "minWidth": "150px",
            "marginBottom": "20px",
            "backgroundColor": electricColors.fifth,
            "border": "1px solid" + electricColors.ten,
            "color": electricColors.second,
            "fontSize": "12px",
            "cursor": "pointer",
            "borderRadius": "0px",
            "WebkitTransitionDuration": "0.4s",
            "OTransitionDuration": "0.4s",
            "transitionDuration": "0.4s",
            fontWeight: "bold"
        }
    },

}
export const CommonModalStyle = {
    header: {
        default: {
            "display": "flex",
            "MsFlexAlign": "start",
            "alignItems": "flex-start",
            "MsFlexPack": "justify",
            "justifyContent": "space-between",
            "padding": "1rem",
            "borderBottom": "1px solid #e9ecef",
            "borderTopLeftRadius": ".3rem",
            "borderTopRightRadius": ".3rem"
        },
        retro: {
            "display": "flex",
            "MsFlexAlign": "start",
            "alignItems": "flex-start",
            "MsFlexPack": "justify",
            "justifyContent": "space-between",
            "padding": "1rem",
            "borderBottom": "0px solid #e9ecef",
            "borderTopLeftRadius": "0rem",
            "borderTopRightRadius": "0rem",
            backgroundColor: retroColors.fourth
        }
        ,
        electric: {
            "display": "flex",
            "MsFlexAlign": "start",
            "alignItems": "flex-start",
            "MsFlexPack": "justify",
            "justifyContent": "space-between",
            "padding": "1rem",
            "borderBottom": "0px solid #e9ecef",
            "borderTopLeftRadius": "0rem",
            "borderTopRightRadius": "0rem",
            backgroundColor: electricColors.fourth
        }
    },
    body: {
        default: {
            "position": "relative",
            "MsFlex": "1 1 auto",
            "flex": "1 1 auto",
            "padding": "1rem"
        },
        retro: {
            "position": "relative",
            "MsFlex": "1 1 auto",
            "flex": "1 1 auto",
            "padding": "1rem",
            "backgroundColor": retroColors.nine,

        },
        electric: {
            "position": "relative",
            "MsFlex": "1 1 auto",
            "flex": "1 1 auto",
            "padding": "1rem",
            "backgroundColor": electricColors.nine,

        }
    },
    footer: {
        default: {
            "display": "flex",
            "MsFlexAlign": "center",
            "alignItems": "center",
            "MsFlexPack": "end",
            "justifyContent": "flex-end",
            "padding": "1rem",
            "borderTop": "1px solid #e9ecef"
        },
        retro: {
            "display": "flex",
            "MsFlexAlign": "center",
            "alignItems": "center",
            "MsFlexPack": "end",
            "justifyContent": "flex-end",
            "padding": "1rem",
            "borderTop": "0px solid #e9ecef",
            backgroundColor: retroColors.nine
        },
        electric: {
            "display": "flex",
            "MsFlexAlign": "center",
            "alignItems": "center",
            "MsFlexPack": "end",
            "justifyContent": "flex-end",
            "padding": "1rem",
            "borderTop": "0px solid #e9ecef",
            backgroundColor: electricColors.nine
        }

    }
}