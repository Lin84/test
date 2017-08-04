import React from 'react';
import ReactDOM from 'react-dom';

import Form from './components/Form';
const UISchemaView = {
    name: 'view',
    order: [
        {
            type: 'ui:h2',
            class: 'background-color: #ffffff; color: #333333;',
            children: [
                'Headline'
            ]
        },
        'Description1',
        {
            type: 'ui:h3',
            class: '',
            children: [
                'Subheadline'
            ]
        },
        'Description2',
        {
            type: 'bootstrap-row-group',
            class: 'col-md-6',
            children: [
                'Firstname',
                'Lastname'
            ]
        },
        {
            type: 'bootstrap-row-group',
            class: 'col-xs-12',
            children: [
                'CustomerNumber'
            ]
        },
        {
            type: 'ui:lin01'
        },
        {
            type: 'ui:h3',
            class: '',
            children: [
                'DescriptionOfCheckboxes'
            ]
        },
        'AgreeReceiveInvoices',
        'AgreementAGB',
        'AgreeReceivePromotions',
        {
            type: 'ui:lin01'
        },
        {
            type: 'ui:h3',
            class: '',
            children: [
                'SubheadlinePrivacyPolicy'
            ]
        },
        'DescriptionLinkToPrivacyPolicy',
        'GenericErrorField',
        'DescriptionAboutMandatoryLinks',
        'RegisterButton'
    ]
};

class CustomerPostRegisterUser extends Form {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateBeforeSubmit = this.validateBeforeSubmit.bind(this);

        this.state = {
            viewMode: 'view',
            elements: [
                {
                    name: 'Firstname',
                    value: '',
                    valid: false
                },
                {
                    name: 'Lastname',
                    value: '',
                    valid: false
                },
                {
                    name: 'CustomerNumber',
                    value: '',
                    valid: false
                },
                {
                    name: 'AgreeReceiveInvoices',
                    value: false,
                    valid: false,
                    errorText: ''
                },
                {
                    name: 'AgreementAGB',
                    value: false,
                    valid: false,
                    errorText: ''
                },
                {
                    name: 'AgreeReceivePromotions',
                    value: false,
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

            this.refs.Firstname.validate();
            this.refs.Lastname.validate();
            this.refs.CustomerNumber.validate();
            this.refs.AgreeReceiveInvoices.validate();
            this.refs.AgreementAGB.validate();
        }
    }

    handleButtonPress(event) {

        if (event.object.props.description.FieldName === 'RegisterButton') {

            this.handleSubmit();
        }
    }
}

export default function (root, JSONSchema) {

    ReactDOM.render(<CustomerPostRegisterUser jsonSchema={JSONSchema} uiSchema={[UISchemaView]} />, root);
}
