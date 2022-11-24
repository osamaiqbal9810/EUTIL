import React from "react";
import { Col, Card, CardImg, CardText, CardBody, CardLink, CardTitle, CardSubtitle, Badge } from "reactstrap";
import PropTypes from "prop-types";
import {languageService} from "../../Language/language.service";
//import cardBackground from '../../images/cardBackground.png'
export const CardTypeOne = props => {
  const { topRightStyle } = props;
  const { centerNumberStyle } = props;
  let backImage = require("../../images/" + "cardBackground" + ".png");
  return (
    <Col
      md="12"
      style={{
        padding: "0px",
        marginBottom: "10px",
        boxShadow: "3px 3px 5px #cfcfcf",
        ...props.styles,
      }}
    >
      <Card
        style={{
          backgroundColor: props.numberColor,
          backgroundImage: "url(" + backImage + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "right",
        }}
      >
        <CardBody style={{ padding: "0px 15px 0px 0px" }}>
          {/*<CardTitle>1</CardTitle>*/}
          <div style={{ ...topRightStyle, color: "#fff" }}>{props.topRight}</div>
          <div style={{ ...centerNumberStyle, color: "#fff" }}>{props.number}</div>
        </CardBody>

        <CardBody style={{ padding: "0px 0px 8px 15px" }}>
          <CardText style={props.textStyle}>{languageService(props.text)}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
};
export const CardTypeTwo = props => {
  const { topRightStyle } = props;
  const { centerNumberStyle } = props;
  let backImage = require("../../images/" + "cardBackground" + ".png");
  return (
    <Col
      md="12"
      style={{
        padding: "0px",
        margin: "3px 0 5px 0",
        boxShadow: "3px 3px 5px #cfcfcf",
        overflowY: "auto",
      }}
      className="scrollbarHor"
    >
      <div style={{ minWidth: "152px" }}>
        <Badge
          style={{
            backgroundColor: props.numberColor,
          }}
        >
          <div style={{ ...centerNumberStyle, color: "#fff" }}>{props.number}</div>
        </Badge>

        <h6
          style={{
            padding: "0px 0px 0px 5px",
            color: props.numberColor,
            display: "inline-block",
            verticalAlign: "-webkit-baseline-middle",
          }}
        >
            {languageService(props.text)}
        </h6>
      </div>
    </Col>
  );
};

CardTypeOne.propTypes = {
  topRightStyle: PropTypes.object,
  centerNumberStyle: PropTypes.object,
  textStyle: PropTypes.object,
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  topRight: PropTypes.string,
  text: PropTypes.string,
  numberColor: PropTypes.string,
};

CardTypeOne.defaultProps = {
  topRightStyle: {
    float: "right",
    fontSamily: "Arial",
    fontSize: "18px",
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
    fontSize: "14px",
    color: "#fff",
    letterSpacing: "1.25px",
    float: "left",
    marginTop: "-5px",
  },
  numberColor: "#37668B",
};

export const CardTypeThree = props => {
  const { topRightStyle } = props;
  const { centerNumberStyle } = props;
  let backImage = require("../../images/" + "cardBackground" + ".png");
  return (
    <Col
      md="12"
      style={{
        padding: "0px",
        margin: "3px 0 5px 0",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          minWidth: "100%",
          border: "2px solid",
          borderLeft: "12px solid",
          borderColor: props.numberColor,
          textAlign: "left",
          fontSize: "18px",
          fontWeight: "bold",
          backgroundColor: "#fff",
        }}
      >
        <h6
          style={{
            padding: "0px 0px 0px 5px",
            color: "#1a1a1a",
            display: "inline-block",
            verticalAlign: "-webkit-baseline-middle",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {languageService(props.text)}
        </h6>
        <div style={{ ...centerNumberStyle, color: "#1a1a1a", padding: " 0px 0px 0px 15px" }}>{props.number}</div>
      </div>
    </Col>
  );
};
