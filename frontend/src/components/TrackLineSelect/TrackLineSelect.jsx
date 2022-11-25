import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Group, Rect, Text, Circle, Line, Image, Tag, Label } from "react-konva";
import PropTypes from "prop-types";
import { getServerEndpoint } from "utils/serverEndpoint";
import { LINE_OBJ_TEMPLATE } from "../Line/Add/variables";
var _ = require("lodash");
/* Sample Data */
const objLines = {
  lines: [
    {
      objectId: "OrangeLine",
      tooltipText: "Orange Line Tooltip text",
      object: {
        stroke: "orange",
        strokeWidth: 5,
        tension: 0.1,
        points: [
          { x: 474, y: 271 },
          { x: 474, y: 296 },
          { x: 475, y: 344 },
          { x: 475, y: 384 },
          { x: 473, y: 443 },
          { x: 474, y: 487 },
          { x: 473, y: 517 },
          { x: 475, y: 563 },
          { x: 475, y: 583 },
        ],
      },
    },

    {
      objectId: "BlueLine",
      tooltipText: "Blue Line Tooltip text",
      object: {
        stroke: "blue",
        strokeWidth: 5,
        tension: 0.1,
        points: [
          { x: 207, y: 460 },
          { x: 261, y: 459 },
          { x: 326, y: 459 },
          { x: 407, y: 459 },
          { x: 469, y: 460 },
          { x: 538, y: 459 },
          { x: 558, y: 458 },
          { x: 561, y: 424 },
          { x: 562, y: 357 },
          { x: 609, y: 313 },
          { x: 609, y: 283 },
        ],
      },
    },
    {
      objectId: "PurpleLine",
      tooltipText: "Purple Line Tooltip text",
      object: {
        stroke: "purple",
        strokeWidth: 5,
        tension: 0.1,
        points: [{ x: 206, y: 457 }, { x: 182, y: 432 }, { x: 127, y: 375 }, { x: 127, y: 365 }, { x: 200, y: 286 }, { x: 234, y: 250 }],
      },
    },
  ],
};

