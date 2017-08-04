/*
 * Created by LTL
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TooltipCustom from './TooltipCustom';
import ErrorBlock from './ErrorBlock';

// === === === === === === === === === === === === === === === === === === === === === //

export class Button extends Component {
    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        const { btnDefinition, handleSubmit, toggleMode, resetData, hideValidationMsg, removeGenericError } = this.props;

        if (handleSubmit) {
            handleSubmit();
        } else if (btnDefinition.FieldName === 'CancelButton') {
            if (toggleMode) { toggleMode(); }
            if (resetData) { resetData(); }
            if (hideValidationMsg) { hideValidationMsg(); }
            if (removeGenericError) { removeGenericError(); }
        } else if (btnDefinition.FieldName === 'EditButton') {
            toggleMode();
        }
    }

    render() {
        const { btnDefinition, enableSave, hideGenericError, additionalClass } = this.props;
        const btnClass = classNames({
            btn: true,
            [`${btnDefinition.Class}`]: true,
            disabled: enableSave || hideGenericError === false,
            [`${additionalClass}`]: true
        });

        return (
            <button
                title={btnDefinition.Label}
                className={btnClass}
                onClick={this.handleClick}
            >
                {btnDefinition.Label}
            </button>
        );
    }
}


Button.defaultProps = {
    additionalClass: ''
};

Button.propTypes = {
    btnDefinition: PropTypes.object.isRequired
};

// === === === === === === === === === === === === === === === === === === === === === //

export class Checkbox extends Component {
    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
        this.validateInput = this.validateInput.bind(this);

        this.state = {
            errorText: 'Something is wrong',
            valid: true
        };
    }

    handleClick() {
        this.props.toEnableSave();
        this.props.handleCheck(this.props.content.FieldName);
        this.validateInput();
    }

    validateInput() {
        const { content } = this.props;
        const inputText = this.props.value;
        // ** check if required: ** //
        if (content.Required) {
            if (inputText) {
                this.setState({
                    errorText: content.RequiredWarningMessage,
                    valid: false
                });
                return false;
            }
            this.setState({
                errorText: 'Everthing is ok',
                valid: true
            });
        }
        this.setState({ valid: true });
        return true;
    }

    renderTooltip() {
        if (this.props.content.Tooltip) {
            return <TooltipCustom tooltipText={this.props.content.Tooltip} />;
        }
        return null;
    }

    render() {
        const { content, displayValidationMsg } = this.props;
        const inputClass = classNames({
            'form-group': true,
            info: true,
            'checkbox-group': true,
            error: displayValidationMsg && !this.state.valid,
            required: content.Required
        });

        return (
            <div className={inputClass}>
                <div className="formEdit__content">
                    <div className="checkbox">
                        <input
                            id={content.FieldName}
                            name={content.FieldName}
                            type="checkbox"
                            onChange={this.handleClick}
                            ref={content.FieldName}
                            checked={this.props.value}
                        />
                        <input
                            id={`${content.FieldName}-hidden`}
                            name={content.FieldName}
                            type="hidden"
                            value="on"
                        />
                        <label className="custom-checkbox_label" htmlFor={content.FieldName}><span dangerouslySetInnerHTML={{ __html: content.CheckboxLabel }} /></label>
                    </div>
                    {this.renderTooltip()}
                </div>
                <ErrorBlock errorText={this.state.errorText} />
            </div>
        );
    }
}

Checkbox.defaultProps = {
    toEnableSave: () => {},
    editMode: true
};

Checkbox.propTypes = {
    content: PropTypes.object.isRequired,
    editMode: PropTypes.bool,
    toEnableSave: PropTypes.func.isRequired,
    handleCheck: PropTypes.func.isRequired,
    value: PropTypes.bool.isRequired
};

// === === === === === === === === === === === === === === === === === === === === === === //

export class TextInput extends Component {
    constructor() {
        super();

        this.renderTooltip = this.renderTooltip.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.state = {
            errorText: 'Something is wrong',
            valid: true
        };
    }

    // update the error msg after post request gave the error msg and update the valid state to false:
    componentWillReceiveProps(nextProps) {
        if (nextProps.errorData) {
            this.setState({
                errorText: nextProps.errorData || 'Hoops, something is wrong in this form',
                valid: false
            });
            this.props.errorDataToNull();
        }
    }

    validateInput() {
        const { content, ifRequired } = this.props;
        const inputText = this.props.value;

        // hot fix for urgent change requirement for BUG 3712": ifRequired
        // Required validation:
        if (content.Required || ifRequired) {
            if (inputText.length < 1) {
                this.setState({
                    errorText: content.RequiredWarningMessage || 'failed - Required validation',
                    valid: false
                });
                return false;
            }
            this.setState({
                errorText: 'Something is wrong',
                valid: true
            });
        }

        // MaxLength validation:
        if (content.MaxLength) {
            if (inputText.length === 0) {
                this.setState({
                    errorText: 'Something is wrong',
                    valid: true
                });
                return true;
            }

            if (inputText.length !== 0 && inputText.length > content.MaxLength) {
                this.setState({
                    errorText: content.MaxLengthWarning || 'failed - MaxLength validation',
                    valid: false
                });
                return false;
            }
            this.setState({
                errorText: 'Something is wrong',
                valid: true
            });
        }

        // ExactLength validation:
        if (content.ExactLength) {
            if (inputText.length === 0) {
                this.setState({
                    errorText: 'Something is wrong',
                    valid: true
                });
                return true;
            }

            if (inputText.length !== 0 && inputText.length !== content.ExactLength) {
                this.setState({
                    errorText: content.ExactLengthWarning || 'failed - ExactLengthWarning validation',
                    valid: false
                });
                return false;
            }

            this.setState({
                errorText: 'Something is wrong',
                valid: true
            });
        }

        // Pattern validation:
        if (content.Pattern) {
            const reg = new RegExp(content.Pattern);
            if (!reg.test(inputText) && inputText.length !== 0) {
                this.setState({
                    errorText: content.PatternWarning || 'failed - PatternWarning validation',
                    valid: false
                });
                return false;
            }

            this.setState({
                errorText: 'Something is wrong',
                valid: true
            });
        }
        this.setState({ valid: true });
        return true;
    }

    handleChange(event) {
        this.props.updateInputValue(event.target.name, event.target.value);
        this.props.toEnableSave();
    }

    handleKeyUp() {
        this.validateInput();
    }

    handleBlur() {
        this.validateInput();
    }

    renderTooltip() {
        if (this.props.content.Tooltip) {
            return <TooltipCustom tooltipText={this.props.content.Tooltip} />;
        }
        return null;
    }

    render() {
        const { content, value, editMode, displayValidationMsg, ifRequired } = this.props;
        let requiredClass;
        const inputClass = classNames({
            'form-group': true,
            error: displayValidationMsg && !this.state.valid,
            hidden: !editMode,
            disabled: !ifRequired && content.FieldName === 'Address1'
        });

        // hot fix for urgent change requirement for BUG 3712
        if (content.FieldName === 'Address1' || content.FieldName === 'Mailbox') {
            requiredClass = classNames({
                required: ifRequired
            });
        } else {
            requiredClass = classNames({
                required: content.Required
            });
        }

        return (
            <fieldset>
                <div className={editMode ? 'hidden' : ''}>
                    <label htmlFor={content.FieldName} key={content.Label}>
                        {content.Label}
                    </label>
                    <p>{value}</p>
                </div>

                <div className={`${inputClass} ${requiredClass}`} data-tpl="cde-input">
                    <label htmlFor={content.FieldName}>{content.Label}</label>
                    <div className="formEdit__content">
                        <input
                            id={content.FieldName}
                            name={content.FieldName}
                            type={content.ControlType}
                            className="form-control"
                            placeholder={content.Placeholder}
                            onChange={this.handleChange}
                            onKeyUp={this.handleKeyUp}
                            value={value}
                            disabled={!ifRequired && content.FieldName === 'Address1' ? 'disabled' : ''}
                        />
                        {this.renderTooltip()}
                    </div>
                    <ErrorBlock errorText={this.state.errorText} />
                </div>
            </fieldset>
        );
    }
}

TextInput.defaultProps = {
    value: '',
    errorDataToNull: () => {},
    toEnableSave: () => {},
    editMode: true,
    displayValidationMsg: false
};

TextInput.propTypes = {
    content: PropTypes.object.isRequired,
    displayValidationMsg: PropTypes.bool,
    editMode: PropTypes.bool,
    toEnableSave: PropTypes.func.isRequired,
    errorDataToNull: PropTypes.func.isRequired,
    updateInputValue: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};

// === === === === === === === === === === === === === === === === === === === === === === //

export class Select extends Component {
    constructor() {
        super();

        this.handleClickCustomSelect = this.handleClickCustomSelect.bind(this);
        this.handleClickSelect = this.handleClickSelect.bind(this);
        this.renderCustomOptions = this.renderCustomOptions.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.toggleOption = this.toggleOption.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.closeSelect = this.closeSelect.bind(this);

        this.state = {
            errorText: 'Something is wrong',
            receivedOptions: false,
            selectClosed: true,
            valid: true,
            value: '',
            text: ''
        };

    }

    componentDidMount() {
        this.renderOptions();
    }

    // ** update the error msg after post request gave the error msg and update the valid state to false ** //
    componentWillReceiveProps(nextProps) {
        if (nextProps.errorData) {
            this.setState({
                errorText: nextProps.errorData,
                valid: false
            });
            this.props.errorDataToNull();
        }

        if (nextProps.selectDefinition) {
            this.setState({ receivedOptions: true });
        }
        // added nextProps.value for user JFC01, will rework select:
        if (nextProps.editMode === false || nextProps.value === '') {
            this.setState({
                value: '',
                text: ''
            });
        }
    }

    validateInput() {
        const currentValue = this.props.value;

        // ** check if required: ** //
        if (this.props.content.Required) {
            if (currentValue.length < 1) {
                this.setState({
                    errorText: this.props.content.RequiredWarningMessage,
                    valid: false
                });
                return false;
            }

            this.setState({
                errorText: 'Something is wrong',
                valid: true
            });

            return true;
        }

        return true;
    }

    toggleOption() {
        this.setState({ selectClosed: !this.state.selectClosed });
    }

    closeSelect() {
        if (!this.state.selectClosed) {
            this.setState({ selectClosed: true });
        }
    }

    handleClickSelect(event) {
        this.toggleOption();
    }

    handleClickCustomSelect(event) {
        const currentValue = event.target.getAttribute('data-value');
        const currentText = event.target.getAttribute('data-text');
        const currentName = event.target.getAttribute('name');
        this.props.updateInputValue(currentName, currentValue, currentText);

        // ** check if required: ** //
        if (this.props.content.Required) {
            if (currentValue.length < 1) {
                this.toggleOption();
                this.setState({
                    value: currentValue,
                    text: currentText
                });
                return this.setState({
                    errorText: this.props.content.RequiredWarningMessage,
                    valid: false
                });
            }

            this.props.toEnableSave();

            this.setState({
                errorText: 'Something is wrong',
                valid: true
            });
        }

        this.toggleOption();
        this.setState({
            value: currentValue,
            text: currentText
        });
        this.props.updateInputValue(currentName, currentValue, currentText);
        this.props.toEnableSave();
        return null;
    }

    renderOptions() {
        let receivedOptions = null;
        if (this.state.receivedOptions) {
            if (this.props.selectDefinition) {
                receivedOptions = (
                    this.props.selectDefinition.map((element, index) => {
                        if (element.length > 0) {
                            return (
                                <option
                                    key={element}
                                    value={element}
                                    name={this.props.content.FieldName}
                                    onClick={this.handleClickCustomSelect}
                                >
                                    {element}
                                </option>
                            );
                        }
                        return null;
                    })
                );
            }
        } else if (this.props.content.Children) {
            receivedOptions = (
                this.props.content.Children.map((element, index) => {
                    if (element.Value ? element.Value.length > 0 : element.Text.length > 0) {
                        return (
                            <option
                                key={element.Value || element.Text}
                                value={element.Value || element.Text}
                                name={this.props.content.FieldName}
                                onClick={this.handleClickCustomSelect}
                            >
                                {element.Value || element.Text}
                            </option>
                        );
                    }
                    return null;
                })
            );
        }
        return receivedOptions;
    }

    renderCustomOptions() {
        let receivedOptions = null;
        if (this.state.receivedOptions) {
            if (this.props.selectDefinition) {
                receivedOptions = (
                    this.props.selectDefinition.map((element, index) => {
                        if (element.length > 0) {
                            return (
                                <div
                                    className="option"
                                    key={element}
                                    data-value={element}
                                    data-text={element}
                                    name={this.props.content.FieldName}
                                    onClick={this.handleClickCustomSelect}
                                >
                                    {element}
                                </div>
                            );
                        }
                        return null;
                    })
                );
            }
        } else if (this.props.content.Children) {
            receivedOptions = (
                this.props.content.Children.map((element, index) => {
                    if (element.Value ? element.Value.length > 0 : element.Text.length > 0) {
                        return (
                            <div
                                className="option"
                                data-text={element.Text || element.Value}
                                data-value={element.Value || element.Text}
                                key={element.Value || element.Text}
                                name={this.props.content.FieldName}
                                onClick={this.handleClickCustomSelect}
                            >
                                {element.Text || element.Value}
                            </div>
                        );
                    }
                    return null;
                })
            );
        }
        return receivedOptions;
    }

    renderTooltip() {
        if (this.props.content.Tooltip) {
            return <TooltipCustom tooltipText={this.props.content.Tooltip} />;
        }
        return null;
    }

    renderText() {
        const { text } = this.state;
        const { content, value } = this.props;
        if (text === '') {
            if (value === '' || value === undefined) {
                return content.Placeholder;
            }
            return value;
        }
        return text;
    }

    render() {
        const { editMode, content, value, selectDefinition, displayValidationMsg } = this.props;
        const { selectClosed, errorText } = this.state;
        const selectClass = classNames({
            'form-group': true,
            required: content.Required,
            hidden: !editMode,
            error: displayValidationMsg && !this.state.valid
        });

        return (
            <fieldset>
                <div className={editMode ? 'hidden' : ''}>
                    <label htmlFor={content.FieldName} key={content.Name}>
                        {content.Label}
                    </label>
                    <p>{value}</p>
                </div>
                <div className={selectClass}>
                    <label htmlFor={content.FieldName}>{content.Label}</label>
                    <div className="formEdit__content">
                        <div className="aCustomSelect">
                            <select
                                id={content.FieldName}
                                name={content.FieldName}
                                className="form-control hidden"
                                ref={content.FieldName}
                                onClick={this.handleClickSelect}
                                value={this.state.value}
                            >
                                <option key="placeholder" value="" name={content.FieldName} onClick={this.handleClickCustomSelect}>{content.Placeholder}</option>
                                { this.renderOptions() }
                            </select>

                            {/*eslint-disable*/}
                            <div
                                id={content.FieldName}
                                name={content.FieldName}
                                className={`form-control customSelectWrapper aCustomArrow ${selectClosed ? '' : 'aCustomArrow_open'}`}
                                ref={content.FieldName}
                                onClick={this.handleClickSelect}
                                data-value={this.state.value}
                                tabIndex={0}
                                onBlur={this.closeSelect}
                            >
                            {/*eslint-enable*/}
                                <p>
                                    { this.renderText() }
                                </p>

                                <div className={`custom-options${selectClosed ? '_closed' : ''}`}>
                                    <div className="custom-options-wrapper" >
                                        {/*eslint-disable*/}
                                        <div
                                            className="option"
                                            key="placeholder"
                                            data-value=""
                                            data-text={content.Placeholder}
                                            onClick={this.handleClickCustomSelect}
                                            name={content.FieldName}
                                        >
                                        {/*eslint-enable*/}
                                            {content.Placeholder}
                                        </div>
                                        { this.renderCustomOptions() }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {this.renderTooltip()}
                    </div>

                    <ErrorBlock errorText={errorText} />
                </div>
            </fieldset>
        );
    }
}

