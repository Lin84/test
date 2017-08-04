/*
 * Created by LTL
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { connect } from 'react-redux';

import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
import { civilizeFormDefinition, customEnableEditButton, iebContentHeight } from '../helpers';
import { Button, Checkbox } from './components/LiComponents';
import errorHandler from '../fetching-data/errorHandle/errorHandler';

class NewsletterForm extends Component {
    constructor() {
        super();

        this.errorDataToNull = this.errorDataToNull.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideValidationMsg = this.hideValidationMsg.bind(this);
        this.removeGenericError = this.removeGenericError.bind(this);
        this.renderBtn = this.renderBtn.bind(this);
        this.renderCheckbox = this.renderCheckbox.bind(this);
        this.renderEmailContactPermission = this.renderEmailContactPermission.bind(this);
        this.renderGenericError = this.renderGenericError.bind(this);
        this.renderSuccessMsg = this.renderSuccessMsg.bind(this);
        this.resetData = this.resetData.bind(this);
        this.showValidationMsg = this.showValidationMsg.bind(this);
        this.toEnableSave = this.toEnableSave.bind(this);
        this.toggleCheck = this.toggleCheck.bind(this);
        this.toggleMode = this.toggleMode.bind(this);

        this.state = {
            checkboxChecked: false,
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
            this.selectDefinition = response.data.ReferenceLists;

            Object.keys(response.data).map((key) => {
                if (key.indexOf('ReferenceLists')) {
                    this.originalData[key] = response.data[key];
                }
                return this.originalData;
            });

            if (response.data.EmailContactPermission) {
                this.setState({ checkboxChecked: true });
            }

            this.setState({
                data: this.originalData,
                hideGenericError: true
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

    toggleCheck() {
        const { checkboxChecked } = this.state;
        this.setState({ checkboxChecked: !checkboxChecked });

        // ** update the data for EmailContactPermission after togglecheck** //
        let copy;
        if (!this.state.checkboxChecked) {
            copy = Object.assign({}, this.state.data);
            copy.EmailContactPermission = true;
            this.setState({ data: copy });
        } else if (this.state.checkboxChecked) {
            copy = Object.assign({}, this.state.data);
            copy.EmailContactPermission = false;
            this.setState({ data: copy });
        }
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

    resetData() {
        this.setState({ data: this.originalData });
    }

    hideValidationMsg() {
        this.setState({ displayValidationMsg: false });
    }

    showValidationMsg() {
        this.setState({ displayValidationMsg: true });
    }

    handleSubmit() {
        createLoadingCircle();
        showLoadingCircle();
        this.showValidationMsg();
        // removeLoadingCircle();
        this.handleFormSubmit(this.state.data);
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
                        {innogyForm[this.props.formDefinition.FormIdentity].SuccessMessage}
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
            <div >
                <div className={`col-xs-12 ${this.state.editMode ? '' : 'formView__content hidden'}`}>
                    <Checkbox
                        content={this.props.formDefinition.EmailContactPermission}
                        editMode={this.state.editMode}
                        toEnableSave={this.toEnableSave}
                        handleCheck={this.toggleCheck}
                        value={this.state.checkboxChecked}
                    />
                </div>
            </div>
        );
    }

    renderEmailContactPermission() {
        if (this.state.data.EmailContactPermission) {
            return (
                <p dangerouslySetInnerHTML={{ __html: this.props.formDefinition.ReceivingText.Value }} />
            );
        }

        return (
            <p dangerouslySetInnerHTML={{ __html: this.props.formDefinition.NotReceivingText.Value }} />
        );
    }

    render() {
        const { formDefinition, userData } = this.props;
        const { data, editMode, errorData, displayValidationMsg } = this.state;

        let emailAddress;
        if (userData && userData.Email) {
            emailAddress = userData.Email;
        } else if (stcUserData && stcUserData.Email) {
            emailAddress = stcUserData.Email;
        } else {
            emailAddress = null;
        }

        return (
            <div data-tpl="NewsletterRegister">
                <div
                    className="formEdit customForm"
                    data-tpl="form"
                    data-module="form" data-module-config=""
                    ref={(form) => { this.currentForm = form; }}
                >
                    <form className="formEdit__form" onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col-xs-12 formView__content">
                                <label htmlFor="email">{this.props.formDefinition.EmailLabel.Value}</label>
                                <p key="email">{emailAddress}</p>
                            </div>
                        </div>

                        <div className={`row ${editMode ? 'hidden' : ''}`}>
                            <div className="col-xs-12 formView__content">
                                {this.renderEmailContactPermission()}
                            </div>
                        </div>

                        <div className="row">
                            {editMode ? this.renderCheckbox() : null}
                        </div>

                        {this.state.hideGenericError === false ? this.renderGenericError() : null}
                        {this.state.showUpdateSuccesText ? this.renderSuccessMsg() : null}

                        <div className={`row ${editMode ? '' : 'hidden'}`}>
                            <p>{this.props.formDefinition.AdditionalInfoText.Value}</p>
                        </div>
                        {this.renderBtn()}
                    </form>
                </div>
            </div>
        );
    }
}

// export default function (container, formDefinition) {
//     render(<NewsletterForm formDefinition={civilizeFormDefinition(formDefinition)} />, container);
// }

export default connect((state) => {
    const { userData } = state;
    return {
        userData
    };
}, {
})(NewsletterForm);

// export default connect((state) => {
//     const { userData } = state;
//     return {
//         userData
//     };
// }, {
//     initUserData,
//     updateUserData
// })(ContactForm);
