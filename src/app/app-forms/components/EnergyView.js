import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { convertDate, numberWithDot, displayMathUnit } from '../../helpers';

export default class EnergyView extends Component {
    constructor() {
        super();

        this.EnergyView = this.EnergyView.bind(this);
    }

    EnergyView(energyData) {
        const { readingDate, payBalance } = this.props;
        if (energyData.length > 1) {
            return (
                <div className="mb-22">
                    <div className="row">
                        <div className="col-xs-6">
                            <p>{readingDate.Value}</p>
                            <div className="energy-item__data">
                                <span>{energyData[0].type}</span> {convertDate(energyData[0].date, true)}
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <p>{payBalance.Value}</p>
                            <div className="energy-item__data">
                                <span>{numberWithDot(energyData[0].reading)}</span>
                                <span dangerouslySetInnerHTML={{ __html: displayMathUnit(energyData[0].unit) }} />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-22">
                        <hr data-tpl="lin01" className="color-line-1" />
                        <div className="col-xs-6">
                            <div className="energy-item__data">
                                <span>{energyData[1].type}</span> {convertDate(energyData[1].date, true)}
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className="energy-item__data">
                                <span>{numberWithDot(energyData[1].reading)}</span>
                                <span dangerouslySetInnerHTML={{ __html: displayMathUnit(energyData[1].unit) }} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="row mb-22">
                <div className="col-xs-6">
                    <p>{readingDate.Value}</p>
                    <div className="energy-item__data">{convertDate(energyData[0].date, true)}</div>
                </div>
                <div className="col-xs-6">
                    <p>{payBalance.Value}</p>
                    <div className="energy-item__data">
                        <span>{numberWithDot(energyData[0].reading)}</span>
                        <span dangerouslySetInnerHTML={{ __html: displayMathUnit(energyData[0].unit) }} />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>{ this.EnergyView(this.props.data.register) }</div>
        );
    }
}

EnergyView.propTypes = {
    data: PropTypes.object.isRequired,
    payBalance: PropTypes.object.isRequired,
    readingDate: PropTypes.object.isRequired
};
