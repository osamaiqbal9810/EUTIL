import React from "react";
import { languageService } from "../../../../Language/language.service";
export const NoExceptionsFound = (props) => {
  let checkIssues = props.issuesData && props.issuesData.length > 0;
  let toRender = !checkIssues ? (
    <div
      style={{
        position: "absolute",
        top: "48%",
        bottom: "auto",
        left: "50%",
        right: "auto",
        width: "fit-content",
        height: "fit-content",
        padding: "20px",
        fontSize: "50px",
        fontWeight: 600,
        transform: "translate(-50%, -50%)",
        color: "#b3b0b0",
        textTransform: "capitalize",
      }}
    >
      {languageService("No Exceptions")}
    </div>
  ) : null;
  return toRender;
};
