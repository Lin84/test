import React from 'react';

import TooltipCustom from './TooltipCustom';
import ErrorBlock from './ErrorBlock';

export default class Input extends React.Component {
    constructor(props) {
        super(props);

        this.renderTooltip = this.renderTooltip.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkInput = this.checkInput.bind(this);
        // this.renderEditVersion = this.renderEditVersion.bind(this);
        // this.renderViewVersion = this.renderViewVersion.bind(this);

        this.state = {
            errorText: 'Something is wrong',
            valid: true,
            empty: true
        };

    }


//* * for the business logic related to CustomerAddress form, to validate the input if send to mail box is checked**//
    componentWillMount() {
        if (this.props.content.FieldName === 'Mailbox') {
            if (this.props.value) {
                const inputText = this.props.value.replace(/ /g, '');
                if (inputText.length < 1) {
                    this.setState({
                        errorText: this.props.content.RequiredWarningMessage,
                        valid: false
                    });
                }
            } else {
                this.setState({
                    errorText: this.props.content.RequiredWarningMessage,
                    valid: false
                });
            }
        }
    }

//* * update the error msg after post request gave the error msg and update the valid state to false **//
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
    }

/* eslint-disable */
    checkInput() {

        const { content } = this.props;
        const inputText = content.FieldName;

        // console.log(inputText, inputText.length, content.Required, content.RequiredWarningMessage);

        //* * check if required: **//
        if (content.Required) {
            if (inputText.length < 1) {
                return this.setState({
                    errorText: content.RequiredWarningMessage,
                    valid: false
                });
            }
            this.setState({
                errorText: content.RequiredWarningMessage,
                valid: false
            });

        }

        // ** check if correct ExactLength **//
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
            } else {
                this.setState({
                    errorText: 'Something is wrong',
                    valid: true
                });
            }
        }

        //* * check if correnct pattern **//
        if (content.Pattern) {
            const reg = new RegExp(content.Pattern);
            if (!reg.test(inputText) && inputText.length !== 0) {
                return this.setState({
                    errorText: content.PatternWarning,
                    valid: false
                });
            }
            this.setState({
                errorText: 'Something is wrong',
                valid: true
            });

        }
    }
/* eslint-enable */

/* eslint-disable */
    handleChange(event) {
        const { updateInputText, enableSave, content } = this.props;
        const inputText = event.target.value.replace(/ /g,'');

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

        //* * check if required: **//
        if (content.Required) {
            if (inputText.length < 1) {
                return this.setState({
                    errorText: content.RequiredWarningMessage,
                    valid: false
                });
            }
            this.setState({
                errorText: 'Something is wrong',
                valid: true
            });

        }

        // ** check if correct ExactLength **//
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
            } else {
                this.setState({
                    errorText: 'Something is wrong',
                    valid: true
                });
            }
        }

        //* * check if correnct pattern **//
        if (content.Pattern) {
            const reg = new RegExp(content.Pattern);
            if (!reg.test(inputText) && inputText.length !== 0) {
                return this.setState({
                    errorText: content.PatternWarning,
                    valid: false
                });
            }
            this.setState({
                errorText: 'Something is wrong',
                valid: true
            });

        }

    }
/* eslint-enable */

    renderTooltip() {
        if (this.props.content.Tooltip) {
            return <TooltipCustom tooltipText={this.props.content.Tooltip} />;
        }
        return null;
    }

    render() {
        const { content, value } = this.props;

        return (
            <div>
                <div className={this.props.editMode ? 'hidden' : ''}>
                    <label key={content.Label} htmlFor={content.FieldName}>
                        {content.Label}
                    </label>
                    <p>{value}</p>
                </div>

                <div
                    className={`form-group ${this.state.valid ? '' : 'error'} ${content.Required ? 'required' : ''} ${this.props.editMode ? '' : 'hidden'}`
                    }
                    data-tpl="cde-input"
                >
                    <label htmlFor={content.FieldName}>{content.Label}</label>
                    <div className="formEdit__content">
                        <input
                            id={content.FieldName}
                            name={content.FieldName}
                            type="text"
                            className="form-control"
                            placeholder={content.Placeholder}
                            onChange={this.handleChange}
                            value={value}
                            ref={content.FieldName}
                            maxLength={content.MaxLength === 0 ? null : content.MaxLength}
                        />
                        {this.renderTooltip()}
                    </div>
                    <ErrorBlock errorText={this.state.errorText} />
                </div>
            </div>
        );
    }
}
