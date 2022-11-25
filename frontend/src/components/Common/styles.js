import { basicColors, retroColors, electricColors } from "../../style/basic/basicColors";

export const fontStyleHeadings2 = {
  default: {
    float: "left",
    fontFamily: "Arial",
    fontSize: "18px",
    letterSpacing: "0.95px",
    color: basicColors.first,
  },
  retro: {
    letterSpacing: "0.95px",
    color: retroColors.second,
    fontSize: "18px",
    fontWeight: 600,
  },
  electric: {
    letterSpacing: "0.95px",
    color: electricColors.second,
    fontSize: "18px",
    fontWeight: 600,
  },
};

export const ModalStyles = {
  modalTitleStyle: {
    default: {
      color: basicColors.first,
      border: "0px",
    },
    retro: { color: retroColors.firsts, fontWeight: 600, fontSize: "18px" },
    electric: { color: electricColors.firsts, fontWeight: 600, fontSize: "18px" },
  },
  footerButtonsContainer: {
    border: "0px",
  },
  modalBodyColor: {
    color: "var(--first)",
    fontSize: "12px",
  },
};

export const SummaryStyle = {
  cardContainer: {
    // width: "175px",
    // marginRight: "15px",
    padding: "0px 15px 0px 0px",
    // display: "inline-block",
  },
  allCardSummaryContainer: {
    padding: "0px 30px",
  },
};

export const CommonSummaryStyles = {
  CommonSummaryStylesHeadingContainer: {
    padding: "30px 0px 30px 15px",
  },
  CommonSummaryStylesHeadingStyle: fontStyleHeadings2,
};