Select.defaultProps = {
    toEnableSave: () => {},
    errorDataToNull: () => {},
    value: '',
    editMode: true,
    displayValidationMsg: false
};

Select.propTypes = {
    content: PropTypes.object.isRequired,
    displayValidationMsg: PropTypes.bool,
    editMode: PropTypes.bool,
    toEnableSave: PropTypes.func.isRequired,
    errorDataToNull: PropTypes.func.isRequired,
    updateInputValue: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};

// === === === === === === === === === === === === === === === === === === === === === === //

export class EnergyDataInput extends Component {
    constructor(props) {
        super(props);

        this.validateInput = this.validateInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.state = {
            errorText: 'Something is wrong',
            valid: true,
            value: ''
        };
    }

    // ** update the error msg after post request gave the error msg and update the valid state to false ** //
    componentWillReceiveProps(nextProps) {
        if (nextProps.errorData) {
            this.setState({
                errorText: nextProps.errorData,
                valid: false
            });
            this.props.errorDataToNull();
        }
    }

    handleChange(event) {
        const { value } = event.target;
        this.setState({ value });
        this.props.handleChange(value);
        this.props.toEnableSave();
    }

    handleBlur() {
        this.validateInput();
    }

    validateInput() {
        const { content } = this.props;
        const inputText = this.state.value;

        // ** check if correnct pattern ** //
        if (content.Pattern) {
            const reg = new RegExp(content.Pattern);
            if (!reg.test(inputText) && inputText.length !== 0) {
                this.setState({
                    errorText: content.PatternWarning,
                    valid: false
                });
                return false;
            }
            // TO REMOVE
            // else {
            //     this.setState({
            //         errorText: 'Something is wrong',
            //         valid: true
            //     });
            // }
        }
        this.setState({
            valid: true,
            errorText: 'Something is wrong'
        });
        return true;
    }

