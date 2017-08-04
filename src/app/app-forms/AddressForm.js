/*
 * Created by LTL
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
import { civilizeFormDefinition, customEnableEditButton, iebContentHeight } from '../helpers';
import { TextInput, Button, Checkbox } from './components/LiComponents';
import errorHandler from '../fetching-data/errorHandle/errorHandler';

class AddressForm extends Component {
    constructor() {
        super();

        this.errorDataToNull = this.errorDataToNull.bind(this);
        this.formValidation = this.formValidation.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideValidationMsg = this.hideValidationMsg.bind(this);
        this.removeGenericError = this.removeGenericError.bind(this);
        this.renderBtn = this.renderBtn.bind(this);
        this.renderCheckbox = this.renderCheckbox.bind(this);
        this.renderGenericError = this.renderGenericError.bind(this);
        this.renderPostBox = this.renderPostBox.bind(this);
        this.renderStaticText = this.renderStaticText.bind(this);
        this.renderSuccessMsg = this.renderSuccessMsg.bind(this);
        this.resetData = this.resetData.bind(this);
        this.showValidationMsg = this.showValidationMsg.bind(this);
        this.toEnableSave = this.toEnableSave.bind(this);
        this.toggleMode = this.toggleMode.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);

        this.state = {
            sendToMailbox: false,
            data: {},
            displayValidationMsg: false,
            editMode: false,
            enableSave: false,
            errorData: {},
            genericErrorMsg: undefined,
            hideGenericError: undefined,
            showUpdateSuccesText: false
        };

        this.allChild = {};
        this.originalData = {};
        this.currentForm = {};
    }

    componentDidMount() {
        createLoadingCircle();
        showLoadingCircle();
        // ******************** GET REQUEST TO GET THE CUSTOMER DATA ********************* //:
        defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';
        axios(this.props.formDefinition.ApiGetEndpoint, {
            method: 'GET',
            headers: defaultHeaders
        }).then(response => {

            Object.keys(response.data).map((key) => {
                if (key.indexOf('ReferenceLists')) {
                    this.originalData[key] = response.data[key];
                }

                return this.originalData;
            });

            if (response.data.Mailbox.length > 0) {
                this.setState({ sendToMailbox: true });
            }

            // fix for bug 4308:
            this.originalData.Address1 = [this.originalData.Address1, this.originalData.Address2, this.originalData.Address3].join(' ');
            this.originalData.Address2 = '';
            this.originalData.Address3 = '';

            this.setState({
                hideGenericError: true,
                data: this.originalData
            });

            removeLoadingCircle();

        }).catch(error => {
            const errorResult = errorHandler({ errorResponse: error, noConnectionErrorMessage: innogyForm[this.props.formDefinition.FormIdentity].NoConnectionErrorMessage });

            this.setState({ ...errorResult });

            removeLoadingCircle();
        });
    }

    componentDidUpdate() {
        iebContentHeight(this.currentForm);
    }

    handleCheck() {
        this.setState({ sendToMailbox: !this.state.sendToMailbox });
    }

    toEnableSave() {
        this.setState({ enableSave: true });
    }

    errorDataToNull() {
        this.setState({ errorData: {} });
    }

    removeGenericError() {
        this.setState({ hideGenericError: true });
    }

    toggleMode() {
        this.setState({
            editMode: !this.state.editMode,
            enableSave: false
        });
    }

    updateInputValue(name, value) {
        const copy = Object.assign({}, this.state.data);
        copy[name] = value;
        this.setState({ data: copy });
    }

    resetData() {
        this.setState({ data: this.originalData });
    }

    hideValidationMsg() {
        this.setState({ displayValidationMsg: false });
    }

    showValidationMsg() {
        this.setState({ displayValidationMsg: true });
    }

    formValidation() {
        const howManyChild = Object.keys(this.allChild).length;
        let validated = 0;
        Object.keys(this.allChild).map((element) => {
            if (this.allChild[element].validateInput()) {
                // console.log(`${element} passed validation`);
                validated += 1;
            }
            return validated;
        });
        if (howManyChild === validated) {
            // console.log('submit');
            return true;
        }

        return false;
    }

    handleSubmit() {
        createLoadingCircle();
        showLoadingCircle();
        // console.log('validated');
        if (this.formValidation()) {
            this.handleFormSubmit(this.state.data);
        } else {
            // console.log('show error msg');
            this.showValidationMsg();
            removeLoadingCircle();
        }
        // removeLoadingCircle();
    }

    handleFormSubmit(updatedData) {
        // console.log('handleFormSubmit data:');
        // console.log(updatedData);

        // CAB - DFD-4319 - empty the Address1 if checkbox is checked:
        if (this.state.sendToMailbox) {
            updatedData.Address1 = '';
        } else {
            updatedData.Mailbox = '';
        }

        // *******************POST REQUEST AFTER COLLECTING THE DATA.*********************** //
        defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';
        axios(this.props.formDefinition.ApiUpdateEndpoint, {
            method: 'POST',
            headers: defaultHeaders,
            data: JSON.stringify(updatedData)
        })
        .then(response => {
            // showing the success msg block
            this.setState({
                showUpdateSuccesText: true,
                hideGenericError: true
            });

            this.originalData = updatedData;
            this.toggleMode();
            customEnableEditButton();
            removeLoadingCircle();

            // *** hiding the success msg block after 3s *** //
            setTimeout(() => {
                this.setState({ showUpdateSuccesText: false });
            }, 3000);
        })
        .catch(error => {
            const errorResult = errorHandler({ componentBehaviour: 'post', errorResponse: error, noConnectionErrorMessage: innogyForm[this.props.formDefinition.FormIdentity].NoConnectionErrorMessage });

            this.setState({ ...errorResult });

            removeLoadingCircle();
        });

    }

    renderSuccessMsg() {
        let alertText = null;

        if (this.state.showUpdateSuccesText) {
            alertText = (
                <div>
                    <p className="customForm__submit customForm__submit_success">
                        {this.props.formDefinition.SuccessMessage}
                    </p>
                </div>
            );
        }

        return alertText;
    }

    renderGenericError() {
        return (
            <div className="validation-summary-errors FancyErrorMessage">
                <p>{this.state.genericErrorMsg}</p>
            </div>
        );
    }

    renderBtn() {
        const { formDefinition } = this.props;
        const { editMode, enableSave, hideGenericError } = this.state;

        return (
            <div>
                <div className={`mb-22 formEdit__bottom-wrapper ${editMode ? '' : 'hidden'}`}>
                    <Button
                        btnDefinition={formDefinition.CancelButton}
                        toggleMode={this.toggleMode}
                        resetData={this.resetData}
                        hideValidationMsg={this.hideValidationMsg}
                        removeGenericError={this.removeGenericError}
                    />
                    <Button
                        enableSave={!enableSave}
                        btnDefinition={formDefinition.SaveButton}
                        handleSubmit={this.handleSubmit}
                    />
                </div>
                <div className={`mb-22 formEdit__bottom-wrapper ${editMode ? 'hidden' : ''}`}>
                    <Button
                        btnDefinition={formDefinition.EditButton}
                        toggleMode={this.toggleMode}
                        hideGenericError={hideGenericError}
                    />
                </div>
            </div>
        );
    }

    renderCheckbox() {
        return (
            <div>
                <div className={`col-md-5 ${this.state.editMode ? '' : 'formView__content hidden'}`}>
                    <Checkbox
                        content={this.props.formDefinition.SendToMailbox}
                        editMode={this.state.editMode}
                        handleCheck={this.handleCheck}
                        toEnableSave={this.toEnableSave}
                        value={this.state.sendToMailbox}
                    />
                </div>
                {this.state.sendToMailbox ? this.renderPostBox() : null}
            </div>
        );
    }

    renderPostBox() {
        const { formDefinition } = this.props;
        const { data, editMode, errorData, displayValidationMsg, sendToMailbox } = this.state;
        return (
            <div className={`col-md-7 ${this.state.editMode ? '' : 'formView__content'}`}>
                <TextInput
                    content={formDefinition.Mailbox}
                    displayValidationMsg={displayValidationMsg}
                    editMode={editMode}
                    toEnableSave={this.toEnableSave}
                    errorData={errorData.Mailbox}
                    errorDataToNull={this.errorDataToNull}
                    updateInputValue={this.updateInputValue}
                    value={data.Mailbox}
                    ifRequired={sendToMailbox}
                    ref={(component) => {
                        if (component && sendToMailbox) {
                            this.allChild[formDefinition.Mailbox.FieldName] = component;
                        } else {
                            delete this.allChild[formDefinition.Mailbox.FieldName];
                        }
                    }}
                />
            </div>
        );
    }

    renderStaticText() {
        return (
            <p dangerouslySetInnerHTML={{ __html: this.props.formDefinition.DescriptionMessage.Value }} />
        );
    }

    render() {
        const { formDefinition } = this.props;
        const { data, editMode, errorData, displayValidationMsg, sendToMailbox } = this.state;

        return (
            <div
                className="formEdit customForm"
                data-tpl="form"
                data-module="form" data-module-config=""
                ref={(form) => { this.currentForm = form; }}
            >
                <form className="formEdit__form">
                    <div className="row">
                        <div className={`col-xs-12 ${this.state.editMode ? '' : 'formView__content'}`}>
                            <TextInput
                                content={formDefinition.CompanyName}
                                displayValidationMsg={displayValidationMsg}
                                editMode={editMode}
                                toEnableSave={this.toEnableSave}
                                errorData={errorData.CompanyName}
                                errorDataToNull={this.errorDataToNull}
                                updateInputValue={this.updateInputValue}
                                value={data.CompanyName}
                                ref={(component) => {
                                    if (component) {
                                        this.allChild[formDefinition.CompanyName.FieldName] = component;
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`col-xs-12 ${this.state.editMode ? '' : 'formView__content'}`}>
                            <TextInput
                                content={formDefinition.Address1}
                                displayValidationMsg={displayValidationMsg}
                                editMode={editMode}
                                toEnableSave={this.toEnableSave}
                                errorData={errorData.Address1}
                                errorDataToNull={this.errorDataToNull}
                                updateInputValue={this.updateInputValue}
                                value={data.Address1}
                                ifRequired={!sendToMailbox}
                                ref={(component) => {
                                    if (component) {
                                        this.allChild[formDefinition.Address1.FieldName] = component;
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`col-sm-6 ${editMode ? '' : 'formView__content'}`}>
                            <TextInput
                                content={formDefinition.PostCode}
                                displayValidationMsg={displayValidationMsg}
                                editMode={editMode}
                                toEnableSave={this.toEnableSave}
                                errorData={errorData.PostCode}
                                errorDataToNull={this.errorDataToNull}
                                updateInputValue={this.updateInputValue}
                                value={data.PostCode}
                                ref={(component) => {
                                    if (component) {
                                        this.allChild[formDefinition.PostCode.FieldName] = component;
                                    }
                                }}
                            />
                        </div>
                        <div className={`col-sm-6 ${editMode ? '' : 'formView__content'}`}>
                            <TextInput
                                content={formDefinition.City}
                                displayValidationMsg={displayValidationMsg}
                                editMode={editMode}
                                toEnableSave={this.toEnableSave}
                                errorData={errorData.City}
                                errorDataToNull={this.errorDataToNull}
                                updateInputValue={this.updateInputValue}
                                value={data.City}
                                ref={(component) => {
                                    if (component) {
                                        this.allChild[formDefinition.City.FieldName] = component;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="row">
                            {editMode ? this.renderCheckbox() : this.renderPostBox()}
                    </div>

                    <div className={`row ${this.state.editMode ? 'hidden' : ''}`}>
                        <div className="col-xs-12 formView__content">
                            {this.props.formDefinition.DescriptionMessage ? this.renderStaticText() : null}
                        </div>
                    </div>

                    {this.state.hideGenericError === false ? this.renderGenericError() : null}
                    {this.state.showUpdateSuccesText ? this.renderSuccessMsg() : null}
                    {this.renderBtn()}
                </form>
            </div>
        );
    }
}

export default function (container, formDefinition) {
    render(<AddressForm formDefinition={civilizeFormDefinition(formDefinition)} />, container);
}
