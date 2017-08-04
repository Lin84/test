import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ErrorBlock from './ErrorBlock';
import TooltipCustom from './TooltipCustom';
import { getToday } from '../../helpers';

// ORIGINAL CONFIGE = TO REMOVE
// const defaultConfig = {
//     'monthsFull': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
//     'monthsShort': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
//     'weekdaysFull': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
//     'weekdaysShort': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
//     'today': 'Heute',
//     'labelMonthNext': 'Nächster Monat',
//     'labelMonthPrev': 'Vorheriger Monat',
//     'labelMonthSelect': 'Monat auswählen',
//     'labelYearSelect': 'Jahr auswählen',
//     'format': 'dd.mm.yyyy',
//     'formatSubmit': 'yyyymmdd',
//     'hiddenPrefix': false,
//     'hiddenSuffix': false,
//     'hiddenName': '{{HIDDEN_INPUT_NAME}}',
//     'firstDay': 1,
//     'min': [1970, 1, 1],
//     'max': [2030, 1, 1],
//     'selectYears': 30
// };

const defaultConfig = {
    monthsFull: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    weekdaysFull: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    today: 'Heute',
    labelMonthNext: 'Nächster Monat',
    labelMonthPrev: 'Vorheriger Monat',
    labelMonthSelect: 'Monat auswählen',
    labelYearSelect: 'Jahr auswählen',
    format: 'dd.mm.yyyy',
    formatSubmit: 'yyyymmdd',
    hiddenPrefix: false,
    hiddenSuffix: false,
    hiddenName: '',
    firstDay: 1,
    min: [1970, 1, 1],
    max: [2030, 1, 1],
    selectYears: 30
};

class Date extends Component {
    render() {
        defaultConfig.max = getToday();
        const label = this.props.object ? this.props.object.Label : 'label';
        const config = this.props.object ? this.props.object.Config : defaultConfig;
        const className = classNames({
            'form-group': true,
            error: this.props.errorData
        });

        return (
            <div className={className}>
                <label htmlFor="Date">{label}</label>
                <div className="formEdit__form">
                    <div
                        className="input-group date-group"
                        ref={this.props.addDatepickerRef}
                    >
                        <input
                            id="Date"
                            name="Date"
                            type="date"
                            className="form-control form-control"
                            placeholder="DD/MM/YYYY"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            data-element="datepicker"
                            data-element-config={JSON.stringify(defaultConfig)}
                        />
                        <div className="input-group-btn date-group-btn icon">
                            <i className="icon icon-calendar" />
                        </div>
                    </div>
                </div>
                <ErrorBlock errorText={this.props.errorData} />
            </div>
        );
    }
}

export default Date;

Date.defaultProps = {
    errorData: ''
};

Date.propTypes = {
    addDatepickerRef: PropTypes.func.isRequired,
    errorData: PropTypes.string
};
