/*
 * Created by LTL
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TooltipCustom from './TooltipCustom';

export default class Ses extends Component {
    constructor() {
        super();

        this.renderTooltip = this.renderTooltip.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        this.props.updateInputValue(event.target.name, event.target.value);
    }

    /* eslint-disable*/
    handleClick() {
        console.log('click');
    }
    /* eslint-enable*/

    renderTooltip() {
        if (this.props.content.Tooltip) {
            return <TooltipCustom tooltipText={this.props.content.Tooltip} />;
        }
        return null;
    }

    render() {
        const { content, value, editMode, displayValidationMsg, ifRequired, buttonDefinition } = this.props;
        let requiredClass;
        const inputClass = classNames({
            'form-group': true,
            error: displayValidationMsg && !this.state.valid,
            hidden: !editMode
        });

        return (
            <fieldset>
                <div className={`${inputClass} ${requiredClass} customSes__container`} data-tpl="cde-input">
                    <label htmlFor={content.FieldName}>{content.Label}</label>
                    <div className="formEdit__content customSes">
                        <input
                            id={content.FieldName}
                            name={content.FieldName}
                            type={content.ControlType}
                            className="form-control"
                            placeholder={content.Placeholder}
                            onChange={this.handleChange}
                            value={value}
                            maxLength={content.MaxLength === 0 ? null : content.MaxLength}
                        />
                        <div className="input-group-btn">
                            <button type="button" className="btn color-cta-3" onClick={this.handleClick}>{buttonDefinition.Label}</button>
                        </div>
                        {this.renderTooltip()}
                    </div>
                </div>
            </fieldset>
        );

        // return (
        //     <div
        //         data-tpl="ses01"
        //         data-service-url="http://localhost:5500/api/autocomplete.json"
        //         data-service-id="23e32b3a35beadce32"
        //         data-search-url="http://localhost:5500/serp.html"
        //     >
        //         <div className="container">
        //             <div data-tpl="form" data-module="form" data-module-config="">
        //                 <form>
        //                     <div className="form-group autocomplete">
        //                         <div className="input-group search">
        //                             <input
        //                                 name="search"
        //                                 type="search"
        //                                 className="form-control form-control search-input"
        //                                 placeholder="Bitte geben Sie hier Ihre Frage ein"
        //                                 autoComplete="off"
        //                             />
        //                             <div className="input-group-btn">
        //                                 <button type="submit" className="btn color-cta-3 search-button">Suchen</button>
        //                             </div>
        //                         </div>
        //                         <ol className="suggestions" />
        //                     </div>
        //                 </form>
        //             </div>
        //         </div>
        //     </div>
        // );
    }
}

Ses.defaultProps = {
    value: '',
    editMode: true
};


Ses.propTypes = {
    content: PropTypes.object.isRequired,
    editMode: PropTypes.bool,
    updateInputValue: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
};
