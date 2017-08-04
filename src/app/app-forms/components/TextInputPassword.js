import React, { PropTypes } from 'react';

import TooltipCustom from './TooltipCustom';
import ErrorBlock from './ErrorBlock';

export default class TextInputPassword extends React.Component {
    constructor() {
        super();

        this.state = {
            errorText: 'Something is wrong',
            valid: true,
            empty: true
        };

        this.renderTooltip = this.renderTooltip.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkInput = this.checkInput.bind(this);
        this.renderEditVersion = this.renderEditVersion.bind(this);
        this.renderViewVersion = this.renderViewVersion.bind(this);
        // this.handleOnblur = this.handleOnblur.bind(this);
    }

    componentDidMount() {
        /* eslint-disable */
        if (this.props.content.Required) {
            const inputText = this.state.value;
            if (inputText < 1) {
                this.setState({
                    errorText: this.props.content.RequiredWarningMessage,
                    valid: false
                });
            }
        }
        /* eslint-enable */
    }

// update the error msg after post request gave the error msg and update the valid state to false
    componentWillReceiveProps(nextProps) {
        if (nextProps.errorData) {
            this.setState({
                errorText: nextProps.errorData,
                valid: false
            });
            this.props.errorDataToNull();
        }

        if (nextProps.editMode === false) {
            this.setState({
                valid: true
            });
        }

        if (nextProps.showPasswordError === true) {
            if (nextProps.passwordsEqual === false && nextProps.passwordValue !== '') {
                this.setState({
                    errorText: this.props.content.IsEqualToFieldWarning,
                    valid: false
                });
            } else if (nextProps.value === '') {
                this.setState({
                    errorText: this.props.content.RequiredWarningMessage,
                    valid: false
                });
            } else {
                this.setState({
                    errorText: this.props.content.IsEqualToFieldWarning,
                    valid: true
                });
            }
        }
    }

    checkInput() {
        const { content } = this.props;
        const inputText = content.FieldName;

        // console.log(inputText, inputText.length, content.RequiredWarningMessage);

        // ** check if required: ** //
        if (content.Required) {
            if (inputText.length < 1) {
                return this.setState({
                    errorText: content.RequiredWarningMessage,
                    valid: false
                });
            }
            return (
                this.setState({
                    errorText: content.RequiredWarningMessage,
                    valid: false
                })
            );
        }

        // ** check if correct ExactLength ** //
        if (content.ExactLength) {
            if (inputText.length === 0) {
                return (
                    this.setState({
                        errorText: 'Something is wrong',
                        valid: true
                    })
                );
            }

            if (inputText.length !== 0 && inputText.length !== content.ExactLength) {
                return (
                    this.setState({
                        errorText: content.ExactLengthWarning,
                        valid: false
                    })
                );
            }
            return (
                this.setState({
                    errorText: 'Something is wrong',
                    valid: true
                })
            );
        }

        // ** check if correct pattern ** //
        if (content.Pattern) {
            const reg = new RegExp(content.Pattern);
            if (!reg.test(inputText) && inputText.length !== 0) {
                return this.setState({
                    errorText: content.PatternWarning,
                    valid: false
                });
            }
            return (
                this.setState({
                    errorText: 'Something is wrong',
                    valid: true
                })
            );
        }
        return null;
    }

    handleChange(event) {
        const { updateInputText, enableSave, content } = this.props;
        const inputText = event.target.value.replace(/ /g, '');

        updateInputText(event);
        enableSave();

        if (inputText.length !== 0) {
            this.setState({
                empty: false
            });
        } else {
            this.setState({
                empty: true
            });
        }

        // check if required:
        if (this.props.content.Required) {
            const inputText = event.target.value.replace(/ /g, '');
            if (inputText < 1) {
                return this.setState({
                    errorText: this.props.content.RequiredWarningMessage,
                    valid: false
                });
            }
            return (
                this.setState({
                    errorText: 'Something is wrong',
                    valid: true
                })
            );
        }

        // ** ExactLength **//
        if (this.props.content.ExactLength) {
            // console.log(this.props.content.ExactLength);
            const inputText = event.target.value.replace(/ /g, '');
            if (inputText.length === 0) {
                // console.log('length 0');
                return (
                    this.setState({
                        errorText: 'Something is wrong',
                        valid: true
                    })
                );
            }
            // console.log(inputText.length +': ' +typeof(inputText) + ': ' + inputText);
            if (inputText.length !== 0 && inputText.length !== this.props.content.ExactLength) {
                return (
                    this.setState({
                        errorText: this.props.content.ExactLengthWarning,
                        valid: false
                    })
                );
            }
            return (
                this.setState({
                    errorText: 'Something is wrong',
                    valid: true
                })
            );
        }

        // ** check if correct pattern ** //
        if (this.props.content.Pattern) {
            const inputText = event.target.value.replace(/ /g, '');
            const reg = new RegExp(this.props.content.Pattern);
            if (!reg.test(inputText) && inputText.length !== 0) {
                return this.setState({
                    errorText: this.props.content.PatternWarning,
                    valid: false
                });
            }
            return (
                this.setState({
                    errorText: 'Something is wrong',
                    valid: true
                })
            );
        }

        return null;
    }

    renderTooltip() {
        if (this.props.content.Tooltip) {
            return <TooltipCustom tooltipText={this.props.content.Tooltip} />;
        }
        return null;
    }

    renderEditVersion() {
        return (
            <div
                className={`form-group ${this.state.valid ? '' : 'error'} ${this.props.content.Required ? 'required' : ''}`}
                data-tpl="cde-input"
            >
                <label htmlFor={this.props.content.FieldName}>{this.props.content.Label}</label>
                <div className="formEdit__content">
                    <div className="input-wrapper">
                        <span className="icon icon_eye_closed color-icon-3" />
                        <input
                            id={this.props.content.FieldName}
                            name={this.props.content.FieldName}
                            type="password"
                            className="form-control form-control"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            placeholder={this.props.content.Placeholder}
                            maxLength={this.props.content.MaxLength === 0 ? null : this.props.content.MaxLength}
                            onChange={this.handleChange}
                            onKeyPress={this.props.onKeyPress}
                            value={this.props.value}
                            ref={this.props.content.FieldName}
                        />
                    </div>
                    {this.renderTooltip()}
                </div>
                <ErrorBlock errorText={this.state.errorText} />
            </div>
        );
    }

    renderViewVersion() {
        return (
            <div>
                <label htmlFor={this.props.content.FieldName} key={this.props.content.FieldName}>
                    {this.props.content.Label}
                </label>
                <p>{this.props.value}</p>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.editMode ? this.renderEditVersion() : this.renderViewVersion()}
            </div>
        );
    }
}

TextInputPassword.propTypes = {
    onKeyPress: PropTypes.func.isRequired
};

TextInputPassword.defaultProps = {
    onKeyPress: () => {}
};
