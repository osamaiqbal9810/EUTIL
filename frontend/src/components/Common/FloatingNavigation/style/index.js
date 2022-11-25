import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
export const topNavigationStyle = {
    navWrapper: {
        default: {
            background: basicColors.first,
            width: "50px",
            color: basicColors.third,
            fontSize: "17px",
            borderRadius: "5px",
            WebkitTransition: "all 0.3s ease-in-out",
            OTransition: "all 0.3s ease-in-out",
            transition: "all 0.3s ease-in-out",
        },
        retro: {
            background: retroColors.first,
            width: "50px",
            color: retroColors.fifth,
            fontSize: "17px",
            borderRadius: "0px",
            WebkitTransition: "all 0.3s ease-in-out",
            OTransition: "all 0.3s ease-in-out",
            transition: "all 0.3s ease-in-out",

        },
        electric: {
            background: electricColors.first,
            width: "50px",
            color: electricColors.fifth,
            fontSize: "17px",
            borderRadius: "0px",
            WebkitTransition: "all 0.3s ease-in-out",
            OTransition: "all 0.3s ease-in-out",
            transition: "all 0.3s ease-in-out",

        }
    },

    navWrapperCircle: {
        default: {
            color: basicColors.first,
            border: "2px solid",
            padding: "3px 4px",
            backgroundColor: basicColors.third,
            borderRadius: "50%",
            marginBottom: "10px",
            cursor: "pointer",
        },
        retro: {
            color: retroColors.first,
            border: "2px solid",
            padding: "3px 4px",
            backgroundColor: retroColors.fifth,
            borderRadius: "50%",
            marginBottom: "10px",
            cursor: "pointer",
        },

        electric: {
            color: electricColors.first,
            border: "2px solid",
            padding: "3px 4px",
            backgroundColor: electricColors.fifth,
            borderRadius: "50%",
            marginBottom: "10px",
            cursor: "pointer",
        }
    }
}
