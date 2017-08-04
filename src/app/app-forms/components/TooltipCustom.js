import React, { Component } from 'react';

export default class TooltipCustom extends Component {
    constructor() {
        super();
        this.toggleTooltip = this.toggleTooltip.bind(this);

        this.state = {
            tooltipOpen: false
        };
    }

    toggleTooltip(e) {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    }

    render() {
        const tooltipStyle = {
            border: 'none',
            background: 'none'
        };

        return (
            <div
                data-tpl="tooltip"
                tabIndex="-1"
                className={`displayed tooltip--right tooltip--bottom tooltip--left ${this.state.tooltipOpen ? 'open' : ''}`}
                style={tooltipStyle}
            >
                <span data-toggle="tooltip" className="icon icon-info tooltip-trigger" onClick={(e) => this.toggleTooltip(e)} />
                <div className="tooltip-container" >
                    <div className="tooltip-close icon icon-close_info" onClick={this.toggleTooltip} />
                    <div className="tooltip-content">{this.props.tooltipText}</div>
                </div>
            </div>
        );
    }
}
