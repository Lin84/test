import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import factory from './../factory';
import passwordIcon from './../form/passwordIcon';
import { createLoadingCircle, showLoadingCircle, removeLoadingCircle } from '../loadingCircle';
import { civilizeFormDefinition } from '../helpers';

import Button from './components/Button';
import TextInput from './components/com.Input';
import TextInputPassword from './components/TextInputPassword';
import Checkbox from './components/com.Checkbox';


class RegisterB2C extends React.Component {
    static enableSave() {
        () => { };
    }

    constructor(props) {
        super(props);

        // this.enableSave = this.enableSave.bind(this);
        this.disableSave = this.disableSave.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateInputText = this.updateInputText.bind(this);
        this.errorDataToNull = this.errorDataToNull.bind(this);

        this.state = {
            data: {
                Firstname: '',
                Lastname: '',
                ContractId: '',
                Email: '',
                Username: '',
                Password: '',
                ConfirmPassword: '',
                RequiresOnlineInvoices: false,
                TermsAndConditionsAccepted: false,
                AgreeReceivePromotions: false
            },

            generalMessage: '',
            enableSave: false,
            errorData: {},
            errorList: {
                Firstname: true,
                Lastname: true,
                ContractId: true,
                Email: true,
                Username: true,
                Password: true,
                ConfirmPassword: true
            },
            receivedData: undefined,
            receivedDataErrorMsg: innogyForm.RegisterB2C.NoConnectionErrorMessage,
            passwordsEqual: false,
            passwordValue: '',
            showPasswordError: false
        };

        this.originalData = {};
        this.childValidState = {};
    }

    // enableSave() {
    //     // this.setState({enableSave: true});
    // }

    enableSubmit() {
        this.setState({ enableSave: true });
    }

    disableSave() {
        this.setState({ enableSave: false });
    }

    errorDataToNull() {
        this.setState({ errorData: {} });
    }

