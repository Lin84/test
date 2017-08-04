import React from 'react';

import { TextField, PasswordField } from './TextField';
import { Button, Checkbox, Select } from './AdditionalComponents';
import { Text, SuccessField, GenericErrorField, GenericSuccessField } from './Miscellaneous';

import axios from 'axios';
import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from './../../loadingCircle';

export default class Form extends React.Component {

    constructor(props) {
        super(props);

        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.handleElementChange = this.handleElementChange.bind(this);
        this.passFormState = this.passFormState.bind(this);
        this.POSTRequest = this.POSTRequest.bind(this);
    }


    /**
     *
     * @returns {{}}
     */
    passFormState() {

        return this.state.elements;
    }

    /**
     * Creates array of React elements for specified 'views' in UI Schema, based on JSON Schema and UI Schema.
     * Stores result in this.description, from where the elements can be accessed for further rendering.
     *
     * @param {object} json JSON Schema object.
     * @param {object} ui UI Schema object.
     */
    createFormElements(json, ui) {

        const schemas = {};
        let redirect = {};

        ui.forEach((schema) => {

            const array = [];

            schema.order.forEach((option) => {

                if (option.type) {

                    const elementGroup = [];

                    if (option.type === 'button-group') {

                        option.children.forEach((child) => {

                            json.Children.forEach((element) => {

                                if (child === element.FieldName) {
                                    const type = element.FieldName === 'SaveButton'
                                        ? 'submit'
                                        : 'button';
                                    const reactElement =
                                        (<Button
                                            key={element.FieldName}
                                            ref={element.FieldName}
                                            description={element}
                                            type={type}
                                            handlePress={this.handleButtonPress}
                                        />);

                                    elementGroup.push(reactElement);
                                }
                            });
                        });

                        const reactElement = <div className={option.class}>{elementGroup}</div>;
                        array.push(reactElement);
                    } else if (option.type === 'bootstrap-row-group') {

                        option.children.forEach((child) => {

                            json.Children.forEach((element) => {

                                if (child === element.FieldName) {

                                    const reactElement =
                                        (<TextField
                                            key={element.FieldName}
                                            ref={element.FieldName}
                                            description={element}
                                            elementRefs={this.passFormState}
                                            handleChange={this.handleElementChange}
                                        />);

                                    elementGroup.push(reactElement);
                                }
                            });
                        });

                        const reactElement =
                            (<div className="row">
                                {elementGroup.map((item) =>
                                    <div className={option.class}>{item}</div>
                                )}
                            </div>);

                        array.push(reactElement);
                    } else if (option.type === 'ui:h2') {

                        option.children.forEach((child) => {

                            json.Children.forEach((element) => {

                                if (child === element.FieldName) {

                                    const reactElement =
                                        (<Text
                                            className="FancyLink"
                                            key={element.FieldName}
                                            ref={element.FieldName}
                                            description={element}
                                        />
                                        );

                                    elementGroup.push(reactElement);
                                }
                            });
                        });

                        const reactElement = <h2 className={option.class}>{elementGroup}</h2>;
                        array.push(reactElement);
                    } else if (option.type === 'ui:h3') {

                        option.children.forEach((child) => {

                            json.Children.forEach((element) => {

                                if (child === element.FieldName) {

                                    const reactElement =
                                        (<Text
                                            className="FancyLink"
                                            key={element.FieldName}
                                            ref={element.FieldName}
                                            description={element}
                                        />);

                                    elementGroup.push(reactElement);
                                }
                            });
                        });

                        const reactElement = <h3 className={option.class}>{elementGroup}</h3>;
                        array.push(reactElement);
                    } else if (option.type === 'ui:lin01') {

                        const reactElement = <hr data-tpl="lin01" />;

                        array.push(reactElement);
                    }
                } else {

                    json.Children.forEach((element) => {

                        // Describes rendering of Basic Input.
                        if (element.ControlType === 'Text') {

                            if (option === element.FieldName) {

                                const reactElement =
                                    (<TextField
                                        key={element.FieldName}
                                        ref={element.FieldName}
                                        description={element}
                                        elementRefs={this.passFormState}
                                        handleChange={this.handleElementChange}
                                    />);

                                array.push(reactElement);
                            }
                        } else if (element.ControlType === 'Password') {
                        // Describes rendering of Password Input.
                            if (option === element.FieldName) {

                                const reactElement =
                                    (<PasswordField
                                        key={element.FieldName}
                                        ref={element.FieldName}
                                        description={element}
                                        elementRefs={this.passFormState}
                                        handleChange={this.handleElementChange}
                                    />);

                                array.push(reactElement);
                            }
                        } else if (element.ControlType === 'Select') {

                            if (option === element.FieldName) {

                                const reactElement =
                                    (<Select
                                        key={element.FieldName}
                                        ref={element.FieldName}
                                        description={element}
                                        handleChange={this.handleElementChange}
                                    />);

                                array.push(reactElement);
                            }
                        } else if (element.ControlType === 'StaticText') {
                            // Describes rendering of simple Text Element.
                            if (option === element.FieldName) {

                                const reactElement =
                                    (<Text
                                        className="FancyLink"
                                        key={element.FieldName}
                                        ref={element.FieldName}
                                        description={element}
                                    />);

                                array.push(reactElement);
                            }
                        } else if (element.ControlType === 'Checkbox') {
                            // Describes rendering of Checkbox.
                            if (option === element.FieldName) {

                                const reactElement =
                                    (<Checkbox
                                        className="FancyLink"
                                        key={element.FieldName}
                                        ref={element.FieldName}
                                        description={element}
                                        handleChange={this.handleElementChange}
                                    />);

                                array.push(reactElement);
                            }
                        } else if (element.ControlType === 'Button') {
                            // Describes rendering of Button.
                            if (option === element.FieldName) {
                                const type = element.FieldName === 'SaveButton'
                                    ? 'submit'
                                    : 'button';
                                const reactElement =
                                    (<div className="formEdit__bottom-wrapper" key={element.FieldName}>
                                        <Button
                                            key={element.FieldName}
                                            ref={element.FieldName}
                                            description={element}
                                            type={type}
                                            handlePress={this.handleButtonPress}
                                        />
                                    </div>);

                                array.push(reactElement);
                            }
                        } else if (element.ControlType === 'Redirect') {
                            // Describes rendering of Redirect.
                            redirect = {
                                RedirectUrl: element.RedirectUrl
                            };
                        } else if (option === element.FieldName) {
                            // Other stuff..
                            const reactElement = <div key={element.FieldName}>{element.FieldName}</div>;

                            array.push(reactElement);
                        }
                    });
                }

                if (option === 'GenericErrorField') {

                    const reactElement =
                        (<GenericErrorField
                            key={'GenericErrorField'}
                            message={this.state.genericErrorMessage}
                        />);

                    array.push(reactElement);
                } else if (option === 'GenericSuccessField') {

                    const reactElement =
                        (<GenericSuccessField
                            key={'GenericSuccessField'}
                            message={this.state.genericSuccessMessage}
                        />);

                    array.push(reactElement);
                } else if (option === 'SuccessField') {

                    const reactElement =
                        (<SuccessField
                            key={'SuccessField'}
                            message={this.props.jsonSchema.SuccessMessage}
                        />);

                    array.push(reactElement);
                }
            });

            schemas[schema.name] = array;
        });

        this.description = schemas;
        this.redirect = redirect;
    }

