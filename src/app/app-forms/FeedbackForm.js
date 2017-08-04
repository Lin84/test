/*
 * Created by LTL
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
import { civilizeFormDefinition, customEnableEditButton, iebContentHeight } from '../helpers';
import { Textarea, Button, Select } from './components/LiComponents';
import errorHandler from '../fetching-data/errorHandle/errorHandler';

class FeedbackForm extends Component {
    constructor() {
        super();

        this.errorDataToNull = this.errorDataToNull.bind(this);
        this.formValidation = this.formValidation.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideValidationMsg = this.hideValidationMsg.bind(this);
        this.removeGenericError = this.removeGenericError.bind(this);
        this.renderGenericError = this.renderGenericError.bind(this);
        this.renderSuccessMsg = this.renderSuccessMsg.bind(this);
        this.renderMandatoryDescription = this.renderMandatoryDescription.bind(this);
        this.resetData = this.resetData.bind(this);
        this.showValidationMsg = this.showValidationMsg.bind(this);
        this.toEnableSave = this.toEnableSave.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);

        this.state = {
            data: {},
            displayValidationMsg: false,
            editMode: true,
            enableSave: false,
            errorData: {},
            genericErrorMsg: undefined,
            hideGenericError: undefined,
            showUpdateSuccesText: false
        };

        this.allChild = {};
        this.originalData = {};
        this.selectDefinition = {};
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
            customEnableEditButton();
            removeLoadingCircle();
        })
        .catch(error => {
            const errorResult = errorHandler({ componentBehaviour: 'post', errorResponse: error, noConnectionErrorMessage: innogyForm[this.props.formDefinition.FormIdentity].NoConnectionErrorMessage });

            this.setState({ ...errorResult });

            removeLoadingCircle();
        });

    }

    renderSuccessMsg() {
        const { formDefinition } = this.props;
        return (
             <div>
                 <h3 className="subheadline" data-tpl="hea01">{ formDefinition.Headline.Label}</h3>
                <div dangerouslySetInnerHTML={{ __html: formDefinition.SuccessMessage.Value }} />
            </div>
        );
    }

    renderGenericError() {
        return (
            <div className="validation-summary-errors FancyErrorMessage">
                <p>{this.state.genericErrorMsg}</p>
            </div>
        );
    }

    renderMandatoryDescription() {
        const { formDefinition } = this.props;
        const additionnalStyle = {
            marginTop: '-1.5rem',
            fontSize: '0.9rem',
            color: '#9d9b98'
        };

        if (formDefinition.MandatoryDescription) {
            return (
                <p
                    className="ta-l fl-l"
                    style={additionnalStyle}
                    dangerouslySetInnerHTML={{ __html: formDefinition.MandatoryDescription.Value || '' }}
                />
            );
        }

        return null;
    }

    renderFeedbackForm() {
        const { formDefinition } = this.props;
        const { data, errorData, displayValidationMsg, enableSave } = this.state;

        return (
            <div
                className="formEdit customForm"
                data-tpl="form"
                data-module="form" data-module-config=""
            >
                <form className="formEdit__form">
                    <div className="row">
                        <div className="col-xs-12">
                            <h3 className="subheadline" data-tpl="hea01">{ formDefinition.Headline.Label}</h3>
                            <div dangerouslySetInnerHTML={{ __html: formDefinition.Headline.Value }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <Select
                                content={formDefinition.Rating}
                                displayValidationMsg={displayValidationMsg}
                                editMode
                                toEnableSave={this.toEnableSave}
                                errorData={errorData.Rating}
                                errorDataToNull={this.errorDataToNull}
                                selectDefinition={this.selectDefinition.Rating}
                                updateInputValue={this.updateInputValue}
                                value={data.Rating}
                                ref={(component) => {
                                    if (component) {
                                        this.allChild[formDefinition.Rating.FieldName] = component;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <Textarea
                                content={formDefinition.Comments}
                                displayValidationMsg={displayValidationMsg}
                                editMode
                                toEnableSave={this.toEnableSave}
                                errorData={errorData.Comments}
                                errorDataToNull={this.errorDataToNull}
                                updateInputValue={this.updateInputValue}
                                value={data.Comments}
                                ref={(component) => {
                                    if (component) {
                                        this.allChild[formDefinition.Comments.FieldName] = component;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {this.state.hideGenericError === false ? this.renderGenericError() : null}
                    {this.state.showUpdateSuccesText ? this.renderSuccessMsg() : null}

                    <div className="mb-22 formEdit__bottom-wrapper">
                        <Button
                            enableSave={!enableSave}
                            btnDefinition={formDefinition.SaveButton}
                            handleSubmit={this.handleSubmit}
                        />
                        { this.renderMandatoryDescription() }
                    </div>
                </form>
            </div>
        );
    }

    render() {
        return (
            <div>
                { this.state.showUpdateSuccesText ? this.renderSuccessMsg() : this.renderFeedbackForm() }
            </div>
        );
    }
}

export default function (container, formDefinition) {
    render(<FeedbackForm formDefinition={civilizeFormDefinition(formDefinition)} />, container);
}