    handleSubmit() {
        const copy = Object.assign({}, this.state.errorList);

        // console.log(this.childValidState);

        // for (let key in this.childValidState) {

        //     if (this.childValidState.hasOwnProperty(key)) {

        //         if (this.childValidState[key].empty) {
        //             this.childValidState[key].validation();
        //         }

        //         if (!this.childValidState[key].valid) {
        //             this.childValidState[key].validation();
        //         }
        //     }
        // }

        Object.keys(this.childValidState).map((key) => {
            if (this.childValidState[key].empty) {
                this.childValidState[key].validation();
            }

            if (!this.childValidState[key].valid) {
                this.childValidState[key].validation();
            }
            return null;
        });

        // for (let key in this.childValidState) {

        //     if (this.childValidState.hasOwnProperty(key)) {
        //         if (this.childValidState[key].empty) {
        //             return this.setState({ enableSave: false });
        //             // return console.log('no submit');
        //         }

        //         if (!this.childValidState[key].valid) {
        //             return this.setState({ enableSave: false });
        //             // return console.log('no submit');
        //         }
        //     }
        // }

        const tempKeys = Object.keys(this.childValidState);
        for (let i = 0; i < tempKeys.length; i += 1) {
            if (this.childValidState[tempKeys[i]].empty) {
                if (this.props.formDefinition[tempKeys[i]].Required) {
                    return this.setState({ enableSave: false });
                }
            }
            if (!this.childValidState[tempKeys[i]].valid) {
                return this.setState({ enableSave: false });
            }
        }

        if (this.state.data.Password !== this.state.data.ConfirmPassword) {
            this.setState({ enableSave: false });
            // console.log('Password does not match');
            return null;
        }

        // POST REQUEST AFTER COLLECTING THE DATA.
        createLoadingCircle();
        showLoadingCircle();

        defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';
        axios({
            method: 'POST',
            url: innogyForm.RegisterB2C.ApiUpdateEndpoint,
            // url: window.isDev ? 'http://localhost:5500/api/CustomerAddress-api.json' : innogyForm['CustomerAddress'].ApiUpdateEndpoint,
            headers: defaultHeaders,
            data: JSON.stringify(this.state.data)
        })
            .then(response => {
                // console.log('update success');
                removeLoadingCircle();

                window.location.href = this.props.formDefinition.Redirect.RedirectUrl;

                // //*** showing the success msg block ***//
                // this.setState({
                //     generalMessage: <div>
                //         <p className="customForm__submit customForm__submit_success">{innogyForm['RegisterB2C'].SuccessMessage}</p>
                //     </div>
                // });
                // this.originalData = this.state.data;
                //
                // removeLoadingCircle();
                //
                // //*** hiding the success msg block after 3s ***//
                // setTimeout(() => {
                //     this.setState({
                //         generalMessage: null
                //     });
                // }, 3000);
            })
            .catch(error => {

                if (error.response) {
                    if (error.response.status === 400) {

                        const tempResponse = error.response.data.ModelState;

                        Object.keys(tempResponse).map((key) => {
                            if (key === '') {
                                this.setState({
                                    receivedDataErrorMsg: tempResponse[key] || 'We are really sorry',
                                    receivedData: false,
                                    generalMessage: <div
                                        className="validation-summary-errors FancyErrorMessage"
                                    >
                                        <ul>
                                            <li>{tempResponse[key]}</li>
                                        </ul>
                                    </div>
                                });
                            }
                            return null;
                        });
                        this.setState({ errorData: error.response.data.ModelState });
                    } else if (error.response.status === 404) {

                        this.setState({
                            receivedData: false,
                            generalMessage: <div className="validation-summary-errors FancyErrorMessage">
                                <ul>
                                    <li>Page not found. 404</li>
                                </ul>
                            </div>
                        });
                    } else if (error.response.status === 500) {

                        this.setState({

                            receivedDataErrorMsg: `${error.response.data.Message} ${error.response.data.ExceptionMessage}`,
                            receivedData: false,
                            generalMessage: <div className="validation-summary-errors FancyErrorMessage">
                                <ul>
                                    <li>{error.response.data.ExceptionMessage}</li>
                                </ul>
                            </div>
                        });
                    } else {
                        // console.log(error);
                    }
                } else {
                    // console.log('Nothing');
                    this.setState({
                        generalMessage: <div className="validation-summary-errors FancyErrorMessage">
                            <ul>
                                <li>Error which should not be here!</li>
                            </ul>
                        </div>
                    });
                }

                removeLoadingCircle();
            });

        return null;
    }

    updateInputText(event) {

        const copy = Object.assign({}, this.state.data);
        copy[event.target.name] = event.target.value;
        this.setState({
            data: copy
        });

        // console.log(event.target.value, this.state.data, event.target);

        if (event.target.name === 'Password') {

            // console.log(event.target.value, this.state.data.ConfirmPassword);

            if (event.target.value !== '') {
                this.setState({ passwordValue: event.target.value });
            }

            if (event.target.value === this.state.data.ConfirmPassword) {
                this.setState({ passwordsEqual: true });
            } else {
                this.setState({ passwordsEqual: false });
            }

        } else if (event.target.name === 'ConfirmPassword') {

            // console.log(event.target.value, this.state.data.Password);

            if (event.target.value === this.state.data.Password) {
                this.setState({ passwordsEqual: true });
            } else {
                this.setState({ passwordsEqual: false });
            }
        }

        if (this.state.data.TermsAndConditionsAccepted && this.state.data.RequiresOnlineInvoices) {
            this.enableSubmit();
        } else {
            this.disableSave();
        }
    }

    handleCheck(checkbox) {
        const copy = Object.assign({}, this.state.data);
        copy[checkbox] = !copy[checkbox];

        this.setState({ data: copy }, () => {

            if (this.state.data.TermsAndConditionsAccepted && this.state.data.RequiresOnlineInvoices) {
                this.enableSubmit();
            } else {
                this.disableSave();
            }

        });
    }