    render() {
        const { content, displayValidationMsg } = this.props;
        const inputClass = classNames({
            'form-group': true,
            error: displayValidationMsg && !this.state.valid,
            required: content.Required
        });
        return (
            <fieldset>
                <div className={inputClass} data-tpl="cde-input">
                    <label htmlFor={content.FieldName}>{content.Label}</label>
                    <div className="formEdit__content">
                        <input
                            id={content.FieldName}
                            name={content.FieldName}
                            type={content.ControlType || 'number'}
                            className="form-control"
                            placeholder={content.Placeholder}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            onClick={this.handleChange}
                            value={this.state.value}
                            maxLength={content.MaxLength === 0 ? null : content.MaxLength}
                        />
                    </div>
                    <ErrorBlock errorText={this.state.errorText} />
                </div>
            </fieldset>
        );
    }
}

EnergyDataInput.defaultProps = {
    errorDataToNull: () => {},
    toEnableSave: () => {}
};

EnergyDataInput.propTypes = {
    errorDataToNull: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    toEnableSave: PropTypes.func.isRequired
};

// === === === === === === === === === === === === === === === === === === === === === === //
export class Textarea extends Component {
    constructor() {
        super();

        this.renderTooltip = this.renderTooltip.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.state = {
            errorText: 'Error',
            valid: true
        };
    }

