import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
export const userAvtarStyle = {
    AvatarStyle: {
        default: {  //backgroundColor: "#FFFFFF",
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderStyle: 'Solid',
            //borderColor: "#A7A7A7",
            borderColor: 'rgba(167,167,167,1.00)',
            borderWidth: '1px',
            width: '100px',
            height: '100px',
            borderRadius: '100px',
            MozBorderRadius: '100px',
            WebkitBorderRadius: '100px',
            display: 'block',
            position: 'relative',
            marginLeft: '30px',
            marginTop: '30px',
            marginBottom: '30px'
        },
        retro: {  //backgroundColor: "#FFFFFF",
            fillColor: retroColors.first,
            border: 'none',
            //borderColor: "#A7A7A7",
            //borderColor: 'rgba(167,167,167,1.00)',
            //borderWidth: '0px',
            width: '100px',
            height: '100px',
            borderRadius: '5px',
            MozBorderRadius: '5px',
            WebkitBorderRadius: '5px',
            display: 'block',
            position: 'relative',
            marginLeft: '30px',
            marginTop: '30px',
            marginBottom: '30px'
        },
        electric: {  //backgroundColor: "#FFFFFF",
            fillColor: electricColors.first,
            border: 'none',
            //borderColor: "#A7A7A7",
            //borderColor: 'rgba(167,167,167,1.00)',
            //borderWidth: '0px',
            width: '100px',
            height: '100px',
            borderRadius: '5px',
            MozBorderRadius: '5px',
            WebkitBorderRadius: '5px',
            display: 'block',
            position: 'relative',
            marginLeft: '30px',
            marginTop: '30px',
            marginBottom: '30px'
        }
    },
    userAvatarAreaName: {
        default: {
            display: "block",
            width: "100%",
            fontSize: "20px",
            color: "#37668b",
        },
        retro: {
            color: retroColors.second,
            fontWeight: "bold"
        }
    },
    userTitleBarHeader: {
        default: {
            float: "left",
            lineHeight: "60px",
            paddingLeft: "20px",
            fontSize: "24px",
            letterSpacing: "0.6px",
        },
        retro: {
            float: "left",
            lineHeight: "60px",
            paddingLeft: "20px",
            fontSize: "24px",
            fontWeight: "bold",
            letterSpacing: "0.6px",
        }
    }
}