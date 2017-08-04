import React, { PropTypes } from 'react';

import { Tooltip, ErrorBlock } from './Miscellaneous';

export class Button extends React.Component {

    constructor(props) {
        super(props);

        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(e) {
        e.preventDefault();
        this.props.handlePress({ call: e, object: this });
    }

    render() {
        const description = this.props.description;

        return (
            <button
                type={this.props.type}
                className={`btn ${description.Class}`}
                title={description.Label}
                onClick={this.clickHandler}
            >
                {description.Label}
            </button>
        );
    }
}
Button.propTypes = {
    type: React.PropTypes.string.isRequired
};
Button.defaultProps = {
    type: 'button'
};

export class Checkbox extends React.Component {

    constructor(props) {
        super(props);

        if (this.props.description.Required) {

            this.state = {
                value: false,
                valid: false,
                errorText: ''
            };
        } else {
            this.state = {
                value: false,
                valid: true,
                errorText: ''
            };
        }

        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(e) {

        let valid = this.state.valid;

        if (this.props.description.Required) {

            valid = !valid;
        }

        const errorText = (valid ? '' : this.props.description.RequiredWarningMessage);

        this.setState({ value: !this.state.value, valid, errorText }, () => {

            this.props.handleChange({ event: e, element: this });
        });
    }

    validate() {

        const { description } = this.props;

        if (description.Required) {

            if (!this.state.valid) {

                // console.log(description.RequiredWarningMessage);
                this.setState({ value: false, valid: false, errorText: description.RequiredWarningMessage });
            }
        }
    }

    renderTooltip() {
        if (this.props.description.Tooltip) {
            return <Tooltip tooltipText={this.props.description.Tooltip} />;
        }
        return null;
    }

    render() {
        const { description } = this.props;

        return (
            <div
                className={`form-group info checkbox-group ${this.state.errorText ? 'error' : ''} ${this.props.description.Required ? 'required' : ''}`}
            >
                <div className="formEdit__content">
                    <div className="checkbox">
                        <input
                            id={description.FieldName}
                            name={description.CheckboxName}
                            type="checkbox"
                            onClick={this.clickHandler}
                        />
                        <input
                            id={`${description.FieldName}-hidden`}
                            name={description.CheckboxName}
                            type="hidden"
                        />
                        <label htmlFor={description.FieldName}>
                            <span dangerouslySetInnerHTML={{ __html: description.CheckboxLabel }} />
                        </label>
                    </div>
                    {this.renderTooltip()}
                </div>
                <ErrorBlock errorText={this.state.errorText} />
            </div>
        );
    }
}
export class Select extends React.Component {

    constructor(props) {
        super(props);

        if (this.props.description.Required) {

            this.state = {
                errorText: '',
                error: false,
                valid: false,
                value: '',
                text: '',
                selectClosed: true
            };
        } else {
            this.state = {
                errorText: '',
                error: false,
                valid: true,
                value: '',
                text: '',
                selectClosed: true
            };
        }

        this.handleClickCustomSelect = this.handleClickCustomSelect.bind(this);
        this.renderCustomOptions = this.renderCustomOptions.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.toggleOption = this.toggleOption.bind(this);
    }

    toggleOption() {
        this.setState({ selectClosed: !this.state.selectClosed });
    }

    validate() {
        // ** check if required: ** //
        if (this.props.description.Required) {
            if (this.state.value.length < 1) {
                return this.setState({
                    errorText: this.props.description.RequiredWarningMessage,
                    error: true,
                    valid: false
                });
            }
        }
        return null;
    }

    handleClickCustomSelect(event) {
        const currentValue = event.target.getAttribute('data-value');
        const currentText = event.target.getAttribute('data-text');

        let valid = false;
        if (currentValue || currentValue.length > 1) {
            valid = true;
        }

        this.toggleOption();
        this.setState({
            value: currentValue,
            text: currentText,
            error: false,
            valid },
            () => this.props.handleChange({ element: this, event })
        );
    }

    renderTooltip() {
        if (this.props.description.Tooltip) {
            return <Tooltip tooltipText={this.props.description.Tooltip} />;
        }
        return null;
    }

    renderOptions() {
        const receivedOptions = [];
        if (this.props.description.Children) {
            for (let i = 0; i < this.props.description.Children.length; i += 1) {
                const currentChild = this.props.description.Children[i];
                receivedOptions.push(
                    <option
                        key={i}
                        value={currentChild.Text}
                        name={this.props.description.FieldName}
                        onClick={this.handleClickCustomSelect}
                    >
                        {currentChild.Text}
                    </option>
                );
            }
        }
        return receivedOptions;
    }

    renderCustomOptions() {
        const receivedOptions = [];
        if (this.props.description.Children) {
            for (let i = 0; i < this.props.description.Children.length; i += 1) {
                const currentChild = this.props.description.Children[i];
                receivedOptions.push(
                    <div
                        key={i}
                        className="option"
                        data-value={currentChild.Value}
                        data-text={currentChild.Text}
                        name={this.props.description.FieldName}
                        onClick={this.handleClickCustomSelect}
                    >
                        {currentChild.Text}
                    </div>
                );
            }
        }
        return receivedOptions;
    }

    render() {

        const { description } = this.props;
        const { text, value, selectClosed } = this.state;

        return (
            <div>
                <div className="hidden">
                    <label htmlFor={description.FieldName} key={description.Name}>
                        {description.Label}
                    </label>
                </div>
                <div className={`form-group ${this.state.error ? 'error' : ''} ${description.Required ? 'required' : ''}`}>
                    <label htmlFor={description.FieldName}>{description.Label}</label>
                    <div className="formEdit__content">
                        <div className={`aCustomSelect ${selectClosed ? '' : 'aCustomSelect_open'}`}>
                            <select
                                id={description.FieldName}
                                name={description.FieldName}
                                className="form-control hidden"
                                ref={description.FieldName}
                                onClick={this.toggleOption}
                                value={this.state.value}
                            >
                                <option
                                    key="placeholder"
                                    value=""
                                    name={description.FieldName}
                                    onClick={this.handleClickCustomSelect}
                                >
                                    {description.Placeholder}
                                </option>
                                {this.renderOptions()}
                            </select>

                            <div
                                id={description.FieldName}
                                name={description.FieldName}
                                className="form-control customSelectWrapper"
                                ref={description.FieldName}
                                onClick={this.toggleOption}
                                value={this.state.value}
                                tabIndex={0}
                            >
                                {value === '' || value === undefined ? description.Placeholder : text}
                            </div>

                            <div className={`custom-options${selectClosed ? '_closed' : ''}`}>
                                <div className="custom-options-wrapper">
                                    <div
                                        className="option"
                                        key="placeholder"
                                        data-value=""
                                        onClick={this.handleClickCustomSelect}
                                        name={description.FieldName}
                                    >
                                        {description.Placeholder}
                                    </div>
                                    {this.renderCustomOptions()}
                                </div>
                            </div>
                        </div>
                        {this.renderTooltip()}
                    </div>

                    <ErrorBlock errorText={this.state.errorText} />
                </div>
            </div>
        );
    }
}
