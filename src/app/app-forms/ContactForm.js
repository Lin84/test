/*
 * Created by LTL
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { render } from 'react-dom';
import axios from 'axios';

import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
import { civilizeFormDefinition, customEnableEditButton, iebContentHeight } from '../helpers';
import { TextInput, Button } from './components/LiComponents';
import errorHandler from '../fetching-data/errorHandle/errorHandler';
import { initUserData, updateUserData } from '../AC/userData';

class ContactForm extends Component {
    constructor() {
        super();

        this.toEnableSave = this.toEnableSave.bind(this);
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
            this.originalData = response.data;
            const copy = { ...response.data };
            this.props.initUserData(copy);
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
            this.props.updateUserData({ name: 'Email', value: updatedData.Email });
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
                data-tpl="form" data-module="form"
                data-module-config=""
                ref={(form) => { this.currentForm = form; }}
            >
                <form className="formEdit__form">
                    <div className="row">
                        <div className={`col-xs-12 ${editMode ? '' : 'formView__content'}`}>
                                <TextInput
                                    content={formDefinition.HomePhoneNumber}
                                    displayValidationMsg={displayValidationMsg}
                                    editMode={editMode}
                                    toEnableSave={this.toEnableSave}
                                    errorData={errorData.HomePhoneNumber}
                                    errorDataToNull={this.errorDataToNull}
                                    updateInputValue={this.updateInputValue}
                                    value={data.HomePhoneNumber}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[formDefinition.HomePhoneNumber.FieldName] = component;
                                        }
                                    }}
                                />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`col-xs-12 ${editMode ? '' : 'formView__content'}`}>
                                <TextInput
                                    content={formDefinition.MobilePhoneNumber}
                                    displayValidationMsg={displayValidationMsg}
                                    editMode={editMode}
                                    toEnableSave={this.toEnableSave}
                                    errorData={errorData.MobilePhoneNumber}
                                    errorDataToNull={this.errorDataToNull}
                                    updateInputValue={this.updateInputValue}
                                    value={data.MobilePhoneNumber}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[formDefinition.MobilePhoneNumber.FieldName] = component;
                                        }
                                    }}
                                />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`col-xs-12 ${editMode ? '' : 'formView__content'}`}>
                                <TextInput
                                    content={formDefinition.AlternativePhoneNumber}
                                    displayValidationMsg={displayValidationMsg}
                                    editMode={editMode}
                                    toEnableSave={this.toEnableSave}
                                    errorData={errorData.AlternativePhoneNumber}
                                    errorDataToNull={this.errorDataToNull}
                                    updateInputValue={this.updateInputValue}
                                    value={data.AlternativePhoneNumber}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[formDefinition.AlternativePhoneNumber.FieldName] = component;
                                        }
                                    }}
                                />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`col-xs-12 ${editMode ? '' : 'formView__content'}`}>
                                <TextInput
                                    content={formDefinition.FaxNumber}
                                    displayValidationMsg={displayValidationMsg}
                                    editMode={editMode}
                                    toEnableSave={this.toEnableSave}
                                    errorData={errorData.FaxNumber}
                                    errorDataToNull={this.errorDataToNull}
                                    updateInputValue={this.updateInputValue}
                                    value={data.FaxNumber}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[formDefinition.FaxNumber.FieldName] = component;
                                        }
                                    }}
                                />
                        </div>
                    </div>
                    <div className="row">
                        <div className={`col-xs-12 ${editMode ? '' : 'formView__content'}`}>
                                <TextInput
                                    content={formDefinition.Email}
                                    displayValidationMsg={displayValidationMsg}
                                    editMode={editMode}
                                    toEnableSave={this.toEnableSave}
                                    errorData={errorData.Email}
                                    errorDataToNull={this.errorDataToNull}
                                    updateInputValue={this.updateInputValue}
                                    value={data.Email}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[formDefinition.Email.FieldName] = component;
                                        }
                                    }}
                                />
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

// export default function (container, formDefinition) {
//     render(<ContactForm formDefinition={civilizeFormDefinition(formDefinition)} />, container);
// }

export default connect((state) => {
    const { userData } = state;
    return {
        userData
    };
}, {
    initUserData,
    updateUserData
})(ContactForm);

// Jfc.defaultProps = {
//     formDefinition: civilizeFDefinition(components.jfc01),
//     componentsDefinition: civilizeComponentsDefinition(components.jfc01),
//     errorResponseGetRequest: {}
// };

// export default connect((state) => {
//     const { jfc, handleErrorGetRequest, data } = state;

//     return {
//         selectDefinition: jfc,
//         errorResponseGetRequest: handleErrorGetRequest,
//         data
//     };
// }, {
//     initJfc,
//     updateCitySelect,
//     updateData,
//     emptyData
// })(Jfc);
