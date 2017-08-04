import React from 'react';
import ReactDOM from 'react-dom';

import Form from './components/Form';
import { iebContentHeight } from '../helpers';

const UISchemaView = {
    name: 'view',
    order: [
        'Headline',
        'Password',
        'ConfirmNewPassword',
        'MandatoryDescription',
        'GenericErrorField',
        'ChangePasswordButton'
    ]
};
const UISchemaSuccess = {
    name: 'success',
    order: [
        'Headline',
        'SuccessMessage'
    ]
};

class CustomerResetPassword extends Form {
    static getUrlParameter(name) {
        const url = window.location.href;
        const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
        const results = regex.exec(url);

        if (!results) {
            return null;
        }

        if (!results[2]) {
            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateBeforeSubmit = this.validateBeforeSubmit.bind(this);

        this.state = {
            viewMode: 'view',
            elements: [
                {
                    name: 'Password',
                    value: '',
                    valid: false
                },
                {
                    name: 'ConfirmNewPassword',
                    binding: {
                        name: 'Password',
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

    componentDidUpdate() {
        // fix for bug 2886 = problem with fix height of IEB01
        iebContentHeight(this.currentForm);
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
                            {this.state.viewMode === 'success' ? <div>{this.description.success}</div> : null}
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

        if (this.refs.Password.state.value !== this.refs.ConfirmNewPassword.state.value) {

            allowSubmit = false;
        }

        return allowSubmit;
    }

    handleSubmit() {

        if (this.validateBeforeSubmit()) {

            const data = {};
            this.state.elements.forEach((element) => {
                data[element.name] = element.value;
            });

            data.token = CustomerResetPassword.getUrlParameter('r');

            // console.log(JSON.stringify(data, null, '\t'));

            this.POSTRequest(this.props.jsonSchema.ApiUpdateEndpoint, data, { successView: 'success' }, (success) => {

                if (success) {

                    setTimeout(() => {
                        window.location = this.redirect.RedirectUrl;
                    }, 5000);
                }
            });
        } else {

            this.refs.Password.validate();
            this.refs.ConfirmNewPassword.validate();
        }
    }

    handleButtonPress(event) {

        if (event.object.props.description.FieldName === 'ChangePasswordButton') {

            this.handleSubmit();
        }
    }
}

export default function (root, JSONSchema) {

    ReactDOM.render(<CustomerResetPassword
        jsonSchema={JSONSchema}
        uiSchema={[UISchemaView, UISchemaSuccess]}
    />, root);
}
