export const iconShowHideStyle = {
  display: "inline-block",
  verticalAlign: "middle",
  color: "var(--first)",
  cursor: "pointer",
  //visibility: this.props.summaryShowHide ? "visible" : "hidden",
  position: "absolute",
  right: "18px",
  zIndex: "10",
  background: "none",
  border: "none",
  outline: "none",
};

export const summeryStyle = (props) => ({
  marginTop: props.summaryShowHide ? "0" : "-150px",
  transition: "all 1s ease-in-out",
});
