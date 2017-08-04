import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';

import EnergyView from '../components/EnergyView';

export default class SuccessStep extends Component {
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
        return data.map((key, i) => (
            <li key={key.label}>
                <div className="energy-item ta-l mb-22">
                    <div className="energy-item__head">
                        <h2>{key.label}</h2>
                        <p className="energy-item__id">{`${definition.CounterNumber.Value}: ${key.id}`}</p>
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

    render() {
        const { Description, SuccessMessage } = this.props.definition;

        return (
            <div>
                <div key={Description.FieldName} className="AditionalInformation ta-l mb-22" dangerouslySetInnerHTML={{ __html: Description.Value }} />
                { this.renderCorrectionReason() }
                <ul data-tpl="energyList">

                    { this.renderItems() }
                    <li key="SuccessMessage">
                        <p className="customForm__submit customForm__submit_success ta-l">
                            {SuccessMessage || null}
                        </p>
                    </li>
                </ul>
            </div>
        );
    }
}
