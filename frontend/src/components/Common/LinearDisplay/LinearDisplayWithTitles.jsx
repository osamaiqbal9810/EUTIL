import React from "react";
import CoordinateTransformer from "./CoordinateTransformer";
import { Tooltip } from "reactstrap";
import { Table } from "reactstrap";
{
  /*           <td>Date</td>
          <td>{props.text}</td>
          <td>Start</td>
          <td>{props.start}</td>
          <td>End</td>
          <td>{props.end}</td>
 */
}

const PropertySheet = props => {
  let st1 = { marginLeft: "10px", marginRight: "10px" };
  return (
    <div>
      <div style={st1}>{props.tooltip}</div>
      <div style={st1}>No: {props.text}</div>
      <div style={st1}>From: {props.start}</div>
      <div style={st1}>To: {props.end}</div>
    </div>
  );
};
class LinearDisplayWithTitles extends React.Component {
  constructor(props) {
    // sampel data = [{start:10, end:20, text:'abc'}, {start:21, end:40, text:'abc'}, {start:41, end:60, text:'abc'}]
    super(props);
    //let data = [{start:10, end:20, text:'abc1'}, {start:20, end:40, text:'abc2'}, {start:40, end:60, text:'abc3'}];
    this.state = {
      canvasWidth: props.width,
      canvasHeight: props.height,
      //range: { min: min, max: max },
      titles: props.titles ? props.titles : [],
      displayTitle: props.titles ? true : false,
      data: props.data,
      color: props.color ? props.color : "black",
      textcolor: props.textcolor ? props.textcolor : "black",
      cursorType: "auto",
      hoverId: "",
      tooltipText: "",
    };    
    
    this.Initialize(props);
   // this.performValidationTests();

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  performValidationTests()
  {
    for(let i=this.cTrans.x1; i<this.cTrans.x2; i+=0.1)
    {
      let px=this.cTrans.toPhysicalx(i);

      console.log(i, 'To Physical', px, ' revx', this.cTrans.toLogicalX(px));
    }
  }
  Initialize(props)
  {
    let { min, max } = this.calculateRange(props.data);

    if (this.props.logicalWidth) max = min + this.props.logicalWidth;

    if (this.props.logicalWorld) {
      min = this.props.logicalWorld.min;
      max = this.props.logicalWorld.max;
    }

    this.padding = { left: 0, right: 0, top: 0, bottom: 0 };
    if (props.padding) {
      this.padding = props.padding;
    }

    this.font = "12px Times Roman";
    if (props.font) this.font = props.font;

    this.fill = false;

    this.y1 = 0; //10;
    this.yH = props.vertical ? props.vertical : props.height; //-25;//30;

    this.cTrans = new CoordinateTransformer(
      { x1: 0, y1: 0, x2: this.state.canvasWidth, y2: this.state.canvasHeight },
      { x1: min, y1: 0, x2: max, y2: props.height },
    );
    
    if(!this.state.range) this.state.range={min: min, max: max};

    if (this.state.displayTitle) {
     let titleWidth = 0;
     if(this.props.titles && this.props.titles.length)   
     {
         for(let title of this.props.titles) titleWidth += title.titleWidth;
     }
     else
     titleWidth = 180;
      //let titleWidth = this.props.titleWidth ? this.props.titleWidth : 180;
      this.padding.left += this.cTrans.toLogicalX(titleWidth) - min;
      this.recalculateTransform();
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    //if(prevState.someValue !== nextProps.someValue){} else return null;
    return { canvasHeight: nextProps.height, canvasWidth: nextProps.width };
  }
  // componentWillReceiveProps(nextProps)
  // {
  //     if(nextProps.data)
  //     {
  //         this.processData(nextProps.data);
  //     }
  // }
  componentDidUpdate(prevProps, prevState) {
    //console.log(this.props.data[0].text);
    if(prevProps.data.length != this.props.data.length)
    {
      this.setState({data: this.props.data});
      if(this.props.displayType !== "scale")
      {
        this.drawLinearVar();
      }
    }
  }
  componentDidMount() {
    if (this.props.displayType === "scale") {
      this.drawScale();
    } else {
      this.drawLinearVar();
    }
  }
  calculateRange(data) {
    let min = 100000,
      max = -100000;
    for (let d of data) {
      if (d.start < min) min = d.start;
      if (d.end > max) max = d.end;
    }
    return { min: min, max: max };
  }
  processData(data) {
    if (data.length && data.length > 0) {
      let { min, max } = this.calculateRange(data);
      if (this.props.logicalWidth) max = min + this.props.logicalWidth;

      this.setState({ range: { min: min, max: max } });
    }
  }
  recalculateTransform() {
    this.cTrans.setRects(
      { x1: 0, y1: 0, x2: this.state.canvasWidth, y2: this.state.canvasHeight },
      {
        x1: this.state.range.min - this.padding.left,
        y1: 0 - this.padding.top,
        x2: this.state.range.max + this.padding.right,
        y2: this.props.height + this.padding.bottom,
      },
    );
  }
  drawRect(x, y, w, h, text, ctx, colors = { textColor: "black", strokeColor: "black", fillColor: "red" }, fill = false, rectStyle=null) {
    
    if (fill) {
      ctx.fillStyle = colors.fillColor;
      ctx.fillRect(x, y, w, h);
    } 
    else 
    {
      ctx.strokeStyle = colors.strokeColor;
      ctx.lineWidth = 1.5;
      if(rectStyle)
      {
          if(rectStyle.includes('U') && rectStyle.includes('D') && rectStyle.includes('L') && rectStyle.includes('R'))
          {
            ctx.strokeRect(x, y, w, h);
          }
          else {
          if(rectStyle.includes('U'))
          {
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x+w, y);
            ctx.stroke();
          }
          if(rectStyle.includes('D'))
          {
            ctx.beginPath();
            ctx.moveTo(x,y+h);
            ctx.lineTo(x+w, y+h);
            ctx.stroke();
          }
          if(rectStyle.includes('L'))
          {
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x, y+h);
            ctx.stroke();
          }
          if(rectStyle.includes('R'))
          {
            ctx.beginPath();
            ctx.moveTo(x+w,y);
            ctx.lineTo(x+w, y+h);
            ctx.stroke();
          }
        }
      }
      else
      ctx.strokeRect(x, y, w, h);
    }

    if(!rectStyle || rectStyle.includes('T'))
    {
      if (ctx.measureText(text).width + 2 < Math.ceil(w)) {
        ctx.fillStyle = colors.textColor;

        ctx.fillText(text, x + 2, y + h / 1.5);
      }
    }

  }

