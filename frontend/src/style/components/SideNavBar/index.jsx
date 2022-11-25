import { getImageOf } from "theme/themeconfig";

let backImage = getImageOf("SideNavBar");

export const sideNav = {
  backgroundImage: "url(" + backImage + ")",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundColor: "#5e8d8f",
  color: "var(--fifth)",
  height: "100%",
  position: "fixed",
  textAlign: "left",
  top: "70px",
  fontFamily: "Arial",
  fontSize: "14px",
  letterSpacing: "0.35px",
  paddingTop: "30px",
  transition: "all .2s ease-in-out",
};

export const navElement = {
  color: "#ffffff",
  fontSize: "14px",
  height: "40px",
  display: "flex",
  textDecoration: "none",
  padding: "8px 12px",
  cursor: "pointer",
  marginBottom: "1px",
  ":hover": {
    background: "rgba(227, 233, 239,1)",
    color: "#37668B",
    fontWeight: "bold",
  },
};
export const navActive = { background: "#E3E9EF", color: "#37668B" };
