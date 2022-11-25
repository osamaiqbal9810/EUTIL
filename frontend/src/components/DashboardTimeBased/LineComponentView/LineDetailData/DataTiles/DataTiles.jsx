import React, { Component } from "react";

class DataTiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tilesComp: null,
      totalHeight: 300,
    };
  }
  calculateTileValues() {
    let tileLogic = { tiles: null, tileLegend: null, totalHeight: this.state.totalHeight };

    if (this.props.tileFields && this.props.tileFields.length >= 3) {
      tileLogic.tileLegend = [];
      let c_tileFields = [...this.props.tileFields];
      let totalFieldValue = 0;
      c_tileFields.forEach((tile) => {
        // let legend = <TileLegendField label={tile.label} bgColor={tile.bgColor} />;
        // tileLogic.tileLegend.push(legend);
        totalFieldValue = totalFieldValue + parseInt(tile.value);
      });

      tileLogic.tiles = this.props.tileFields.map((tile) => {
        let height = this.state.totalHeight * (parseInt(tile.value) / totalFieldValue);
        let padding = "15px";
        if (height < 35) {
          padding = "0px 15px";
          height = 35;
          tileLogic.totalHeight = tileLogic.totalHeight + 35;
        }

        return (
          <div style={{ height: height + "px" }}>
            <Tile
              key={tile.id}
              bgColor={tile.bgColor}
              value={tile.value}
              width_percentage={parseInt(tile.value) / totalFieldValue}
              padding={padding}
            />
            <TileLegendField label={tile.label} bgColor={tile.bgColor} />
          </div>
        );
      });
    }
    return tileLogic;
  }

  componentDidMount() {
    this.calculateTileValues();
  }
  render() {
    let tileLogics = this.calculateTileValues();
    let tiles = tileLogics.tiles ? tileLogics.tiles : null;
    let tilesLegends = tileLogics.tileLegend ? tileLogics.tileLegend : null;
    return (
      <div>
        <div style={{ height: tileLogics.totalHeight + "px" }}>{tiles} </div>
        <div>{tilesLegends}</div>
      </div>
    );
  }
}

export default DataTiles;

const Tile = (props) => {
  return (
    <div
      style={{
        color: "var(--fifth)",
        display: "inline-block",
        padding: props.padding,
        fontFamily: "Arial",
        fontSize: "25px",
        //  height: props.width_percentage * 100 + "%",
        verticalAlign: "middle",
        height: "inherit",
        background: props.bgColor,
      }}
    >
      {props.value}
    </div>
  );
};

const TileLegendField = (props) => {
  return (
    <div style={{ display: "inline-block", margin: "0px 10px" }}>
      <div style={{ display: "inline-block", padding: "0px 5px", width: "10px", height: "10px", background: props.bgColor }}> </div>
      <div style={{ display: "inline-block", padding: "0px 5px", fontSize: "12px" }}> {props.label}</div>
    </div>
  );
};
