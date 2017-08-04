import React, { Component, PropTypes } from 'react';
import { Button, Checkbox, Select } from '../components/LiComponents';
import EnergyView from '../components/EnergyView';
import EnergyEdit from '../components/EnergyEdit';

export default class ConfirmationStep extends Component {
    renderCorrectionReason() {
        if (!this.props.showCorrectionReason) return null;
        const { CorrectionLabel } = this.props.definition;
        return (
            <div className="correctionReason mb-22">
                <h3>{ CorrectionLabel.Value }</h3>
                <p>{ this.props.correctionReason }</p>
            </div>
        );
    }

    renderItems() {
        const { data, originalData, definition } = this.props;
        return data.map((item, i) => (
            <li key={item.id}>
                <div className="energy-item ta-l mb-22">
                    <div className="energy-item__head">
                        <h2>{item.label}</h2>
                        <p className="energy-item__id">{`${definition.CounterNumber.Value}: ${item.id}`}</p>
                    </div>
                    <div className="energy-item__body">
                        <h3>{definition.LastEntry.Value}</h3>
                        <EnergyView
                            data={originalData[i]}
                            readingDate={definition.ReadingDate}
                            payBalance={definition.PayBalance}
                        />
                        <h3>{definition.NewEntry.Value}</h3>
                        <EnergyView
                            data={data[i]}
                            readingDate={definition.ReadingDate}
                            payBalance={definition.PayBalance}
                        />
                    </div>
                </div>
            </li>
        ));
    }

    renderAdditionalInformation() {
        const { AdditionalInformation, WarningMessage } = this.props.definition;
        const additionalInformation = [];

        if (AdditionalInformation) {
            additionalInformation.push(
                <div data-tpl="cih01" className="cih01--cta mb-22 ta-l" key={AdditionalInformation.FieldName}>
                    <p>{AdditionalInformation.Value}</p>
                </div>
            );
        }

        if (WarningMessage) {
            additionalInformation.push(
                <div data-tpl="cih01" className="cih01--cta mb-22 ta-l" key={WarningMessage.FieldName}>
                    <p>{WarningMessage.Value}</p>
                </div>
            );
        }
        return additionalInformation;
    }

    renderCheckbox() {
        if (this.props.showCheckbox) {
            return (
                <div>
                    <div className="validation-summary-errors FancyErrorMessage AdditionalInformation" >
                        <p>{this.props.toleranceLimitMsg}</p>
                    </div>
                    <Checkbox
                        content={this.props.definition.Confirmation}
                        handleCheck={this.props.handleCheck}
                        toEnableSave={this.props.toEnableSave}
                        value={this.props.confirmationChecked}
                    />
                </div>
            );
        }

        return null;
    }

    render() {
        const { definition } = this.props;

        return (
            <div>
                { this.renderCorrectionReason() }
                <ul data-tpl="energyList">
                    { this.renderItems() }
                </ul>
                { this.renderAdditionalInformation() }
                { this.renderCheckbox() }
                <div className="mb-22 formEdit__bottom-wrapper">
                    <Button
                        btnDefinition={definition.BackButton}
                        toggleMode={this.toggleMode}
                        resetData={this.resetData}
                        hideValidationMsg={this.hideValidationMsg}
                        removeGenericError={this.removeGenericError}
                        handleSubmit={this.props.handleBack}
                    />
                    <Button
                        enableSave={!this.props.confirmationChecked}
                        btnDefinition={definition.SaveButton}
                        handleSubmit={this.props.handleSubmit}
                    />
                </div>
            </div>
        );
    }
}

ConfirmationStep.propTypes = {
    handleSubmit: PropTypes.func.isRequired
};