  drawLinearVar() {
    //let strokeColors=['#ecfcff','#b2fcff'], fillColors=['#5edfff','#3e64ff'];
    const ctx = this.refs.canvas.getContext("2d");
    ctx.font = this.font;

    if (this.props.background) {
      ctx.fillStyle = this.props.background;
      ctx.fillRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }
    if (this.props.outline) {
      ctx.strokeStyle = this.props.outline;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }
    //ctx.fillStyle = fillColors[0];//'red';
    ctx.strokeStyle = this.state.color; //'black';

    if (this.state.displayTitle && this.props.titles && this.props.titles.length) {
        let start = this.state.range.min - this.padding.left;
        let index=0;
      for(let title of this.props.titles) 
      {
        //this.cTrans.trace = true;
        let width=this.cTrans.toLogicalX(title.titleWidth); 

        if(++index==this.props.titles.length)
         width = this.cTrans.toLogicalX(this.cTrans.toPhysicalx(this.state.range.min) - this.cTrans.toPhysicalx(start));

        //console.log('rect: x,y,w,h');
        this.drawRect(
            this.cTrans.toPhysicalx(start),
            this.cTrans.toPhysicaly(this.y1),
            this.cTrans.toPhysicalx( width ),
            this.cTrans.toPhysicaly(this.yH),
            title.titleText,
            ctx,
            {textColor: this.state.textcolor, strokeColor: this.state.color },
            false,
            title.titleStyle ? title.titleStyle : null
        );
        start += (width-(this.state.range.min-this.padding.left));
        //console.log(' ');
        //this.cTrans.trace = false;
      }
    }

    if (this.props.gridLines) {
      ctx.strokeStyle = "grey";
      ctx.lineWidth = 0.5;

      ctx.beginPath();
//      this.cTrans.trace = true;
//    console.log('start x:');
      let x = this.cTrans.toPhysicalx(this.state.range.min);
//      this.cTrans.trace = false;
      let y = this.cTrans.toPhysicaly(this.yH);
      let x2 = this.cTrans.toPhysicalx(this.state.range.max);
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y);
      //this.cTrans.lineFromTo(ctx, this.state.range.min, this.yH, this.state.range.max, this.yH);

      let i = this.state.range.min;
      for (; i < this.state.range.max; i += 0.1) {
        let x = this.cTrans.toPhysicalx(i);
        let y = this.cTrans.toLogicalY(this.yH);

        ctx.moveTo(x, y);
        ctx.lineTo(x, y - this.yH);
        //this.cTrans.lineFromTo(ctx, i, this.yH, i, 0);
      }
      ctx.stroke();
    }