class TrackLineSelect extends Component {
  constructor(props) {
    super(props);
    const blurs = {};
    const tooltips = {};
    const opacity = {};
    this.props.lines.lines.map(item => {
      blurs[item.objectId] = 1;
    });

    this.props.lines.lines.map(item => {
      opacity[item.objectId] = this.props.isEditMode ? 1 : 0.2;
    });

    this.props.lines.lines.map(item => {
      tooltips[item.objectId] = item.tooltipText || item.objectId;
    });

    this.tooltips = tooltips;
    this.state = {
      angle: 0,
      image: new window.Image(),
      lines: props.lines,
      blurs: blurs,
      opacity: opacity,
      stageScale: 1,
      stageWidth: 0,
      stageX: 0,
      stageY: 0,
      imageX: 0,
      imageY: 0,
      selectedLineId: "",
      tooltipVisible: false,
      tooltipText: "",
      isDragging: false,
    };
  }
  static defaultProps = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.lines !== prevState.lines) {
      return {
        lines: nextProps.lines,
      };
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.state.image.setAttribute("crossOrigin", "anonymous");
    this.state.image.src = getServerEndpoint() + "applicationresources/" + this.props.backgroundImage;
    //  console.log(this.state.image.src)

    this.state.image.onload = () => {
      // updating the layer manually
      this.imageNode && this.imageNode.getLayer().batchDraw();
    };
  }
  handleWheel = e => {
    e.evt.preventDefault();
    const scaleBy = 1.01;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });
    this.setState({
      stageScale: newScale,
      stageX: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      stageY: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  handleClick = e => {
    /*         const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
 */
  };
  handleLineClick = e => {
    this.setState({
      selectedLineId: e.target.id(),
    });
    // console.log(e.target)
    //this.props.onClick(e.target.id())
    if (this.props.onClick) {
      this.props.onClick(e.target.attrs.line);
    }
  };
  handleLineBlur = e => {
    const blurs = Object.assign({}, this.state.blurs);
    const opacity = Object.assign({}, this.state.opacity);
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    var tooltipVisible = false;
    var tooltipText = this.state.tooltipText;
    blurs[e.target.id()] = e.type === "mouseenter" || e.type === "mouseover" ||  e.type === 'touchstart' ? 10 : 1;
    opacity[e.target.id()] = e.type === "mouseenter" || e.type === "mouseover" ||  e.type === 'touchstart' ? 1 : this.props.isEditMode ? 1 : 0.2;

    if (this.type === "mouseout") {
    } else if (e.type === "mouseenter" || e.type === "mouseover" ||  e.type === 'touchstart') {
      const tooltips = this.tooltips;

      tooltipVisible = true;
      tooltipText = tooltips[e.target.id()];
      this.tooltipLabelNode.position({
        x: pos.x + 5,
        y: pos.y + 5,
      });
    }

    this.setState({
      blurs: blurs,
      opacity: opacity,
      tooltipVisible: tooltipVisible,
      tooltipText: tooltipText,
    });
  };

  handleLineMouseMove = e => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const x = pos.x - (pos.x - pos.x / stage.scaleX()) - stage.x() / stage.scaleX() + 5; //-(this.state.imageX/stage.scaleX())+5;
    const y = pos.y - (pos.y - pos.y / stage.scaleY()) - stage.y() / stage.scaleY() + 5;
    //console.log(stage.scaleX());
    //console.log(pos);
    this.tooltipLabelNode.position({
      x: x,
      y: y,
    });
    // console.log('x: ' + pos.x + ',' + x + ',' + stage.x() + ' Sx:' + stage.scaleX() + ' imgX:' + this.state.imageX)
    this.setState({ tooltipVisible: true });
    this.tooltipLayer.batchDraw();
  };
  handleImageDragStart = e => {
    this.setState({
      isDragging: true,
    });
  };
  handleImageDragEnd = e => {
    this.setState({
      imageX: e.target.x(),
      imageY: e.target.y(),
      isDragging: false,
    });
  };
  handleCircleDragEnd = e => {
    const linesData = this.state.lines;
    const lines = this.state.lines.lines;

    const index = _.findIndex(lines, { objectId: this.state.selectedLineId });
    var copy = _.map(lines[index].object.points, _.clone);
    copy.splice(e.target.index - 1, 1, { x: e.target.x() - this.state.imageX, y: e.target.y() - this.state.imageY });
    lines[index].object.points = copy;
    this.setState({
      lines: linesData,
    });
  };

  handleDrawLine = e => {
    if (this.props.isEditMode && this.props.isAddMode) {
      this.props.handleDrawLine(e);
    }
  };

  render() {
    //  console.log('TrackLine')
    const lines = this.state.lines.lines;
    const linePoints = [];
    const blnEditMode = false || (this.props.isEditMode && this.props.isEditMode);
    const index = _.findIndex(lines, { objectId: this.state.selectedLineId });
    var pointsText = "";
    if (index > -1) {
      pointsText = JSON.stringify(lines[index].object.points);
      lines[index].object.points.map(item => {
        linePoints.push(item.x);
        linePoints.push(item.y);
      });
    }
    const textView = (
      <div style={{ visibility: this.props.isEditMode ? "visible" : "hidden" }}>
        <div style={{ width: this.props.width }}>
          <h3 style={{ textAlign: "center" }}>Selected Line [{this.state.selectedLineId}]</h3>
          <textarea visible={this.props.isEditMode} value={pointsText} style={{ width: this.props.width, height: "80px" }} />
        </div>
      </div>
    );

    return (
      <div style={{ textAlign: "left" }}>
        {this.props.isEditMode && textView}
        <div ref={stageContainer => (this.stageContainer = stageContainer)}>
          <Stage
            width={this.props.width}
            height={this.props.height}
            onWheel={this.handleWheel}
            onClick={this.handleClick}
            scaleX={this.state.stageScale}
            scaleY={this.state.stageScale}
            x={this.state.stageX}
            y={this.state.stageY}
          >
            <Layer onMouseUp={this.handleDrawLine}>
              <Image
                draggable
                x={this.state.imageX}
                y={this.state.imageY}
                image={this.state.image}
                ref={node => {
                  this.imageNode = node;
                }}
                rotation={this.state.angle}
                onDragStart={this.handleImageDragStart}
                onDragEnd={this.handleImageDragEnd}
              />
            </Layer>
            <Layer visible={!this.state.isDragging}>
              {lines.map((item, i) => {
                const lineData = [];
                const circles = [];
                const opacity = this.state.opacity[item.objectId] || 0.2;

                item.object.points.map((p, i) => {
                  lineData.push(p.x);
                  lineData.push(p.y);
                  if (this.state.selectedLineId === item.objectId && blnEditMode) {
                    circles.push(
                      <Circle
                        key={i}
                        draggable
                        x={p.x + this.state.imageX}
                        y={p.y + this.state.imageY}
                        radius={4}
                        fill={"black"}
                        // onDragEnd={this.handleCircleDragEnd}
                        onMouseUp={this.handleCircleDragEnd}
                      />,
                    );
                  }
                });

                return (
                  <Group key={item.objectId}>
                    <Line
                      id={item.objectId}
                      x={this.state.imageX}
                      y={this.state.imageY}
                      key={item.objectId}
                      line={item.lineObj}
                      stroke={item.object.stroke}
                      strokeWidth={item.object.strokeWidth}
                      tension={item.object.tension}
                      points={lineData}
                      //opacity= {this.state.opacity[item.objectId]}
                      opacity={opacity}
                      shadowBlur={this.state.blurs[item.objectId]}
                      onClick={this.handleLineClick}
                      onTouchEnd={this.handleLineClick}
                      onMouseEnter={this.handleLineBlur}
                      onTouchStart={this.handleLineBlur}
                      onMouseOver={this.handleLineBlur}
                      onMouseLeave={this.handleLineBlur}
                      onMouseMove={this.handleLineMouseMove}
                      tooltipText={item.tooltipText}
                    />
                    {circles}
                  </Group>
                );
              })}
              {}
            </Layer>
            <Layer
              name="tooltipLayer"
              ref={node => {
                this.tooltipLayer = node;
              }}
            >
              <Label
                ref={node => {
                  this.tooltipLabelNode = node;
                }}
                visible={this.state.tooltipVisible}
              >
                <Tag
                  fill={"white"}
                  pointerDirection={"up"}
                  pointerWidth={10}
                  pointerHeight={10}
                  lineJoin={"round"}
                  shadowColor={"black"}
                  shadowBlur={10}
                />
                <Text text={this.state.tooltipText} fontFamily="Calibri" fontSize={14} padding={5} textFill={"blue"} alpha={1} />
              </Label>
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}
TrackLineSelect.propTypes = {
  lines: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  isEditMode: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  backgroundImage: PropTypes.string,
};
TrackLineSelect.defaultProps = {
  width: 763,
  height: 784,
  isEditMode: false,
  backgroundImage: "septa.png",
  isAddMode: false,
};
export default TrackLineSelect;
