import React from 'react';
import ReactDOM from 'react-dom';

import Form from './components/Form';

const UISchemaView = {
    name: 'view',
    order: [
        'Headline1',
        'Description',
        'SubDescription1',
        'Headline2',
        'PersonalDataDescription',
        {
            type: 'bootstrap-row-group',
            class: 'col-md-6',
            children: [
                'OrganisationName1',
                'OrganisationName2'
            ]
        },
        {
            type: 'bootstrap-row-group',
            class: 'col-xs-12',
            children: [
                'ContractId'
            ]
        },
        {
            type: 'ui:lin01'
        },
        'Headline3',
        'LoginDetailsDescription',
        {
            type: 'bootstrap-row-group',
            class: 'col-md-6',
            children: [
                'Email',
                'Username'
            ]
        },
        {
            type: 'bootstrap-row-group',
            class: 'col-md-6',
            children: [
                'Password',
                'ConfirmPassword'
            ]
        },
        {
            type: 'ui:lin01'
        },
        'TermsAndConditionsAccepted',
        'RequiresOnlineInvoices',
        'AgreeReceivePromotions',
        {
            type: 'ui:lin01'
        },
        'DataPrivacyHeader',
        'DataPavicyDescription',
        'MandatoryFields',
        'GenericErrorField',
        'SaveButton'
    ]
};

class RegistrationForm extends Form {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateBeforeSubmit = this.validateBeforeSubmit.bind(this);

        this.state = {
            viewMode: 'view',
            elements: [
                {
                    name: 'OrganisationName1',
                    value: '',
                    valid: false
                },
                {
                    name: 'OrganisationName2',
                    value: '',
                    valid: false
                },
                {
                    name: 'ContractId',
                    value: '',
                    valid: false
                },
                {
                    name: 'Email',
                    value: '',
                    valid: false
                },
                {
                    name: 'Username',
                    value: '',
                    valid: false
                },
                {
                    name: 'Password',
                    value: '',
                    valid: false
                },
                {
                    name: 'ConfirmPassword',
                    binding: {
                        name: 'Password',
                        type: 'equal'
                    },
                    value: '',
                    valid: false
                },
                {
                    name: 'TermsAndConditionsAccepted',
                    value: '',
                    valid: false
                },
                {
                    name: 'RequiresOnlineInvoices',
                    value: '',
                    valid: false
                },
                {
                    name: 'AgreeReceivePromotions',
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
                            {this.description.view}
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

            // console.log(JSON.stringify(data, null, '\t'));

            this.POSTRequest(this.props.jsonSchema.ApiUpdateEndpoint, data, {}, (success) => {

                if (success) {

                    window.location = this.redirect.RedirectUrl;
                }
            });
        } else {

            this.refs.OrganisationName1.validate();
            this.refs.OrganisationName2.validate();
            this.refs.ContractId.validate();
            this.refs.Email.validate();
            this.refs.Username.validate();
            this.refs.Password.validate();
            this.refs.ConfirmPassword.validate();
        }
    }

    handleButtonPress(event) {

        if (event.object.props.description.FieldName === 'SaveButton') {

            this.handleSubmit();
        }
    }
}

export default function (root, JSONSchema) {

    ReactDOM.render(<RegistrationForm jsonSchema={JSONSchema} uiSchema={[UISchemaView]} />, root);
}
