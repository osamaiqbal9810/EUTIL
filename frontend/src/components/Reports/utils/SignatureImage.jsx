import React from "react";
import { getServerEndpoint } from "../../../utils/serverEndpoint";

let path = "http://" + getServerEndpoint() + "applicationresources" + "/";
export const SignatureImage = (props) => {
  return (
    <React.Fragment>
      {props.signatureImage && (
        <div className="signature-image">
          <img src={path + props.signatureImage} alt="" />
        </div>
      )}
    </React.Fragment>
  );
};