    // ** update the error msg after post request gave the error msg and update the valid state to false ** //
    componentWillReceiveProps(nextProps) {
        if (nextProps.errorData) {
            this.setState({
                errorText: nextProps.errorData || 'Error',
                valid: false
            });
            this.props.errorDataToNull();
        }
    }

    validateInput() {
        const { content } = this.props;
        const inputText = this.props.value;
        // ** check if required: ** //
        if (content.Required) {
            if (inputText.length < 1) {
                this.setState({
                    errorText: content.RequiredWarningMessage || 'Please fill in',
                    valid: false
                });
                return false;
            }
            this.setState({
                errorText: 'Error',
                valid: true
            });
        }

        // ** check if correct ExactLength ** //
        if (content.ExactLength) {
            if (inputText.length === 0) {
                this.setState({
                    errorText: 'Error',
                    valid: true
                });
                return true;
            }

            if (inputText.length !== 0 && inputText.length !== content.ExactLength) {
                this.setState({
                    errorText: content.ExactLengthWarning,
                    valid: false
                });
                return false;
            }
            this.setState({
                errorText: 'Error',
                valid: true
            });
        }

        // ** check if correnct pattern ** //
        if (content.Pattern) {
            const reg = new RegExp(content.Pattern);
            if (!reg.test(inputText) && inputText.length !== 0) {
                this.setState({
                    errorText: content.PatternWarning,
                    valid: false
                });
                return false;
            }

            this.setState({
                errorText: 'Error',
                valid: true
            });
        }
        this.setState({ valid: true });
        return true;
    }
    handleChange(event) {
        this.props.updateInputValue(event.target.name, event.target.value);
        this.props.toEnableSave();
    }

