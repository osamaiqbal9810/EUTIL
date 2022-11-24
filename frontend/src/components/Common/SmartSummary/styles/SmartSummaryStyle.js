import { themeService } from "../../../../theme/service/activeTheme.service";
import { retroColors } from "../../../../style/basic/basicColors";

export const smartSummaryStyle = {
  cardContainer: {
    // width: "175px",
    // marginRight: "15px",
    padding: '0px 15px 0px 0px',
    // display: "inline-block",
    cursor: "pointer"
  },
  allCardSummaryContainer: {
    padding: '0px 30px'
  }

}
export const iconShowHideStyle = themeService({
  default: {
    display: "inline-block",
    verticalAlign: "middle",
    color: "rgb(64, 118, 179)",
    cursor: "pointer",
    //visibility: this.props.summaryShowHide ? "visible" : "hidden",
    position: "absolute",
    right: "18px",
    zIndex: "10",
    background: "none",
    border: "none",
    outline: "none",
  }, retro: {
    display: "inline-block",
    verticalAlign: "middle",
    color: retroColors.second,
    cursor: "pointer",
    //visibility: this.props.summaryShowHide ? "visible" : "hidden",
    position: "absolute",
    right: "18px",
    zIndex: "10",
    background: "none",
    border: "none",
    outline: "none",
  }
});
export const summeryStyle = props => ({
  marginTop: props.summaryShowHide ? "3px" : "-300px",
  transition: "all 1s ease-in-out",
});
