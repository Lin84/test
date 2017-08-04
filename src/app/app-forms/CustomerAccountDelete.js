import React from 'react';
import ReactDOM from 'react-dom';

import Form from './components/Form';
import { iebContentHeight } from '../helpers';
import disableEditBtn from '../form/disableEditBtn';
import enableDisabledBtn from '../form/enableDisabledBtn';
import factory from '../factory';

const UISchemaView = {
    name: 'view',
    order: [
        'DescriptionMessage',
        'EditButton'
    ]
};
const UISchemaEdit = {
    name: 'edit',
    order: [
        'CurrentPassword',
        'Reasons',
        'GenericErrorField',
        {
            type: 'button-group',
            class: 'formEdit__bottom-wrapper',
            children: [
                'CancelButton',
                'NextButton'
            ]
        }
    ]
};
const UISchemaApply = {
    name: 'apply',
    order: [
        'ConfirmMessage',
        'GenericErrorField',
        'GenericSuccessField',
        {
            type: 'button-group',
            class: 'formEdit__bottom-wrapper',
            children: [
                'DeleteButton',
                'CancelButton'
            ]
        }
    ]
};

class CustomerAccountDelete extends Form {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateBeforeSubmit = this.validateBeforeSubmit.bind(this);

        this.state = {
            viewMode: 'view',
            elements: [
                {
                    name: 'CurrentPassword',
                    value: '',
                    valid: false
                },
                {
                    name: 'Reasons',
                    value: '',
                    valid: false
                }
            ],
            genericErrorMessage: '',
            genericSuccessMessage: ''
        };

        this.currentForm = {};
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
                            {this.state.viewMode === 'apply' ? <div>{this.description.apply}</div> : null}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
    componentDidUpdate() {
        // fix for bug 2886 = problem with fix height of IEB01
        iebContentHeight(this.currentForm);
        // fix for bug 4000 = problem with enable edit button
        factory(disableEditBtn, document.querySelectorAll('.formEdit__edit'));
        factory(enableDisabledBtn, document.querySelectorAll('.formEdit__cancel'));
    }

    validatePassword() {

        const allowSubmit = this.validateBeforeSubmit();

        if (allowSubmit) {

            const data = {};
            this.state.elements.forEach((element) => {
                if (element.name === 'CurrentPassword') {
                    data[element.name] = element.value;
                }
            });

            // console.log(JSON.stringify(data, null, '\t'));

            this.POSTRequest(this.props.jsonSchema.ApiValidatePasswordEndpoint, data, {}, (success) => {

                if (success) {

                    this.setState({
                        genericSuccessMessage: '',
                        genericErrorMessage: '',
                        viewMode: 'apply'
                    });
                }
            });

            return true;
        }

        this.refs.CurrentPassword.validate();
        this.refs.Reasons.validate();

        return false;
    }

    handleSubmit() {

        const data = {};
        this.state.elements.forEach((element) => {
            data[element.name] = element.value;
        });

        // console.log(JSON.stringify(data, null, '\t'));

        this.POSTRequest(this.props.jsonSchema.ApiUpdateEndpoint, data, {}, (success) => {

            if (success) {

                // this.refs.DeleteButton.props.description.Class = this.refs.DeleteButton.props.description.Class + ' disabled';
                this.refs.DeleteButton.props.description.Class = `${this.refs.DeleteButton.props.description.Class} disabled`;
                this.refs.DeleteButton.forceUpdate();
                // this.refs.CancelButton.props.description.Class = this.refs.CancelButton.props.description.Class + ' disabled';
                this.refs.CancelButton.props.description.Class = `${this.refs.CancelButton.props.description.Class} disabled`;
                this.refs.CancelButton.forceUpdate();

                setTimeout(() => {
                    window.location = this.redirect.RedirectUrl;
                }, 5000);
            }
        });
    }

    handleButtonPress(event) {

        if (event.object.props.description.FieldName === 'EditButton') {

            this.setState({ viewMode: 'edit', genericErrorMessage: '' });
        } else if (event.object.props.description.FieldName === 'CancelButton') {

            this.setState({
                viewMode: 'view',
                elements: [
                    {
                        name: 'CurrentPassword',
                        value: '',
                        valid: false
                    },
                    {
                        name: 'Reasons',
                        value: '',
                        valid: false
                    }
                ],
                genericErrorMessage: ''
            });
        } else if (event.object.props.description.FieldName === 'NextButton') {

            this.validatePassword();
        } else if (event.object.props.description.FieldName === 'DeleteButton') {

            this.handleSubmit();
        }
    }
}

export default function (root, JSONSchema) {

    ReactDOM.render(<CustomerAccountDelete
        jsonSchema={JSONSchema}
        uiSchema={[UISchemaView, UISchemaEdit, UISchemaApply]}
    />, root);
}
