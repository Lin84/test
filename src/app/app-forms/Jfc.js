/*
 * Created by LTL
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
import { civilizeFDefinition, civilizeComponentsDefinition } from '../helpers';
import { Select } from './components/LiComponents';
import Ses from './components/Ses';
import errorHandler from '../fetching-data/errorHandle/errorHandler';
import { connect } from 'react-redux';
import { initJfc, updateCitySelect } from '../AC/jfc';
import { updateData, emptyData } from '../AC/data';

class Jfc extends Component {
    constructor() {
        super();

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeGenericError = this.removeGenericError.bind(this);
        this.renderGenericError = this.renderGenericError.bind(this);
        this.resetData = this.resetData.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);

        this.state = {
            genericErrorMsg: undefined,
            hideGenericError: undefined,
            resetSelect: false
        };

        this.allChild = {};
        this.originalData = {};
    }

    componentDidMount() {
        createLoadingCircle();
        showLoadingCircle();
        this.props.initJfc({ noConnectionErrorMessage: components.jfc01.NoConnectionErrorMessage });
    }

    componentWillReceiveProps(nextProps) {
        const { errorResponseGetRequest, selectDefinition } = nextProps;

        if (Object.keys(errorResponseGetRequest).length) {
            this.setState({ ...errorResponseGetRequest });
            removeLoadingCircle();
        }

        if (Object.keys(selectDefinition).length) {
            removeLoadingCircle();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { selectDefinition, data } = this.props;
        if (data.Country !== prevProps.data.Country && selectDefinition) {
            this.props.updateCitySelect({ country: data.Country, countriesPivot: selectDefinition.CountriesPivot, city: selectDefinition.originalCities });
        }

        if (data.Country !== prevProps.data.Country) {
            this.props.emptyData({ name: 'City' });
        }
    }

    removeGenericError() {
        this.setState({ hideGenericError: true });
    }

    updateInputValue(name, value) {
        this.props.updateData({ name, value });
    }

    resetData() {
        this.setState({ data: this.originalData });
    }

    handleSubmit() {
        createLoadingCircle();
        showLoadingCircle();
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
            this.originalData = updatedData;
            removeLoadingCircle();
        })
        .catch(error => {
            const errorResult = errorHandler({ componentBehaviour: 'post', errorResponse: error, noConnectionErrorMessage: innogyForm[this.props.formDefinition.FormIdentity].NoConnectionErrorMessage });

            this.setState({ ...errorResult });

            removeLoadingCircle();
        });

    }

    renderGenericError() {
        return (
            <div className="validation-summary-errors FancyErrorMessage">
                <p>{this.state.genericErrorMsg}</p>
            </div>
        );
    }

    render() {
        const { formDefinition, componentsDefinition, selectDefinition, data } = this.props;

        return (
            <div className="customJfc">
                <div
                    className="formEdit customForm"
                    data-tpl="form"
                    data-module="form" data-module-config=""
                >
                    <h2 className="headline" dangerouslySetInnerHTML={{ __html: componentsDefinition.Headline.Value || null }} />
                    <div className="formEdit__form">
                        <div className="row">
                            <div className="grid-content grid-content-1 col-sm-12 col-md-4">
                                <Select
                                    content={componentsDefinition.ExperienceLevel}
                                    selectDefinition={selectDefinition.ExperienceLevel}
                                    updateInputValue={this.updateInputValue}
                                    value={data.ExperienceLevel}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[componentsDefinition.ExperienceLevel.FieldName] = component;
                                        }
                                    }}
                                />
                            </div>
                            <div className="grid-content grid-content-2 col-sm-6 col-md-4">
                                <Select
                                    content={componentsDefinition.FunctionalArea}
                                    selectDefinition={selectDefinition.FunctionalArea}
                                    updateInputValue={this.updateInputValue}
                                    value={data.FunctionalArea}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[componentsDefinition.FunctionalArea.FieldName] = component;
                                        }
                                    }}
                                />
                            </div>
                            <div className="grid-content grid-content-2 col-sm-6 col-md-4">
                                <Select
                                    content={componentsDefinition.Company}
                                    selectDefinition={selectDefinition.Company}
                                    updateInputValue={this.updateInputValue}
                                    value={data.Company}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[componentsDefinition.Company.FieldName] = component;
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="grid-content col-sm-6">
                                <Select
                                    content={componentsDefinition.Country}
                                    selectDefinition={selectDefinition.Country}
                                    updateInputValue={this.updateInputValue}
                                    value={data.Country}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[componentsDefinition.Country.FieldName] = component;
                                        }
                                    }}
                                />
                            </div>
                            <div className="grid-content col-sm-6">
                                <Select
                                    content={componentsDefinition.City}
                                    selectDefinition={selectDefinition.City}
                                    updateInputValue={this.updateInputValue}
                                    value={data.City}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[componentsDefinition.City.FieldName] = component;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="grid-content col-xs-12">
                                <Ses
                                    content={componentsDefinition.Keyword}
                                    buttonDefinition={componentsDefinition.Search}
                                    updateInputValue={this.updateInputValue}
                                    value={data.Keyword}
                                    ref={(component) => {
                                        if (component) {
                                            this.allChild[componentsDefinition.Keyword.FieldName] = component;
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {this.state.hideGenericError === false ? this.renderGenericError() : null}

                    </div>
                </div>
            </div>
        );
    }
}

Jfc.defaultProps = {
    formDefinition: civilizeFDefinition(components.jfc01),
    componentsDefinition: civilizeComponentsDefinition(components.jfc01),
    errorResponseGetRequest: {}
};

export default connect((state) => {
    const { jfc, handleErrorGetRequest, data } = state;

    return {
        selectDefinition: jfc,
        errorResponseGetRequest: handleErrorGetRequest,
        data
    };
}, {
    initJfc,
    updateCitySelect,
    updateData,
    emptyData
})(Jfc);
