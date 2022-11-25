import React from 'react';
import { getServerEndpoint } from '../../../utils/serverEndpoint';

let path = getServerEndpoint() + 'applicationresources' + '/';
export const SignatureImage = (props) => {
  let containerStyle = props.placement === 'tableCell' ? 'cell-signature-image' : 'signature-image';
  return (
    <React.Fragment>
      {props.signatureImage && (
        <div className={containerStyle}>
          <img src={path + props.signatureImage} alt="" />
          {<div style={{ textAlign: 'center' }}>{props.userName}</div>}
        </div>
      )}
    </React.Fragment>
  );
};