    handleKeyUp() {
        this.validateInput();
    }

    handleBlur() {
        this.validateInput();
    }

    renderTooltip() {
        if (this.props.content.Tooltip) {
            return <TooltipCustom tooltipText={this.props.content.Tooltip} />;
        }
        return null;
    }

    render() {
        const { content, value, editMode, displayValidationMsg } = this.props;
        const inputClass = classNames({
            'form-group': true,
            error: displayValidationMsg && !this.state.valid,
            hidden: !editMode
        });

        return (
            <fieldset>
                <div className={editMode ? 'hidden' : ''}>
                    <label htmlFor={content.FieldName} key={content.Label}>
                        {content.Label}
                    </label>
                    <p>{value}</p>
                </div>

                <div className={inputClass} data-tpl="cde-input">
                    <label htmlFor={content.FieldName}>{content.Label}</label>
                    <div className="formEdit__content">
                        <textarea
                            id={content.FieldName}
                            name={content.FieldName}
                            className="form-control"
                            placeholder={content.Placeholder}
                            onChange={this.handleChange}
                            onKeyUp={this.handleKeyUp}
                            value={value}
                            rows={JSON.parse(content.NumberOfRows) || '5'}
                        />
                        {this.renderTooltip()}
                    </div>
                    <ErrorBlock errorText={this.state.errorText} />
                </div>
            </fieldset>
        );
    }
}

