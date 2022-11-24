import React from "react";
import Radium from "radium";

class PermissionTabs extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.clickedTab(this.props.tab);
    }
    render() {
        const styles = getStyles(this.props, this.state);
        return (
            <div style={styles.tabContainer} onClick={this.handleClick}>
                {this.props.tab}
            </div>
        );
    }
}

export default Radium(PermissionTabs);

let getStyles = (props, state) => {
    const { selectedState } = props;
    let background = "#ead21a";
    let color = " #000000";
    if (selectedState) {
        background =  "rgb(249, 241, 186)";
        color = " #000000";
    }
    return {
        tabContainer: {
            display: "inline-block",
            padding: "10px",
            borderRight: "1px solid #b3b3b3",
            backgroundColor: background,
            color: color,
            borderRadius: "2px",
            cursor: "pointer",

            transitionDuration: "0.4s",
            ":hover": {
                backgroundColor: "rgb(249, 241, 186)",
                color: "#000000",
            },
        },
    };
};