    // @returns {boolean}
    validateBeforeSubmit() {

        const allowSubmit = true;
        for (let i = 0; i < this.state.elements.length; i += 1) {

            if (this.state.elements[i].valid === false) {

                return false;
            }
        }

        return allowSubmit;
    }

    /**
     * Performs ajax POST request to the specified URL.
     *
     * @param {string} url
     * @param {object} data
     * @param {object} options
     * @param {function} callback
     */
    POSTRequest(url, data, options, callback) {

        createLoadingCircle();
        showLoadingCircle();

        defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';

        axios(url, {
            method: 'POST',
            headers: defaultHeaders,
            data: JSON.stringify(data)
        })
            .then(() => {

                let successView = this.state.viewMode;

                if (options.successView) {

                    successView = options.successView;
                }

                this.setState({
                    genericSuccessMessage: this.props.jsonSchema.SuccessMessage,
                    genericErrorMessage: '',
                    viewMode: successView
                });

                removeLoadingCircle();

                if (callback) {

                    callback(true);
                }
            })
            .catch(error => {

                let errorView = this.state.viewMode;

                if (options.errorView) {

                    errorView = options.errorView;
                }

                switch (error.response.status) {
                    case 500: {
                        const messageResponse = error.response.data.Message || 'We are really sorry,';
                        const exceptionMessageResponse = error.response.data.ExceptionMessage || 'please come back later.';
                        this.setState({
                            genericErrorMessage: `${messageResponse} ${exceptionMessageResponse}`,
                            viewMode: errorView
                        });
                        break;
                    }

                    case 400: {
                        const tempResponse = error.response.data.ModelState;

                        Object.keys(tempResponse).map((key) => {
                            if (key === '') {
                                this.setState({
                                    genericErrorMessage: tempResponse[key] || 'We are really sorry',
                                    viewMode: errorView
                                });
                            }
                            return null;
                        });

                        this.setState({ errorData: error.response.data.ModelState });
                        break;
                    }

                    default: {
                        this.setState({
                            genericErrorMessage: this.props.jsonSchema.NoConnectionErrorMessage,
                            viewMode: errorView
                        });
                    }
                }

                removeLoadingCircle();

                if (callback) {
                    callback(false);
                }
                return null;
            });
    }

    // @param event
    handleButtonPress(event) {
        // console.log(event);
        // fix eslint error
        () => { this; };
    }

    // Handles Element Change, update Form elements state.
    // @param event

    handleElementChange(event) {
        const elements = [];
        // console.log(this.state.elements);
        this.state.elements.forEach((element) => {
            // console.log(this.refs);

            // TO REMOVE:
            // for (const reference in this.refs) {

            //     if (element.name === reference) {

            //         const temp = {};
            //         temp.name = element.name;
            //         temp.binding = element.binding;
            //         temp.value = this.refs[element.name].state.value;
            //         temp.valid = this.refs[element.name].state.valid;

            //         elements.push(temp);
            //     }
            // }

            /* eslint-disable */
            Object.keys(this.refs).map((key) => {
                if (element.name === key) {
                    const temp = {};
                    temp.name = element.name;
                    temp.binding = element.binding;
                    temp.value = this.refs[element.name].state.value;
                    temp.valid = this.refs[element.name].state.valid;

                    elements.push(temp);
                }
                return elements;
            });
            /* eslint-enable */

        });

        this.setState({ elements });
    }

    render() {

        this.createFormElements(this.props.jsonSchema, this.props.uiSchema);

        return <div>Basic Form component</div>;
    }
}