Textarea.defaultProps = {
    value: '',
    errorDataToNull: () => {},
    toEnableSave: () => {},
    editMode: true,
    displayValidationMsg: false
};

Textarea.propTypes = {
    content: PropTypes.object.isRequired,
    displayValidationMsg: PropTypes.bool,
    editMode: PropTypes.bool,
    toEnableSave: PropTypes.func.isRequired,
    errorDataToNull: PropTypes.func.isRequired,
    updateInputValue: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};

// === === === === === === === === === === === === === === === === === === === === === === //
// USE BELOW TO REWORK THE SELECT, MOVE EVERY STATE TO PARENT AND USE REDUX:
// export class FilterSelect extends Component {
//     constructor() {
//         super();

//         this.handleClickCustomSelect = this.handleClickCustomSelect.bind(this);
//         this.handleClickSelect = this.handleClickSelect.bind(this);
//         this.renderCustomOptions = this.renderCustomOptions.bind(this);
//         this.renderTooltip = this.renderTooltip.bind(this);
//         this.renderOptions = this.renderOptions.bind(this);
//         this.toggleOption = this.toggleOption.bind(this);
//         this.validateInput = this.validateInput.bind(this);

//         this.state = {
//             errorText: 'Something is wrong',
//             receivedOptions: false,
//             selectClosed: true,
//             valid: true,
//             value: '',
//             text: ''
//         };

//     }

//     componentDidMount() {
//         this.renderOptions();
//     }

//     // ** update the error msg after post request gave the error msg and update the valid state to false ** //
//     componentWillReceiveProps(nextProps) {
//         if (nextProps.errorData) {
//             this.setState({
//                 errorText: nextProps.errorData,
//                 valid: false
//             });
//             this.props.errorDataToNull();
//         }

