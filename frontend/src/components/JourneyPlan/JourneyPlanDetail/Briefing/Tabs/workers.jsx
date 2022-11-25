/* eslint eqeqeq: 0 */
import React from "react";
import { Col, Row } from "reactstrap";
import { getServerEndpoint } from "utils/serverEndpoint";
import { phone } from "react-icons-kit/icomoon/phone";
import { Icon } from "react-icons-kit";
import {languageService} from "../../../../../Language/language.service";
const WorkersTab = ({ workers, handleUpdateState, onHoverImage }) => {
  const handleOnHover = image => {
    console.log(image, "here");
    handleUpdateState({ onHoverImage: image });
  };

  let workersComp = null;
  if (workers) {
    workersComp = workers.map((worker, index) => {
      let imgName = worker.signature ? worker.signature.imgName : "";
      let byPhone = worker.byPhone;
      let src = imgName ? getServerEndpoint() + "applicationresources/" + imgName : "";
      return (
        <div key={index} className="signature-wrapper">
          <div className="media">
            {imgName && <img onMouseEnter={() => handleOnHover(imgName)} onMouseLeave={() => handleOnHover("")} src={src} alt="image" />}
            {byPhone && <Icon size={24} style={{ marginLeft: "30px" }} icon={phone} />}
          </div>
          <div className="text">
            <label>{worker.name} &nbsp;</label>
            <span>{worker.accNumber ? `(${worker.accNumber})` : ''}</span>
          </div>
        </div>
      );
    });
  }
  return (
    <div className="defect-code">
      <Row>
        <Col md={6}>{workersComp}</Col>

        <Col md={6}>
          <div className="dispaly-area">
            <span className="signarure-caption">{languageService('Signature')}</span>
            {onHoverImage && (
              <img src={getServerEndpoint() + "applicationresources/" + onHoverImage} alt={languageService("Image display area")} />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default WorkersTab;
