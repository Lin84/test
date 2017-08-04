import React from 'react';
import ReactDOM from 'react-dom';
import Form from './components/Form';

import axios from 'axios';
import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from './../loadingCircle';

const UISchemaView = {
    name: 'view',
    order: [
        'Headline',
        'Description',
        'UserName',
        'Email',
        'MandatoryDescription',
        'GenericErrorField',
        'GenericSuccessField',
        'SendButton'
    ]
};
const UISchemaSuccess = {
    name: 'success',
    order: [
        'Headline',
        'SuccessMessage'
    ]
};


class CustomerPasswordForgotten extends Form {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateBeforeSubmit = this.validateBeforeSubmit.bind(this);

        this.state = {
            viewMode: 'view',
            elements: [
                {
                    name: 'UserName',
                    value: '',
                    valid: false
                },
                {
                    name: 'Email',
                    value: '',
                    valid: false
                }
            ],
            genericErrorMessage: '',
            genericSuccessMessage: ''
        };
    }

    render() {

        this.createFormElements(this.props.jsonSchema, this.props.uiSchema);

        return (
            <div data-tpl="CustomerPasswordChange">
                <div className="formEdit customForm" data-tpl="form" data-module="form" data-module-config="">
                    <form className="formEdit__form">
                        <div className="row">
                            {this.state.viewMode === 'view' ? <div>{this.description.view}</div> : null}
                            {this.state.viewMode === 'success' ? <div>{this.description.success}</div> : null}
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    handleSubmit() {

        if (this.validateBeforeSubmit()) {

            const data = {};
            this.state.elements.forEach((element) => {
                data[element.name] = element.value;
            });

            // console.log(JSON.stringify(data, null, "\t"));
            // TODO: Ask Bogdan

            this.POSTRequest(this.props.jsonSchema.ApiUpdateEndpoint, data, { successView: 'success' }, (success) => {

                if (success) {

                    setTimeout(() => {
                        window.location = this.redirect.RedirectUrl;
                    }, 5000);
                }
            });
        } else {

            this.refs.UserName.validate();
            this.refs.Email.validate();
        }
    }

    handleButtonPress(event) {

        if (event.object.props.description.FieldName === 'SendButton') {

            this.handleSubmit();
        }
    }
}

export default function (root, JSONSchema) {

    ReactDOM.render(<CustomerPasswordForgotten
        jsonSchema={JSONSchema}
        uiSchema={[UISchemaView, UISchemaSuccess]}
    />, root);
}
