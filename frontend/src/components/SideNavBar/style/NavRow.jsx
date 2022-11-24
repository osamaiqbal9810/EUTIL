import { basicColors, retroColors } from "style/basic/basicColors";

export const NavrowStyle = {
  navWrapper: {
    default: {
      color: basicColors.fourth,
      ":hover": {
        background: basicColors.fourth,
        color: basicColors.first,
        //fontWeight: "bold",
      },
    },
    retro: {
      color: retroColors.second,
      ":hover": {
        background: retroColors.first,
        color: retroColors.second,
      },
    },
  },

  navElement: {
    default: {
      color: "inherit",
      fontSize: "14px",
      height: "40px",
      display: "flex",
      textDecoration: "none",
      padding: "8px 12px",
      cursor: "pointer",
      marginBottom: "1px",
    },
    retro: { color: retroColors.second },
  },
  navActive: {
    default: { background: basicColors.fourth, color: basicColors.first },
    retro: { color: retroColors.second, background: retroColors.first },
  },
  navIconSize: {
    default: { size: 20 },
    retro: { size: 25 },
  },
};

//export const
