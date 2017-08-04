/*
 * Created by LTL
 */
import React, { Component } from 'react';
import axios from 'axios';

export default class Cih extends Component {
    constructor(props) {
        super(props);

        this.renderHeadline = this.renderHeadline.bind(this);
    }

    renderHeadline() {
        let headline;
        if (this.props.contract) {
            headline = (
                <h2 className="headline">
                    {`${this.props.contract.ContractMeterReadingAddress.PlacePostCode} ${this.props.contract.ContractMeterReadingAddress.Location1} ${this.props.contract.ContractMeterReadingAddress.Street} ${this.props.contract.ContractMeterReadingAddress.HouseNumber1}`}
                </h2>
            );
        } else {
            headline = <h2 className="headline">{this.props.invoice.bezeichnung}</h2>;
        }
        return headline;
    }

    render() {
        const contractNumber = this.props.contract ? this.props.contract.ContractNumber : this.props.invoice.vertragskontonummer;
        return (
            <div className="cnt01">
                {this.renderHeadline()}
                <div>
                    <span>
                    {`${this.props.definition.ShortText}: ${contractNumber}`}
                    </span>
                </div>
            </div>
        );
    }
}
