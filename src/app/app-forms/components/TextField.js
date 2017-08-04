import React from 'react';

import factory from './../../factory';
import passwordIcon from './../../form/passwordIcon';

import { Tooltip, ErrorBlock } from './Miscellaneous';

export class TextField extends React.Component {

    constructor(props) {
        super(props);

        this.validate = this.validate.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);

        this.state = {
            valid: false,
            value: '',
            error: false,
            errorText: ''
        };
    }

    changeHandler(ev) {

        const validatedState = this.validate(ev.target.value);

        this.setState(validatedState, () => {

            this.props.handleChange({ event: ev, element: this });
        });
    }

    validate(ev) {

        const { description, elementRefs } = this.props;

        let value = this.state.value;
        if (ev) {
            value = ev;
        } else if (ev === '') {
            value = ev;
        }

        const newState = {
            errorText: '',
            error: false,
            valid: true,
            value
        };

        // Check if required
        if (description.Required) {

            if (value.length < 1) {

                const req = {
                    errorText: description.RequiredWarningMessage,
                    error: true,
                    valid: false,
                    value
                };

                this.setState(req);

                return req;
            }
        }

        // Check related fields
        if (description.IsEqualToField || description.IsNotEqualToField) {

            const references = elementRefs();

            let temporary;

            references.forEach((el) => {

                if (el.name === description.FieldName && el.binding) {
                    temporary = el;
                }
            });

            if (temporary) {

                let binding;
                references.forEach((temp) => {

                    if (temp.name === temporary.binding.name) {
                        binding = temp;
                    }
                });

                if (temporary.binding.type === 'equal') {

                    if (binding.value !== value) {

                        return {
                            value,
                            valid: false,
                            errorText: description.IsEqualToFieldWarning,
                            error: true
                        };
                    }
                } else if (temporary.binding.type === '!equal') {

                    if (binding.value === value) {

                        return {
                            value,
                            valid: false,
                            errorText: description.IsNotEqualToFieldWarning,
                            error: true
                        };
                    }
                }
            }
        }

        // Check if correct ExactLength
        if (description.ExactLength) {

            if (value.length !== 0 && value.length !== description.ExactLength) {

                return {
                    errorText: description.ExactLengthWarning,
                    error: true,
                    valid: false,
                    value
                };
            }
        }

        // Check if correct pattern
        if (description.Pattern) {

            const reg = new RegExp(description.Pattern);

            if (!reg.test(value) && value.length !== 0) {

                return {
                    errorText: description.PatternWarning,
                    error: true,
                    valid: false,
                    value
                };
            }
        }

        return newState;
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
            <div>
                <div
                    className={`form-group ${this.state.error ? 'error' : ''} ${description.Required ? 'required' : ''}`}
                    data-tpl="cde-input"
                >
                    <label htmlFor={description.Name}>{description.Label}</label>
                    <div className="formEdit__content">
                        <div className="input-wrapper">
                            <span className="icon icon_eye_closed color-icon-3" />
                            <input
                                id={description.Name}
                                name={description.Name}
                                type="text"
                                spellCheck="false"
                                className="form-control form-control"
                                autoComplete="off"
                                autoCorrect="off"
                                placeholder={description.Placeholder}
                                maxLength={description.MaxLength === 0 ? null : description.MaxLength}
                                onChange={this.changeHandler}
                                value={this.props.value}
                            />
                        </div>
                        {this.renderTooltip()}
                    </div>
                    <ErrorBlock errorText={this.state.errorText} />
                </div>
            </div>
        );
    }
}

export class PasswordField extends React.Component {

    constructor(props) {
        super(props);

        this.changeHandler = this.changeHandler.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);

        this.state = {
            valid: false,
            value: '',
            error: false,
            errorText: ''
        };
    }

    componentDidMount() {

        factory(passwordIcon, document.querySelectorAll('input[type="password"]'));
    }

    changeHandler(ev) {

        const validatedState = this.validate(ev.target.value);

        this.setState(validatedState, () => {

            this.props.handleChange({ event: ev, element: this });
        });
    }

    validate(ev) {

        const { description, elementRefs } = this.props;

        let value = this.state.value;
        if (ev || ev === '') {
            value = ev;
        }

        const newState = {
            errorText: '',
            error: false,
            valid: true,
            value
        };

        // Check if required
        if (description.Required) {

            if (value.length < 1) {

                const req = {
                    errorText: description.RequiredWarningMessage,
                    error: true,
                    valid: false,
                    value
                };

                this.setState(req);

                return req;
            }
        }

        // Check related fields
        if (description.IsEqualToField || description.IsNotEqualToField) {

            const references = elementRefs();

            let temporary;

            references.forEach((el) => {

                if (el.name === description.FieldName && el.binding) {
                    temporary = el;
                }
            });

            if (temporary) {

                let binding;
                references.forEach((temp) => {

                    if (temp.name === temporary.binding.name) {
                        binding = temp;
                    }
                });

                if (temporary.binding.type === 'equal') {

                    if (binding.value !== value) {

                        // TODO
                        if (!ev) {

                            this.setState({
                                value,
                                valid: false,
                                errorText: description.IsEqualToFieldWarning,
                                error: true
                            });
                        }

                        return {
                            value,
                            valid: false,
                            errorText: description.IsEqualToFieldWarning,
                            error: true
                        };
                    }
                } else if (temporary.binding.type === '!equal') {

                    if (binding.value === value) {

                        // TODO
                        if (!ev) {

                            this.setState({
                                value,
                                valid: false,
                                errorText: description.IsNotEqualToFieldWarning,
                                error: true
                            });
                        }

                        return {
                            value,
                            valid: false,
                            errorText: description.IsNotEqualToFieldWarning,
                            error: true
                        };
                    }
                }
            }
        }

        // Check if correct pattern
        if (description.Pattern) {

            const reg = new RegExp(description.Pattern);

            if (!reg.test(value) && value.length !== 0) {

                return {
                    errorText: description.PatternWarning,
                    error: true,
                    valid: false,
                    value
                };
            }
        }

        return newState;
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
            <div>
                <div
                    className={`form-group ${this.state.error ? 'error' : ''} ${description.Required ? 'required' : ''}`}
                    data-tpl="cde-input"
                >
                    <label htmlFor={description.Name}>{description.Label}</label>
                    <div className="formEdit__content">
                        <div className="input-wrapper">
                            <span className="icon icon_eye_closed color-icon-3" />
                            <input
                                id={description.Name}
                                name={description.Name}
                                type="password"
                                data-tpl="innogy-password"
                                spellCheck="false"
                                className="form-control form-control"
                                autoComplete="off"
                                autoCorrect="off"
                                placeholder={description.Placeholder}
                                maxLength={description.MaxLength === 0 ? null : description.MaxLength}
                                onChange={this.changeHandler}
                                value={this.props.value}
                            />
                        </div>
                        {this.renderTooltip()}
                    </div>
                    <ErrorBlock errorText={this.state.errorText} />
                </div>
            </div>
        );
    }
}
