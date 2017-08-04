import React, { Component } from 'react';

/* eslint-disable */
export class Text extends Component {
    render() {
        return (
            <p className="FancyLink" dangerouslySetInnerHTML={{ __html: this.props.description.Value }} />
        );
    }
}

export class ErrorBlock extends Component {

    render() {
        return (
            <span className="error-block">{this.props.errorText}</span>
        );
    }
}

export class SuccessField extends Component {

    render() {

        return (
            <p>{this.props.message}</p>
        );
    }
}
/* eslint-enable */

export class Tooltip extends Component {
    constructor() {
        super();
        this.toggleTooltip = this.toggleTooltip.bind(this);

        this.state = {
            tooltipOpen: false
        };
    }

    toggleTooltip() {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    }

    render() {
        return (
            <div
                data-tpl="tooltip"
                className={`displayed tooltip--right tooltip--bottom tooltip--left ${this.state.tooltipOpen ? 'open' : ''}`}
            >
                <span
                    data-toggle="tooltip"
                    className="icon icon-info tooltip-trigger"
                    onClick={this.toggleTooltip}
                />
                <div className="tooltip-container" onClick={this.toggleTooltip}>
                    <div className="tooltip-close icon icon-close_info" onClick={this.toggleTooltip} />
                    <div className="tooltip-content">{this.props.tooltipText}</div>
                </div>
            </div>
        );
    }
}

export class GenericErrorField extends Component {

    renderView() {

        return (
            <div className="validation-summary-errors FancyErrorMessage">
                <ul>
                    <li>{this.props.message}</li>
                </ul>
            </div>
        );
    }

    render() {

        return this.props.message === '' ? null : this.renderView();
    }
}

export class GenericSuccessField extends Component {

    renderView() {

        return (
            <p className="customForm__submit customForm__submit_success">{this.props.message}</p>
        );
    }

    render() {

        return this.props.message === '' ? null : this.renderView();
    }
}

