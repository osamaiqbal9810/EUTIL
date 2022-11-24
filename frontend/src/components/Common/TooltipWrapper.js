import React, {Component} from 'react';
import {Tooltip} from "reactstrap";
import {languageService} from "../../Language/language.service";
import PropTypes from 'prop-types';

class TooltipWrapper extends Component {
    state = {
        tooltip: false,
    };

    render() {
        return (
            <React.Fragment>
                {this.props.children}

                <Tooltip
                    {...this.props}
                    isOpen={this.state.tooltip}
                    toggle={() => this.setState({ tooltip: !this.state.tooltip })}
                >
                    {languageService(this.props.infoText)}
                </Tooltip>
            </React.Fragment>
        );
    }
}

TooltipWrapper.propTypes = {
    target: PropTypes.string.isRequired,
    infoText: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired
};

export default TooltipWrapper;
