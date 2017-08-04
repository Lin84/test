/*
 * Created by LTL
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import axios from 'axios';

import ConfirmationStep from '../inbetweenInvoice/ConfirmationStep';
import EditStep from '../inbetweenInvoice/EditStep';
import Hpn from './Hpn';
import SuccessStep from '../inbetweenInvoice/SuccessStep';
import { civilizeFormDefinition, getCookie, initSensoryMind, ScrollToError } from '../../helpers';
import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../../loadingCircle';
import errorHandler from '../../fetching-data/errorHandle/errorHandler';

export default class MultistepForm extends Component {
    constructor() {
        super();

        this.addDatepickerRef = this.addDatepickerRef.bind(this);
        this.addSelectRef = this.addSelectRef.bind(this);
        this.toEnableSave = this.toEnableSave.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleCorrectionReasonChange = this.handleCorrectionReasonChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleStep1Submit = this.handleStep1Submit.bind(this);
        this.handleStep2Submit = this.handleStep2Submit.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.validateReadingData = this.validateReadingData.bind(this);

        this.state = {
            currentStep: 1,
            data: [],
            originalData: [],
            displayValidationMsg: true,
            enableSave: false,
            errorData: {},
            missingRequiredFields: {
                0: [],
                1: [],
                2: []
            },
            genericErrorMsg: undefined,
            hideGenericError: undefined,
            showUpdateSuccesText: false,
            confirmationChecked: true,
            showCheckbox: false,
            correctionReason: '',
            correctionReasonText: '',
            toleranceLimitMsg: ''
        };

        this.datepickers = [];
        this.selects = [];
    }

    componentDidMount() {
        defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';
        this.getData();
    }

    // TODO generic method for api calls
    getData() {
        createLoadingCircle();
        showLoadingCircle();

        const url = this.props.formDefinition.Children[0].Form.ApiGetEndpoint;
        const ContractNumber = getCookie('ContractNumber');
        const InvoiceNumber = getCookie('InvoiceNumber');

        defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';
        axios(`${url}?contractId=${ContractNumber}&invoiceNumber=${InvoiceNumber}`, {
            method: 'GET',
            headers: defaultHeaders
        }).then(response => {
            const data = response.data;

            // TO REMOVE:
            // this.setState({
            //     hideGenericError: true,
            //     // deep copy hack (avoid keeping references)
            //     data: JSON.parse(JSON.stringify(data)),
            //     originalData: JSON.parse(JSON.stringify(data))
            // });

            // deep copy hack (avoid keeping references) and empty the data got from database:
            const emptyData = JSON.parse(JSON.stringify(data));
            emptyData.map((group) => {
                group.register.map((register) => {
                    register.date = '';
                    register.reading = '';
                    return register;
                });
                return group;
            });

            this.setState({
                hideGenericError: true,
                data: emptyData,
                // deep copy hack (avoid keeping references)
                originalData: JSON.parse(JSON.stringify(data))
            });

            initSensoryMind(this.props.formDefinition.MultistepFormIdentity);

            removeLoadingCircle();
        }).catch(error => {
            // TO REMOVE:
            // switch (error.response.status) {
            //     case 500: {
            //         const messageResponse = error.response.data.Message || 'We are really sorry,';
            //         const exceptionMessageResponse = error.response.data.ExceptionMessage || 'please come back later.';
            //         this.setState({
            //             genericErrorMsg: `${messageResponse} ${exceptionMessageResponse}`,
            //             hideGenericError: false
            //         });
            //         break;
            //     }
            //     case 400: {
            //         const tempResponse = error.response.data.ModelState;

            //         Object.keys(tempResponse).map((key) => {
            //             if (key === '') {
            //                 this.setState({
            //                     genericErrorMsg: tempResponse[key] || 'We are really sorry',
            //                     hideGenericError: false
            //                 });
            //             }
            //             return null;
            //         });
            //         this.setState({ errorData: error.response.data.ModelState || 'Please come back later.' });
            //         break;
            //     }
            //     default: {
            //         this.setState({
            //             genericErrorMsg: innogyMultistepForm[this.props.formDefinition.MultistepFormIdentity].Children[0].Form.NoConnectionErrorMessage,
            //             hideGenericError: false
            //         });
            //     }
            // }

            const errorResult = errorHandler({ errorResponse: error, noConnectionErrorMessage: innogyMultistepForm[this.props.formDefinition.MultistepFormIdentity].Children[0].Form.NoConnectionErrorMessage });

            this.setState({ ...errorResult });
            removeLoadingCircle();
        });
    }

    postData(attributes) {
        const ContractNumber = getCookie('ContractNumber');
        const InvoiceNumber = getCookie('InvoiceNumber');
        const url = this.props.formDefinition.Children[this.state.currentStep - 1].Form.ApiUpdateEndpoint;

        createLoadingCircle();
        showLoadingCircle();

        // if date and reading is empty => post the data from originalData:
        const { originalData } = this.state;

        let data = JSON.parse(JSON.stringify(this.state.data));
        // let data = this.state.data;

        data.map((group, groupIndex) => {
            group.register.map((register, fieldIndex) => {
                if (register.reading.length === 0 && register.date.length === 0) {
                    register.reading = originalData[groupIndex].register[fieldIndex].reading;
                    register.date = originalData[groupIndex].register[fieldIndex].date;
                }
                return register;
            });
            return group;
        });

        this.setState({ data });

        // adapt to the correct structure for posting the data:
        data = {
            device: data
        };

        if (attributes) {
            Object.keys(attributes).map(key => data[key] = attributes[key]);
        }

        const json = JSON.stringify(data);

        axios(`${url}?contractId=${ContractNumber}&invoiceNumber=${InvoiceNumber}`, {
            method: 'POST',
            headers: defaultHeaders,
            data: json
        })
        .then(response => {
            // handle 200 response with content to display the checkbox in confirmation step:
            if (response.status === 202) {
                if (response.data.Message && response.data.Message.length > 1) {
                    this.setState({
                        toleranceLimitMsg: response.data.Message,
                        showCheckbox: true,
                        confirmationChecked: false
                    });
                }
            }

            this.setState({
                currentStep: this.state.currentStep + 1,
                hideGenericError: true
            });

            ScrollToError();
            removeLoadingCircle();
        })
        .catch(error => {
            const errorResult = errorHandler({ componentBehaviour: 'post', errorResponse: error, noConnectionErrorMessage: innogyMultistepForm[this.props.formDefinition.MultistepFormIdentity].Children[0].Form.NoConnectionErrorMessage });

            this.setState({ ...errorResult });

            removeLoadingCircle();
        });
    }

    addDatepickerRef(groupIndex, fieldIndex, el) {
        if (!el) return;
        const datepicker = { groupIndex, fieldIndex, el };
        // FIXME keep datepickers’ refs unique
        this.datepickers.push(datepicker);
    }

    addSelectRef(select) {
        this.selects.push(select);
    }

    toEnableSave() {
        this.setState({ enableSave: true });
    }

    handleDataChange(groupIndex, fieldIndex, key, value) {
        const newData = this.state.data;

        // TO REMOVE:
        // if (value.trim() === '') {
        //     const { originalData } = this.state;
        //     newData[groupIndex].register[fieldIndex][key] = originalData[groupIndex].register[fieldIndex][key];
        // } else{
        //     // parse reading date to interger:
        //     if (key === 'reading') {
        //         newData[groupIndex].register[fieldIndex][key] = parseInt(value, 10);
        //     } else {
        //         newData[groupIndex].register[fieldIndex][key] = value;
        //     }
        // }

        if (value.trim() === '') {
            newData[groupIndex].register[fieldIndex][key] = '';
        } else if (key === 'reading') {
            // parse reading date to interger:
            const reg = new RegExp('^([0-9]*)$');
            if (reg.test(value)) {
                newData[groupIndex].register[fieldIndex][key] = parseInt(value, 10);
            } else {
                newData[groupIndex].register[fieldIndex][key] = value;
            }
        } else {
            newData[groupIndex].register[fieldIndex][key] = value;
        }

        this.setState({ data: newData });
    }

    handleCorrectionReasonChange(name, value, text) {
        this.setState({
            correctionReason: value,
            correctionReasonText: text
        });
    }

    handleCheck() {
        this.setState({ confirmationChecked: !this.state.confirmationChecked });
    }

    saveDatepickersValues() {
        this.datepickers.forEach(({ groupIndex, fieldIndex, el }) => {
            const input = el.querySelector('[name="Date_submit"]');
            const { value } = input;
            if (!value) return;

            const newData = this.state.data;
            newData[groupIndex].register[fieldIndex].date = value;
            this.setState({ data: newData });
        });
    }

    validateReadingData() {
        const { data } = this.state;
        const reg = new RegExp('^([0-9]*)$');

        let correctReadingData = 0;
        let filledReadingData = 0;
        let isValidReadingData = true;

        data.forEach((group, groupIndex) => {
            group.register.forEach((register) => {
                const readingLength = register.reading.toString().length;
                if (readingLength > 0) {
                    filledReadingData += 1;

                    if (reg.test(register.reading)) {
                        correctReadingData += 1;
                    }
                }
            });

            if (correctReadingData !== filledReadingData) isValidReadingData = false;
        });

        if (!isValidReadingData) ScrollToError();

        return isValidReadingData;
    }

    validateGroups() {
        const { data, originalData } = this.state;
        let isValid = true;

        data.forEach(({ register }, groupIndex) => {
            if (!register) return;

            // FIRST, we need to figure out if the whole group is valid or not
            const fieldsCount = register.length * 2; // each item has two fields (date, reading)
            let filledFieldsCount = 0;

            register.forEach(({ date, reading }, fieldIndex) => {
                if (date.length !== 0) {
                    filledFieldsCount += 1;
                }

                if (reading.length !== 0) {
                    filledFieldsCount += 1;
                }
            });

            // the group is valid either if no field is filled or all fields are filled:
            const groupIsValid = filledFieldsCount === 0 || filledFieldsCount === fieldsCount;

            const nextState = this.state.missingRequiredFields;
            nextState[groupIndex] = [];

            // SECOND, we’re going to mark invalid (not filled) fields if the group’s not valid
            if (!groupIsValid) {
                register.forEach(({ date, reading }, fieldIndex) => {
                    const {
                        date: originalDate,
                        reading: originalReading
                    } = originalData[groupIndex].register[fieldIndex];
                    const missingFields = [];

                    if (date.length === 0) {
                        missingFields.push('date');
                    }

                    if (reading.length === 0) {
                        missingFields.push('reading');
                    }

                    nextState[groupIndex][fieldIndex] = missingFields;
                });

                isValid = false;

                ScrollToError();
            }

            this.setState({ missingRequiredFields: nextState });
        });

        return isValid;
    }

    validateCorrectionReason() {
        const { correctionReason } = this.state;

        if (this.selects[0]) {
            this.selects[0].validateInput();
        }

        if (correctionReason.length > 1) {
            return true;
        }

        return false;
    }

    handleStep1Submit() {
        // console.log('handleStep1Submit');
        this.saveDatepickersValues();

        const isValid = this.validateGroups();
        if (!isValid) return;
        // console.log('isValid');

        const isValidReadingData = this.validateReadingData();
        if (!isValidReadingData) return;

        const reasonPicked = this.validateCorrectionReason();
        if (this.props.showCorrectionReason && !reasonPicked) {
            ScrollToError();
            return;
        }

        if (this.props.showCorrectionReason) {
            const { originalData, data } = this.state;
            const copyData = JSON.parse(JSON.stringify(data));

            copyData.map((group, groupIndex) => {
                group.register.map((register, fieldIndex) => {
                    if (register.reading.length === 0 && register.date.length === 0) {
                        register.reading = originalData[groupIndex].register[fieldIndex].reading;
                        register.date = originalData[groupIndex].register[fieldIndex].date;
                    }
                    return register;
                });
                return group;
            });

            this.setState({
                data: copyData,
                currentStep: 2
            });

            ScrollToError({ topWindow: true });
        } else {
            this.postData({ modus: 'check' });
        }
    }

    handleStep2Submit() {
        if (this.props.showCorrectionReason) {
            this.postData({
                invoiceNumber: getCookie('InvoiceNumber'),
                correctionReason: this.state.correctionReason
            });
        } else {
            this.postData({ modus: 'write' });
        }
    }

    handleBack() {
        this.setState({
            currentStep: 1,
            hideGenericError: true
        });

        location.reload();
        initSensoryMind(this.props.formDefinition.MultistepFormIdentity);
    }

    renderCurrentStep() {
        const {
            errorData,
            displayValidationMsg,
            data,
            originalData,
            enableSave,
            currentStep,
            confirmationChecked,
            missingRequiredFields
        } = this.state;

        switch (this.state.currentStep) {
            case 1:
                return (
                    <EditStep
                        errorData={errorData}
                        displayValidationMsg={displayValidationMsg}
                        data={data}
                        originalData={originalData}
                        addDatepickerRef={this.addDatepickerRef}
                        definition={civilizeFormDefinition(this.props.formDefinition.Children[0].Form)}
                        enableSave={enableSave}
                        toEnableSave={this.toEnableSave}
                        handleDataChange={this.handleDataChange}
                        missingRequiredFields={missingRequiredFields}
                        handleSubmit={this.handleStep1Submit}
                        handleCorrectionReasonChange={this.handleCorrectionReasonChange}
                        correctionReason={this.state.correctionReason}
                        showCorrectionReason={this.props.showCorrectionReason}
                        addSelectRef={this.addSelectRef}
                    />
                );

            case 2:
                return (
                    <ConfirmationStep
                        errorData={errorData}
                        displayValidationMsg={displayValidationMsg}
                        data={data}
                        originalData={originalData}
                        definition={civilizeFormDefinition(this.props.formDefinition.Children[1].Form)}
                        enableSave={enableSave}
                        toEnableSave={this.toEnableSave}
                        handleSubmit={this.handleStep2Submit}
                        handleBack={this.handleBack}
                        confirmationChecked={this.state.confirmationChecked}
                        handleCheck={this.handleCheck}
                        showCheckbox={this.state.showCheckbox}
                        correctionReason={this.state.correctionReasonText}
                        showCorrectionReason={this.props.showCorrectionReason}
                        toleranceLimitMsg={this.state.toleranceLimitMsg}
                    />
                );

            case 3:
                return (
                    <SuccessStep
                        errorData={errorData}
                        displayValidationMsg={displayValidationMsg}
                        data={data}
                        originalData={originalData}
                        definition={civilizeFormDefinition(this.props.formDefinition.Children[2].Form)}
                        enableSave={enableSave}
                        toEnableSave={this.toEnableSave}
                        correctionReason={this.state.correctionReasonText}
                        showCorrectionReason={this.props.showCorrectionReason}
                    />
                );

            default:
                return null;
        }
    }

    renderGenericError() {
        return (
            <div className="validation-summary-errors FancyErrorMessage">
                <p>{this.state.genericErrorMsg}</p>
            </div>
        );
    }

    render() {
        const forms = this.props.formDefinition.Children;
        return (
            <form className="formEdit__form">
                <div className="row">
                    <div className="col-xs-12 ta-c">
                        <h1 data-tpl="hea01">{this.props.formDefinition.Headline}</h1>
                        <Hpn
                            definition={forms.map(({ Headline }) => Headline)}
                            currentStep={this.state.currentStep}
                            hpnDefinition={this.props.formDefinition.HPN01}
                        />
                        { this.renderCurrentStep() }
                    </div>
                </div>
                {this.state.hideGenericError === false ? this.renderGenericError() : null}
            </form>
        );
    }
}

MultistepForm.defaultProps = {
    showCorrectionReason: false
};

MultistepForm.propTypes = {
    showCorrectionReason: PropTypes.bool.isRequired,
    formDefinition: PropTypes.object.isRequired
};
