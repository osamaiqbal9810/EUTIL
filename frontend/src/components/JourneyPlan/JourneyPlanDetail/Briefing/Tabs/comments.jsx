/* eslint eqeqeq: 0 */
import React from "react";
import { Col, Row } from "reactstrap";
import { getServerEndpoint } from "utils/serverEndpoint";
import {languageService} from "../../../../../Language/language.service";
const CommentsTab = ({ comment }) => {
  let imgName = comment.signature ? comment.signature.imgName : "";
  let src = imgName ? getServerEndpoint() + "applicationresources/" + imgName : "";
  return (
    <div className="defect-code">
      <Row>
        <Col md={6}>
          <div className="comments-wrapper">
            <label>{comment.reviewComments}</label>
          </div>
        </Col>

        <Col md={6}>
          <div className="dispaly-area">
            <span className="signarure-caption">{languageService('Signature')}</span>
              {imgName && (
                  <img src={src} alt={languageService("Image display area")} />
              )}

          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CommentsTab;
