import React from 'react';
import ReactDOM from 'react-dom';

import Form from './components/Form';

import factory from './../factory';
import passwordIcon from './../form/passwordIcon';

import { iebContentHeight, customEnableEditButton } from '../helpers';
import disableEditBtn from '../form/disableEditBtn';
import enableDisabledBtn from '../form/enableDisabledBtn';

const UISchemaView = {
    name: 'view',
    order: [
        'DescriptionMessage',
        'GenericSuccessField',
        'GenericErrorField',
        'EditButton'
    ]
};
const UISchemaEdit = {
    name: 'edit',
    order: [
        'CurrentPassword',
        'NewPassword',
        'ConfirmNewPassword',
        'GenericErrorField',
        {
            type: 'button-group',
            class: 'formEdit__bottom-wrapper',
            children: [
                'CancelButton',
                'SaveButton'
            ]
        }
    ]
};

class PasswordChangeForm extends Form {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateBeforeSubmit = this.validateBeforeSubmit.bind(this);

        this.state = {
            viewMode: 'view',
            elements: [
                {
                    name: 'CurrentPassword',
                    binding: {
                        name: 'NewPassword',
                        type: '!equal'
                    },
                    value: '',
                    valid: false
                },
                {
                    name: 'NewPassword',
                    binding: {
                        name: 'CurrentPassword',
                        type: '!equal'
                    },
                    value: '',
                    valid: false
                },
                {
                    name: 'ConfirmNewPassword',
                    binding: {
                        name: 'NewPassword',
                        type: 'equal'
                    },
                    value: '',
                    valid: false
                }
            ],
            genericErrorMessage: '',
            genericSuccessMessage: ''
        };

        this.currentForm = {};
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.viewMode === prevState.viewMode) return;

        // fix for bug 2886 = problem with fix height of IEB01
        iebContentHeight(this.currentForm);
        // fix for bug 4000 = problem with enable edit button
        factory(disableEditBtn, document.querySelectorAll('.formEdit__edit'));
        factory(enableDisabledBtn, document.querySelectorAll('.formEdit__cancel'));
    }

    render() {

        this.createFormElements(this.props.jsonSchema, this.props.uiSchema);

        return (
            <div data-tpl="CustomerPasswordChange">
                <div
                    className="formEdit customForm"
                    data-tpl="form"
                    data-module="form"
                    data-module-config=""
                    ref={(form) => { this.currentForm = form; }}
                >
                    <form className="formEdit__form">
                        <div className="row">
                            {this.state.viewMode === 'view' ? <div>{this.description.view}</div> : null}
                            {this.state.viewMode === 'edit' ? <div>{this.description.edit}</div> : null}
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    validateBeforeSubmit() {

        let allowSubmit = false;
        this.state.elements.forEach((element) => {
            allowSubmit = element.valid;
        });

        if (this.refs.CurrentPassword.state.value === this.refs.NewPassword.state.value) {

            allowSubmit = false;
            // console.log('CurrentPassword should be different then NewPassword.');
        } else if (this.refs.NewPassword.state.value !== this.refs.ConfirmNewPassword.state.value) {

            allowSubmit = false;
            // console.log('ConfirmNewPassword does not match with NewPassword.');
        }

        return allowSubmit;
    }

    handleSubmit() {
        if (this.validateBeforeSubmit()) {

            const data = {};
            this.state.elements.forEach((element) => {
                data[element.name] = element.value;
            });

            // console.log(JSON.stringify(data, null, "\t"));

            this.POSTRequest(this.props.jsonSchema.ApiUpdateEndpoint, data, { errorView: 'edit' }, (success) => {

                this.setState(
                    {
                        viewMode: 'view',
                        elements: [
                            {
                                name: 'CurrentPassword',
                                binding: {
                                    name: 'NewPassword',
                                    type: '!equal'
                                },
                                value: '',
                                valid: false
                            },
                            {
                                name: 'NewPassword',
                                binding: {
                                    name: 'CurrentPassword',
                                    type: '!equal'
                                },
                                value: '',
                                valid: false
                            },
                            {
                                name: 'ConfirmNewPassword',
                                binding: {
                                    name: 'NewPassword',
                                    type: 'equal'
                                },
                                value: '',
                                valid: false
                            }
                        ]
                    }
                );
                customEnableEditButton();
            });
        } else {

            this.refs.CurrentPassword.validate();
            this.refs.NewPassword.validate();
            this.refs.ConfirmNewPassword.validate();
        }
    }

    handleButtonPress(event) {

        if (event.object.props.description.FieldName === 'EditButton') {

            this.setState({ viewMode: 'edit' });
        } else if (event.object.props.description.FieldName === 'CancelButton') {

            this.setState({ viewMode: 'view' });
        } else if (event.object.props.description.FieldName === 'SaveButton') {

            this.handleSubmit();
        }
    }
}

export default function (root, JSONSchema) {

    ReactDOM.render(<PasswordChangeForm jsonSchema={JSONSchema} uiSchema={[UISchemaView, UISchemaEdit]} />, root);
}
