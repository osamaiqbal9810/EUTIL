import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
export const NotificationStyle = {
    notificationBar: {
        default: {
            background: basicColors.third,
            width: "200px",
            fontSize: "17px",
            position: "fixed",
            zIndex: "100",
            height: "100vh",
            borderLeft: "4px solid " + basicColors.first,
            WebkitTransition: "all 0.3s ease-in-out",
            OTransition: "all 0.3s ease-in-out",
            transition: "all 0.3s ease-in-out",
        },
        retro: {
            background: retroColors.fifth,
            width: "20%",
            fontSize: "17px",
            position: "fixed",
            zIndex: "10001",
            maxHeight: "92vh",
            WebkitBoxShadow: "0px 2px 16px -1px rgba(0,0,0,0.75)",
            MozBoxShadow: "0px 2px 16px -1px rgba(0,0,0,0.75)",
            boxShadow: "0px 2px 16px -1px rgba(0,0,0,0.75)",
            right: "15px",
            top: "60px",
            borderRadius: "8px",
            overflow: "hidden"
        }, electric: {
            background: electricColors.fifth,
            width: "20%",
            fontSize: "17px",
            position: "fixed",
            zIndex: "10001",
            maxHeight: "92vh",
            WebkitBoxShadow: "0px 2px 16px -1px rgba(0,0,0,0.75)",
            MozBoxShadow: "0px 2px 16px -1px rgba(0,0,0,0.75)",
            boxShadow: "0px 2px 16px -1px rgba(0,0,0,0.75)",
            right: "15px",
            top: "60px",
            borderRadius: "8px",
            overflow: "hidden"
        }
    },
    notificationBox: {
        default: {
        },
        retro: {
            border: "0px solid black",
            borderRadius: "8px",
            overflow: "hidden",
            margin: "5px",
            padding: "5px"

        }, electric: {
            border: "0px solid black",
            borderRadius: "8px",
            overflow: "hidden",
            margin: "5px",
            padding: "5px"

        }
    },
    header: {
        default: {
        },
        retro: {
            borderRadius: "8px",
            minHeight: "26px",
            padding: "5px",
            fontWeight: "500"
        }, electric: {
            borderRadius: "8px",
            minHeight: "26px",
            padding: "5px",
            fontWeight: "500"
        }
    },
    boxClose: {
        default: {
        },
        retro: {
            cursor: "pointer",
            float: "right"
        },
        electric: {
            cursor: "pointer",
            float: "right"
        }
    },
    textBox: {
        default: {
        },
        retro: {
            fontSize: "11px",
            display: "block",
            width: "100%",
            float: "none",
            textAlign: "left",
            marginTop: "26px"
        },
        electric: {
            fontSize: "11px",
            display: "block",
            width: "100%",
            float: "none",
            textAlign: "left",
            marginTop: "26px"
        }
    },

}