    render() {
        const editModeTrue = true;
        return (
            <div className="formEdit" data-tpl="form" data-module="form" data-module-config="">
                <div className="formEdit__form" onSubmit={this.handleSubmit}>

                    <div className="FancyLink">
                        <h2 className="headline">{this.props.formDefinition.Headline1.Value}</h2>

                        <p dangerouslySetInnerHTML={{ __html: this.props.formDefinition.Description.Value }} />

                        <p dangerouslySetInnerHTML={{ __html: this.props.formDefinition.SubDescription1.Value }} />

                        <h3 className="subheadline">{this.props.formDefinition.Headline2.Value}</h3>

                        <p dangerouslySetInnerHTML={{ __html: this.props.formDefinition.PersonalDataDescription.Value }} />
                    </div>

                    <div className="FancyLink">

                        <div className="row">
                            <div className="col-sm-6">
                                <TextInput
                                    editMode={editModeTrue}
                                    enableSave={RegisterB2C.enableSave}
                                    content={this.props.formDefinition.Firstname}
                                    ref={(component) => {
                                        if (component) {
                                            this.childValidState[this.props.formDefinition.Firstname.FieldName] = {
                                                empty: component.state.empty, valid: component.state.valid, validation: component.checkInput
                                            };
                                        }
                                    }}
                                    value={this.state.data.Firstname}
                                    updateInputText={this.updateInputText}
                                    errorData={this.state.errorData.Firstname}
                                    errorDataToNull={this.errorDataToNull}
                                />
                            </div>

                            <div className="col-sm-6">
                                <TextInput
                                    editMode={editModeTrue}
                                    enableSave={RegisterB2C.enableSave}
                                    content={this.props.formDefinition.Lastname}
                                    ref={(component) => {
                                        if (component) {
                                            this.childValidState[this.props.formDefinition.Lastname.FieldName] = {
                                                empty: component.state.empty, valid: component.state.valid, validation: component.checkInput
                                            };
                                        }
                                    }}
                                    value={this.state.data.Lastname}
                                    updateInputText={this.updateInputText}
                                    errorData={this.state.errorData.Lastname}
                                    errorDataToNull={this.errorDataToNull}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12">
                                <TextInput
                                    editMode={editModeTrue}
                                    enableSave={RegisterB2C.enableSave}
                                    content={this.props.formDefinition.ContractId}
                                    ref={(component) => {
                                        if (component) {
                                            this.childValidState[this.props.formDefinition.ContractId.FieldName] = {
                                                empty: component.state.empty, valid: component.state.valid, validation: component.checkInput
                                            };
                                        }
                                    }}
                                    value={this.state.data.ContractId}
                                    updateInputText={this.updateInputText}
                                    errorData={this.state.errorData.ContractId}
                                    errorDataToNull={this.errorDataToNull}
                                />
                            </div>
                        </div>

                        <hr data-tpl="lin01" />

                    </div>

                    <div className="FancyLink">
                        <h3 className="subheadline">{this.props.formDefinition.Headline3.Value}</h3>

                        <p dangerouslySetInnerHTML={{ __html: this.props.formDefinition.LoginDetailsDescription.Value }} />
                    </div>

                    <div className="FancyLink">

                        <div className="row">
                            <div className="col-md-6">
                                <TextInput
                                    editMode={editModeTrue}
                                    enableSave={RegisterB2C.enableSave}
                                    content={this.props.formDefinition.Email}
                                    ref={(component) => {
                                        if (component) {
                                            this.childValidState[this.props.formDefinition.Email.FieldName] = {
                                                empty: component.state.empty, valid: component.state.valid, validation: component.checkInput
                                            };
                                        }
                                    }}
                                    value={this.state.data.Email}
                                    updateInputText={this.updateInputText}
                                    errorData={this.state.errorData.Email}
                                    errorDataToNull={this.errorDataToNull}
                                />
                            </div>

                            <div className="col-md-6">
                                <TextInput
                                    editMode={editModeTrue}
                                    enableSave={RegisterB2C.enableSave}
                                    content={this.props.formDefinition.Username}
                                    ref={(component) => {
                                        if (component) {
                                            this.childValidState[this.props.formDefinition.Username.FieldName] = {
                                                empty: component.state.empty, valid: component.state.valid, validation: component.checkInput
                                            };
                                        }
                                    }}
                                    value={this.state.data.Username}
                                    updateInputText={this.updateInputText}
                                    errorData={this.state.errorData.Username}
                                    errorDataToNull={this.errorDataToNull}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <TextInputPassword
                                    editMode={editModeTrue}
                                    enableSave={RegisterB2C.enableSave}
                                    content={this.props.formDefinition.Password}
                                    ref={(component) => {
                                        if (component) {
                                            this.childValidState[this.props.formDefinition.Password.FieldName] = {
                                                empty: component.state.empty, valid: component.state.valid, validation: component.checkInput
                                            };
                                        }
                                    }}
                                    value={this.state.data.Password}
                                    updateInputText={this.updateInputText}
                                    errorData={this.state.errorData.Password}
                                    errorDataToNull={this.errorDataToNull}
                                />
                            </div>

                            <div className="col-md-6">
                                <TextInputPassword
                                    editMode={editModeTrue}
                                    enableSave={RegisterB2C.enableSave}
                                    content={this.props.formDefinition.ConfirmPassword}
                                    ref={(component) => {
                                        if (component) {
                                            this.childValidState[this.props.formDefinition.ConfirmPassword.FieldName] = {
                                                empty: component.state.empty, valid: component.state.valid, validation: component.checkInput
                                            };
                                        }
                                    }}
                                    value={this.state.data.ConfirmPassword}
                                    updateInputText={this.updateInputText}
                                    errorData={this.state.errorData.ConfirmPassword}
                                    errorDataToNull={this.errorDataToNull}
                                    passwordsEqual={this.state.passwordsEqual}
                                    passwordValue={this.state.passwordValue}
                                    passwordCheckingField="true"
                                    onKeyPress={() => this.setState({ showPasswordError: true })}
                                    showPasswordError={this.state.showPasswordError}
                                />
                            </div>
                        </div>

                        <hr data-tpl="lin01" />

                    </div>

                    <div className="FancyLink">
                        <Checkbox
                            content={this.props.formDefinition.TermsAndConditionsAccepted}
                            handleCheck={this.handleCheck}
                            enableSave={RegisterB2C.enableSave}
                            disableSave={this.disableSave}
                        />

                        <Checkbox
                            content={this.props.formDefinition.RequiresOnlineInvoices}
                            handleCheck={this.handleCheck}
                            enableSave={RegisterB2C.enableSave}
                            disableSave={this.disableSave}
                        />

                        <Checkbox
                            content={this.props.formDefinition.AgreeReceivePromotions}
                            handleCheck={this.handleCheck}
                        />

                        <hr data-tpl="lin01" />
                    </div>

                    <div className="FancyLink">
                        <h3 className="subheadline">{this.props.formDefinition.DataPrivacyHeader.Value}</h3>

                        <p dangerouslySetInnerHTML={{ __html: this.props.formDefinition.DataPavicyDescription.Value }} />

                        <p dangerouslySetInnerHTML={{ __html: this.props.formDefinition.MandatoryFields.Value }} />

                    </div>

                    <div className="formEdit__bottom-wrapper">

                        {this.state.generalMessage}

                        <Button
                            enableSave={!this.state.enableSave}
                            btnDefinition={this.props.formDefinition.SaveButton}
                            handleSubmit={this.handleSubmit}
                        />
                    </div>

                </div>
            </div>
        );
    }
}

export default function (container, formDefinition) {

    ReactDOM.render(<RegisterB2C formDefinition={civilizeFormDefinition(formDefinition)} />, container);

    factory(passwordIcon, document.querySelectorAll('input[type="password"]'));
}
