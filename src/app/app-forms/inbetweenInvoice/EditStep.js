import React, { PropTypes, Component } from 'react';
import { Button, Select } from '../components/LiComponents';
import EnergyEdit from '../components/EnergyEdit';
import EnergyView from '../components/EnergyView';

export default class EditStep extends Component {
    renderCorrectionReason() {
        if (!this.props.showCorrectionReason) return null;
        const editMode = true;
        return (
            <Select
                content={this.props.definition.CorrectionReason}
                displayValidationMsg={this.props.displayValidationMsg}
                editMode={editMode}
                enableSave={this.props.enableSave}
                errorData={this.props.errorData.CorrectionReason}
                updateInputValue={this.props.handleCorrectionReasonChange}
                value={this.props.correctionReason}
                ref={el => this.props.addSelectRef(el)}
            />
        );
    }

    renderItems() {
        const {
            allChild,
            data,
            definition,
            displayValidationMsg,
            enableSave,
            errorData,
            handleDataChange,
            originalData,
            toEnableSave,
            missingRequiredFields
        } = this.props;

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
                        <EnergyEdit
                            groupIndex={i}
                            data={item}
                            addDatepickerRef={this.props.addDatepickerRef}
                            definition={definition}
                            displayValidationMsg={displayValidationMsg}
                            errorData={errorData}
                            enableSave={enableSave}
                            toEnableSave={toEnableSave}
                            label={item.label}
                            handleDataChange={handleDataChange}
                            missingRequiredFields={missingRequiredFields[i]}
                        />
                    </div>
                </div>
            </li>
        ));
    }

    render() {
        const { definition } = this.props;

        return (
            <div>
                <div className="AditionalInformation" dangerouslySetInnerHTML={{ __html: definition.Description.Value }} />
                {this.renderCorrectionReason()}
                <ul data-tpl="energyList">
                    {this.renderItems()}
                </ul>
                <hr data-tpl="lin01" className="color-line-1" />
                <div className="mb-22 formEdit__bottom-wrapper">
                    <Button
                        enableSave={!this.props.enableSave}
                        btnDefinition={definition.ContinueButton}
                        handleSubmit={this.props.handleSubmit}
                    />
                </div>
            </div>
        );
    }
}

EditStep.propTypes = {
    addDatepickerRef: PropTypes.func.isRequired,
    handleDataChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    missingRequiredFields: PropTypes.object.isRequired
};