    if (this.state.data && this.state.data.length && this.state.data.length > 0) {
      for (let d of this.state.data) {
        let end=d.end;
        if(this.props.minWidth && d.end-d.start < this.props.minWidth)
        {
          end = d.start+this.props.minWidth;
        }
        let x = this.cTrans.toPhysicalx(d.start),
          w = this.cTrans.toPhysicalx(end) - x,
          y = this.cTrans.toPhysicaly(this.y1),
          h = this.cTrans.toPhysicaly(this.yH);
        let textcolor = this.state.textcolor;
        let fillColor = this.state.textcolor;

        if (d.fill !== undefined && d.fill === true) textcolor = this.props.background ? this.props.background : "white";
        this.drawRect(
          x,
          y,
          w,
          h,
          d.text,
          ctx,
          { textColor: textcolor, strokeColor: this.state.color, fillColor: fillColor },
          d.fill !== undefined ? d.fill : false,
        );
        //this.drawRect(x, y, w, h, d.text, ctx, { textColor: textcolor, strokeColor: this.state.color, fillColor: fillColor }, d.fill !== undefined ? d.fill : false);
      }
    }
  }
  drawScale() {
    const ctx = this.refs.canvas.getContext("2d");
    ctx.font = this.font;

    if (this.props.background) {
      ctx.fillStyle = this.props.background;
      ctx.fillRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }

    ctx.strokeStyle = this.state.color; //'black';
    ctx.lineWidth = 1.5;

    // if(this.state.displayTitle)
    // {
    //     // let titleWidth = this.props.titleWidth ?  this.props.titleWidth : ctx.measureText(this.state.title).width * 2;
    //     // this.padding.left += this.cTrans.toLogicalX(titleWidth);
    //     //this.recalculateTransform();
    //     // this.drawRect(this.cTrans.toPhysicalx(this.state.range.min-this.padding.left), this.cTrans.toPhysicaly(this.y1),
    //     //     this.cTrans.toPhysicalx(this.state.range.min), this.cTrans.toPhysicaly(this.yH), this.state.title, ctx,{textColor:this.state.textcolor, strokeColor:this.props.background});
    // }

    if (this.state.data && this.state.data.length && this.state.data.length > 0) {
      ctx.beginPath();
      for (let d of this.state.data) {
        let x = this.cTrans.toPhysicalx(d.start),
          w = this.cTrans.toPhysicalx(d.end) - x,
          y = this.cTrans.toPhysicaly(this.y1),
          h = this.cTrans.toPhysicaly(this.yH);

        //this.drawRect(x, y, w, h, d.text, ctx,{textColor:this.state.textcolor, strokeColor:this.state.color});
        //ctx.beginPath();
        //ctx.moveTo(x,y);

        let hh = d.start - Math.trunc(d.start);

        hh = hh === 0 ? this.yH : hh === 0.5 ? this.yH / 2 : this.yH / 4;
        //let xx=this.toPhysicalx(d.start);
        ctx.lineTo(x, y + this.yH);
        ctx.lineTo(x, y + this.yH - hh);
        //ctx.lineTo(x,y);
        ctx.lineTo(x, y + this.yH);

        //ctx.lineTo(x,y);

        if (hh === this.yH) {
          ctx.fillText(d.text, x + 1, y + 9);
        }
      }
      ctx.stroke();
    }
  }
  getDataItem(id)
  {
    let item = this.props.data.find(d=>{return id===d.id});
    
    return item ? item : {};
  }
  render() {
    return (
      <div>
        {/* style={{display: 'flex'}}> */}
        <Tooltip placement="auto" isOpen={this.state.hoverId != ""} target={"canvas" + this.props.data[0].id} key={"tooltip" + this.props.data[0].id}>
          <PropertySheet {...this.getDataItem(this.state.hoverId)}></PropertySheet>
          {/*           {this.state.tooltipText}
          <br />
          date: {this.props.data[0].text}
          <br />
          start:<div>{this.props.data[0].start}</div>
          <br />
          end:{this.props.data[0].end}
          <br />
 */}{" "}
        </Tooltip>
        <canvas
          id={"canvas" + this.props.data[0].id}
          key={"canvas" + this.props.data[0].id}
          ref="canvas"
          style={{ display: "block", cursor: this.state.cursorType }}
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
        />
      </div>
    );
  }
  onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    //console.log(this);

    let lx = this.cTrans.toLogicalX(offsetX); //, ly=this.cTrans.toLogicalY(offsetY);
    //console.log('down at:', {offsetX, offsetY});
    if (this.props.displayType !== "scale" && this.props.enableSelection) {
      for (let d of this.state.data) {
        // // let x = this.cTrans.toPhysicalx(d.start), w = this.cTrans.toPhysicalx(d.end) - x,
        // // y = this.cTrans.toPhysicaly(this.y1), h = this.cTrans.toPhysicaly(this.yH);
        // // this.drawRect(x, y, w, h, d.text, ctx,{textColor:this.state.textcolor, strokeColor:this.state.color});
        if (d.start <= lx && d.end >= lx) {
          //this.fill = !this.fill;
          if (d.fill !== undefined && d.fill === true) d.fill = false;
          else d.fill = true;
        }
      }

      this.drawLinearVar();
    }
    if (this.props.onClick) {
      for (let d of this.state.data) {
        let end=d.end;
        if(this.props.minWidth && d.end-d.start<this.props.minWidth)
          end=d.start+this.props.minWidth;

        if (d.start <= lx && end >= lx) {
          this.props.onClick(d.id ? d.id : d.text);
        }
      }
      if (this.props.allowTitleClick) {
        let txstart = this.state.range.min - this.padding.left,
          txend = this.state.range.min;
        if (txstart <= lx && txend >= lx) {
          this.props.onClick(this.state.title, "title");
        }
      }
    }
    //let objs=this.lmap.getRenderObjects(this.lmap.mapBounds);

    // for(const obj of objs)
    // {
    //     if(obj.getBounds().contains({x:lx, y:ly}))
    //     {
    //         if(this.props.onMouseDown)
    //         {
    //             this.props.onMouseDown({id: obj.options.id});
    //         }
    //         obj.options.fill = !obj.options.fill;

    //         //console.log('clicked on:', obj.options.id);
    //         this.drawMap();
    //     }
    // }

    //console.log('down', {offsetX, offsetY});
  }
  onMouseMove({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    let lx = this.cTrans.toLogicalX(offsetX); //, ly=this.cTrans.toLogicalY(offsetY);
    let found = false;
    //console.log('down at:', {offsetX, offsetY});
    if (this.props.displayType !== "scale" && this.props.onClick) {
      // check if click handler exist
      for (let d of this.state.data) {
        
        let end=d.end;
        if(this.props.minWidth && d.end-d.start<this.props.minWidth)
          end=d.start+this.props.minWidth;

        if (d.start <= lx && end >= lx) {
          // //this.fill = !this.fill;
          // if(d.fill !== undefined && d.fill===true) d.fill=false;
          // else d.fill=true;
          this.setState({ cursorType: "pointer", hoverId: d.id, tooltipText: d.tooltip });

          found = true;
        }
      }

      if (this.props.allowTitleClick) {
        let txstart = this.state.range.min - this.padding.left,
          txend = this.state.range.min;
        if (txstart <= lx && txend >= lx) {
          this.setState({ cursorType: "pointer" });
          found = true;
        }
      }

      if (!found && this.state.cursorType != "auto") {
        this.setState({ cursorType: "auto", hoverId: "", tooltipText: "" });
      }

      this.drawLinearVar();
    }
  }
  onMouseLeave({ ne }) {
    this.setState({ cursorType: "auto", hoverId: "", tooltipText: "" });
  }
}
export default LinearDisplayWithTitles;
