/*
 * Created by LTL
 */
import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
import { civilizeFormDefinition, customEnableEditButton, iebContentHeight } from '../helpers';
import { TextInput, Button, Select } from './components/LiComponents';
import errorHandler from '../fetching-data/errorHandle/errorHandler';

class SMECustomerName extends React.Component {
    constructor() {
        super();

        this.errorDataToNull = this.errorDataToNull.bind(this);
        this.formValidation = this.formValidation.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideValidationMsg = this.hideValidationMsg.bind(this);
        this.removeGenericError = this.removeGenericError.bind(this);
        this.renderBtn = this.renderBtn.bind(this);
        this.renderGenericError = this.renderGenericError.bind(this);
        this.renderSuccessMsg = this.renderSuccessMsg.bind(this);
        this.resetData = this.resetData.bind(this);
        this.showValidationMsg = this.showValidationMsg.bind(this);
        this.toEnableSave = this.toEnableSave.bind(this);
        this.toggleMode = this.toggleMode.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);

        this.state = {
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
        this.currentForm = {};
        this.originalData = {};
        this.selectDefinition = {};
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
            // ** after success post, updated data is default data **/ /
            if (response.data.ReferenceLists) {
                this.selectDefinition = response.data.ReferenceLists;
            }

            Object.keys(response.data).map((key) => {
                if (key.indexOf('ReferenceLists')) {
                    this.originalData[key] = response.data[key];
                }
                return this.originalData;
            });

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
        // console.log(Object.keys(this.allChild).length);
        Object.keys(this.allChild).map((element) => {
            if (this.allChild[element].validateInput()) {
                // console.log(`${element} passed validation`);
                validated += 1;
            } else {
                // console.log(`${element} show error msg`);
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
        if (this.formValidation()) {
            this.handleFormSubmit(this.state.data);
        } else {
            // console.log('show error msg');
            this.showValidationMsg();
            removeLoadingCircle();
        }
        // removeLoadingCircle();
        // console.log('validated');
    }

    handleFormSubmit(updatedData) {
        // console.log('handleFormSubmit data:');
        // console.log(updatedData);

        // *******************POST REQUEST AFTER COLLECTING THE DATA.*********************** //
        defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';

        axios(this.props.formDefinition.ApiUpdateEndpoint, {
            method: 'POST',
            headers: defaultHeaders,
            data: JSON.stringify(updatedData)
        })
        .then(response => {
            // *** showing the success msg block *** //
            this.setState({
                showUpdateSuccesText: true,
                hideGenericError: true
            });

            const copy = updatedData;
            copy.ReasonsForChange = '';
            this.setState({ data: copy });
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
                <div className={`mb-22 formEdit__bottom-wrapper ${editMode ? null : 'hidden'}`}>
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
                <div className={`mb-22 formEdit__bottom-wrapper ${editMode ? 'hidden' : null}`}>
                    <Button
                        btnDefinition={formDefinition.EditButton}
                        toggleMode={this.toggleMode}
                        hideGenericError={hideGenericError}
                    />
                </div>
            </div>
        );
    }

    render() {
        const { formDefinition } = this.props;
        const { data, editMode, errorData, displayValidationMsg } = this.state;

        return (
            <div
                className="formEdit customForm"
                data-tpl="form"
                data-module="form"
                data-module-config=""
                ref={(form) => { this.currentForm = form; }}
            >
                <form className="formEdit__form">
                    <div className="row">
                        <div className={`col-xs-12 ${editMode ? '' : 'formView__content'}`}>
                                <TextInput
                                    content={formDefinition.OrgName1}
                                    displayValidationMsg={displayValidationMsg}
                                    editMode={editMode}
                                    toEnableSave={this.toEnableSave}
                                    errorData={errorData.OrgName1}
                                    errorDataToNull={this.errorDataToNull}
                                    updateInputValue={this.updateInputValue}
                                    value={data.OrgName1}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[formDefinition.OrgName1.FieldName] = component;
                                        }
                                    }}
                                />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`col-xs-12 ${editMode ? '' : 'formView__content'}`}>
                                <TextInput
                                    content={formDefinition.OrgName2}
                                    displayValidationMsg={displayValidationMsg}
                                    editMode={editMode}
                                    toEnableSave={this.toEnableSave}
                                    errorData={errorData.OrgName2}
                                    errorDataToNull={this.errorDataToNull}
                                    updateInputValue={this.updateInputValue}
                                    value={data.OrgName2}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[formDefinition.OrgName2.FieldName] = component;
                                        }
                                    }}
                                />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`col-xs-12 ${editMode ? '' : 'formView__content'}`}>
                                <TextInput
                                    content={formDefinition.OrgName3}
                                    displayValidationMsg={displayValidationMsg}
                                    editMode={editMode}
                                    toEnableSave={this.toEnableSave}
                                    errorData={errorData.OrgName3}
                                    errorDataToNull={this.errorDataToNull}
                                    updateInputValue={this.updateInputValue}
                                    value={data.OrgName3}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[formDefinition.OrgName3.FieldName] = component;
                                        }
                                    }}
                                />
                        </div>
                    </div>

                    <div className="row">
                        <div className={`col-xs-12 ${editMode ? '' : 'formView__content hidden'}`}>
                            <Select
                                content={formDefinition.ReasonsForChange}
                                displayValidationMsg={displayValidationMsg}
                                editMode={editMode}
                                toEnableSave={this.toEnableSave}
                                errorData={errorData.ReasonsForChange}
                                errorDataToNull={this.errorDataToNull}
                                selectDefinition={this.selectDefinition.ReasonsForChange}
                                updateInputValue={this.updateInputValue}
                                value={data.ReasonsForChange}
                                ref={(component) => {
                                    if (component) {
                                        this.allChild[formDefinition.ReasonsForChange.FieldName] = component;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className={`col-xs-12 ${editMode ? '' : 'formView__content hidden'}`}>
                            <p>{ formDefinition.AdditionalExplanation ? formDefinition.AdditionalExplanation.Value : null}</p>
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
    render(<SMECustomerName formDefinition={civilizeFormDefinition(formDefinition)} />, container);
}