//         if (nextProps.selectDefinition) {
//             this.setState({ receivedOptions: true });
//         }

//         if (nextProps.editMode === false || nextProps.value === '') {
//             this.setState({
//                 value: '',
//                 text: ''
//             });
//         }
//     }

//     validateInput() {
//         const currentValue = this.props.value;

//         // ** check if required: ** //
//         if (this.props.content.Required) {
//             if (currentValue.length < 1) {
//                 this.setState({
//                     errorText: this.props.content.RequiredWarningMessage,
//                     valid: false
//                 });
//                 return false;
//             }

//             this.setState({
//                 errorText: 'Something is wrong',
//                 valid: true
//             });

//             return true;
//         }

//         return true;
//     }

//     toggleOption() {
//         this.setState({ selectClosed: !this.state.selectClosed });
//     }

//     handleClickSelect(event) {
//         this.toggleOption();
//     }

//     handleClickCustomSelect(event) {
//         const currentValue = event.target.getAttribute('data-value');
//         const currentText = event.target.getAttribute('data-text');
//         const currentName = event.target.getAttribute('name');
//         this.props.updateInputValue(currentName, currentValue, currentText);

//         // ** check if required: ** //
//         if (this.props.content.Required) {
//             if (currentValue.length < 1) {
//                 this.toggleOption();
//                 this.setState({
//                     value: currentValue,
//                     text: currentText
//                 });
//                 return this.setState({
//                     errorText: this.props.content.RequiredWarningMessage,
//                     valid: false
//                 });
//             }

//             this.props.toEnableSave();

//             this.setState({
//                 errorText: 'Something is wrong',
//                 valid: true
//             });
//         }

//         this.toggleOption();
//         this.setState({
//             value: currentValue,
//             text: currentText
//         });
//         this.props.updateInputValue(currentName, currentValue, currentText);
//         this.props.toEnableSave();
//         return null;
//     }

//     renderOptions() {
//         let receivedOptions = null;
//         if (this.state.receivedOptions) {
//             if (this.props.selectDefinition) {
//                 receivedOptions = (
//                     this.props.selectDefinition.map((element, index) => {
//                         if (element.length > 0) {
//                             return (
//                                 <option
//                                     key={element}
//                                     value={element}
//                                     name={this.props.content.FieldName}
//                                     onClick={this.handleClickCustomSelect}
//                                 >
//                                     {element}
//                                 </option>
//                             );
//                         }
//                         return null;
//                     })
//                 );
//             }
//         } else if (this.props.content.Children) {
//             receivedOptions = (
//                 this.props.content.Children.map((element, index) => {
//                     if (element.Value ? element.Value.length > 0 : element.Text.length > 0) {
//                         return (
//                             <option
//                                 key={element.Value || element.Text}
//                                 value={element.Value || element.Text}
//                                 name={this.props.content.FieldName}
//                                 onClick={this.handleClickCustomSelect}
//                             >
//                                 {element.Value || element.Text}
//                             </option>
//                         );
//                     }
//                     return null;
//                 })
//             );
//         }
//         return receivedOptions;
//     }

//     renderCustomOptions() {
//         let receivedOptions = null;
//         if (this.state.receivedOptions) {
//             if (this.props.selectDefinition) {
//                 receivedOptions = (
//                     this.props.selectDefinition.map((element, index) => {
//                         if (element.length > 0) {
//                             return (
//                                 <div
//                                     className="option"
//                                     key={element}
//                                     data-value={element}
//                                     data-text={element}
//                                     name={this.props.content.FieldName}
//                                     onClick={this.handleClickCustomSelect}
//                                 >
//                                     {element}
//                                 </div>
//                             );
//                         }
//                         return null;
//                     })
//                 );
//             }
//         } else if (this.props.content.Children) {
//             receivedOptions = (
//                 this.props.content.Children.map((element, index) => {
//                     if (element.Value ? element.Value.length > 0 : element.Text.length > 0) {
//                         return (
//                             <div
//                                 className="option"
//                                 data-text={element.Text || element.Value}
//                                 data-value={element.Value || element.Text}
//                                 key={element.Value || element.Text}
//                                 name={this.props.content.FieldName}
//                                 onClick={this.handleClickCustomSelect}
//                             >
//                                 {element.Text || element.Value}
//                             </div>
//                         );
//                     }
//                     return null;
//                 })
//             );
//         }
//         return receivedOptions;
//     }

