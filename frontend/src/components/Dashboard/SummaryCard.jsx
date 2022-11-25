import React from "react";
import { Col, Card, CardText, CardBody } from "reactstrap";
import PropTypes from "prop-types";

export const CardTypeOne = (props) => {
  const { topRightStyle } = props;
  const { centerNumberStyle } = props;
  return (
    <Col md="12" style={{ padding: "0px", marginBottom: "10px", boxShadow: "3px 3px 5px #cfcfcf", minWidth: "145px" }}>
      <Card>
        <CardBody style={{ padding: "15px 15px 0px 0px" }}>
          <div style={{ ...topRightStyle, color: props.numberColor }}>{props.topRight}</div>
          <div style={{ ...centerNumberStyle, color: props.numberColor }}>{props.number}</div>
        </CardBody>

        <CardBody style={{ padding: "0px 0px 15px 15px" }}>
          <CardText style={props.textStyle}>{props.text}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
};

CardTypeOne.propTypes = {
  topRightStyle: PropTypes.object,
  centerNumberStyle: PropTypes.object,
  textStyle: PropTypes.object,
  number: PropTypes.string,
  topRight: PropTypes.string,
  text: PropTypes.string,
  numberColor: PropTypes.string,
};

CardTypeOne.defaultProps = {
  topRightStyle: {
    float: "right",
    fontSamily: "Arial",
    fontSize: "16px",
    letterSpacing: "0.45px",
  },
  centerNumberStyle: {
    fontFamily: "Arial",
    fontSize: "40px",
    float: "left",
    letterSpacing: "1.25px",
    textAlign: "left",
    paddingLeft: "15px",
  },
  textStyle: {
    fontSamily: "Arial",
    fontSize: "12px",
    color: "var(--first)",
    letterSpacing: "1.25px",
    float: "left",
    marginTop: "-5px",
  },
  numberColor: "var(--first)",
};
