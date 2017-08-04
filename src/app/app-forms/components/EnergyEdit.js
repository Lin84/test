import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EnergyDataInput } from './LiComponents';
import { displayMathUnit, getErrorMessage } from '../../helpers';
import Date from './com.Date';

export default class EnergyEdit extends Component {
    renderSingle(fields) {
        const field = fields[0];
        const {
            definition,
            displayValidationMsg,
            errorData,
            enableSave,
            handleDataChange,
            groupIndex,
            missingRequiredFields
        } = this.props;

        return (
            <div className="row mb-22">
                <div className="col-xs-6">
                    <p>{definition.ReadingDate.Value}</p>
                    <Date
                        errorData={getErrorMessage(missingRequiredFields[0], 'date', definition.ReadingDateInput.RequiredWarningMessage)}
                        addDatepickerRef={el => this.props.addDatepickerRef(groupIndex, 0, el)}
                    />
                </div>
                <div className="col-xs-6">
                    <p>{definition.PayBalance.Value}</p>
                    <div className="energy-item__data">
                        <EnergyDataInput
                            content={definition.PayBalanceInput}
                            displayValidationMsg={displayValidationMsg}
                            errorData={errorData.PayBalanceInput || getErrorMessage(missingRequiredFields[0], 'reading', definition.PayBalanceInput.RequiredWarningMessage)}
                            enableSave={enableSave}
                            toEnableSave={this.props.toEnableSave}
                            handleChange={value => handleDataChange(groupIndex, 0, 'reading', value)}
                        />
                        <p className="energy-item__unitEdit" dangerouslySetInnerHTML={{ __html: displayMathUnit(field.unit) }} />
                    </div>
                </div>
            </div>
        );
    }

    renderMultiple(fields) {
        const {
            definition,
            displayValidationMsg,
            errorData,
            enableSave,
            handleDataChange,
            groupIndex,
            missingRequiredFields
        } = this.props;

        return (
            <div>
                <div className="row mb-22">
                    <div className="col-xs-6 " style={{ zIndex: 2 }}>
                        <p>{definition.ReadingDate.Value}</p>
                        <div className="energy-item__data datepickerWidth">
                            <span className="energy-item__unitEdit">{fields[0].type}</span>
                            <Date
                                errorData={getErrorMessage(missingRequiredFields[0], 'date', definition.ReadingDateInput.RequiredWarningMessage)}
                                addDatepickerRef={el => this.props.addDatepickerRef(groupIndex, 0, el)}
                            />
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <p>{definition.PayBalance.Value}</p>
                        <div className="energy-item__data">
                            <EnergyDataInput
                                content={definition.PayBalanceInput}
                                displayValidationMsg={displayValidationMsg}
                                errorData={errorData.PayBalanceInput || getErrorMessage(missingRequiredFields[0], 'reading', definition.PayBalanceInput.RequiredWarningMessage)}
                                enableSave={enableSave}
                                toEnableSave={this.props.toEnableSave}
                                handleChange={value => handleDataChange(groupIndex, 0, 'reading', value)}
                            />
                            <span className="energy-item__unitEdit" dangerouslySetInnerHTML={{ __html: displayMathUnit(fields[0].unit) }} />
                        </div>
                    </div>
                </div>
                <div className="row mb-22">
                    <div className="col-xs-6">
                        <div className="energy-item__data datepickerWidth">
                            <span className="energy-item__unitEdit">{fields[1].type}</span>
                            <Date
                                errorData={getErrorMessage(missingRequiredFields[1], 'date', definition.ReadingDateInput.RequiredWarningMessage)}
                                addDatepickerRef={el => this.props.addDatepickerRef(groupIndex, 1, el)}
                            />
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="energy-item__data">
                            <EnergyDataInput
                                content={definition.PayBalanceInput}
                                displayValidationMsg={displayValidationMsg}
                                errorData={errorData.PayBalanceInput || getErrorMessage(missingRequiredFields[1], 'reading', definition.PayBalanceInput.RequiredWarningMessage)}
                                enableSave={enableSave}
                                toEnableSave={this.props.toEnableSave}
                                handleChange={value => handleDataChange(groupIndex, 1, 'reading', value)}
                            />
                            <span className="energy-item__unitEdit" dangerouslySetInnerHTML={{ __html: displayMathUnit(fields[1].unit) }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const fields = this.props.data.register;
        return (
            <div>
                {fields.length > 1
                    ? this.renderMultiple(fields)
                    : this.renderSingle(fields)}
            </div>
        );
    }
}

EnergyEdit.propTypes = {
    addDatepickerRef: PropTypes.func.isRequired,
    handleDataChange: PropTypes.func.isRequired,
    groupIndex: PropTypes.number.isRequired,
    missingRequiredFields: PropTypes.array.isRequired
};