//     renderTooltip() {
//         if (this.props.content.Tooltip) {
//             return <TooltipCustom tooltipText={this.props.content.Tooltip} />;
//         }
//         return null;
//     }

//     renderText() {
//         const { text } = this.state;
//         const { content, value } = this.props;
//         if (text === '') {
//             if (value === '' || value === undefined) {
//                 return content.Placeholder;
//             }
//             return value;
//         }
//         return text;
//     }

//     render() {
//         const { editMode, content, value, selectDefinition, displayValidationMsg } = this.props;
//         const { selectClosed, errorText } = this.state;
//         const selectClass = classNames({
//             'form-group': true,
//             required: content.Required,
//             hidden: !editMode,
//             error: displayValidationMsg && !this.state.valid
//         });

//         return (
//             <fieldset>
//                 <div className={editMode ? 'hidden' : ''}>
//                     <label htmlFor={content.FieldName} key={content.Name}>
//                         {content.Label}
//                     </label>
//                     <p>{value}</p>
//                 </div>
//                 <div className={selectClass} >
//                     <label htmlFor={content.FieldName}>{content.Label}</label>
//                     <div className="formEdit__content">
//                         <div className="aCustomSelect">
//                             <select
//                                 id={content.FieldName}
//                                 name={content.FieldName}
//                                 className="form-control hidden"
//                                 ref={content.FieldName}
//                                 onClick={this.handleClickSelect}
//                                 value={this.state.value}
//                             >
//                                 <option key="placeholder" value="" name={content.FieldName} onClick={this.handleClickCustomSelect}>{content.Placeholder}</option>
//                                 { this.renderOptions() }
//                             </select>

//                             {/*eslint-disable*/}
//                             <div
//                                 id={content.FieldName}
//                                 name={content.FieldName}
//                                 className={`form-control customSelectWrapper aCustomArrow ${selectClosed ? '' : 'aCustomArrow_open'}`}
//                                 ref={content.FieldName}
//                                 onClick={this.handleClickSelect}
//                                 data-value={this.state.value}
//                                 tabIndex={0}
//                             >
//                             {/*eslint-enable*/}
//                                 <p>
//                                     { this.renderText() }
//                                 </p>
//                             </div>

//                             <div className={`custom-options${selectClosed ? '_closed' : ''}`}>
//                                 <div className="custom-options-wrapper">
//                                     {/*eslint-disable*/}
//                                     <div
//                                         className="option"
//                                         key="placeholder"
//                                         data-value=""
//                                         data-text={content.Placeholder}
//                                         onClick={this.handleClickCustomSelect}
//                                         name={content.FieldName}
//                                     >
//                                      {/*eslint-enable*/}
//                                         {content.Placeholder}
//                                     </div>
//                                     { this.renderCustomOptions() }
//                                 </div>
//                             </div>
//                         </div>
//                         {this.renderTooltip()}
//                     </div>

//                     <ErrorBlock errorText={errorText} />
//                 </div>
//             </fieldset>
//         );
//     }
// }

// FilterSelect.defaultProps = {
//     toEnableSave: () => {},
//     errorDataToNull: () => {},
//     value: '',
//     editMode: true,
//     displayValidationMsg: false
// };

// FilterSelect.propTypes = {
//     content: PropTypes.object.isRequired,
//     displayValidationMsg: PropTypes.bool,
//     editMode: PropTypes.bool,
//     toEnableSave: PropTypes.func.isRequired,
//     errorDataToNull: PropTypes.func.isRequired,
//     updateInputValue: PropTypes.func.isRequired,
//     value: PropTypes.string.isRequired
// };
