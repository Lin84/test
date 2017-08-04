import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Hpn extends Component {
    renderIcon() {
        if (!this.props.hpnDefinition) { return null; }

        const { Type, Icon } = this.props.hpnDefinition;

        if (Type.Value.toLowerCase() === 'icons') {

            if (!Icon || Icon === undefined || Icon === null) {
                return (
                    <div role="presentation" className="image">
                        <svg
                            data-tpl="svg"
                            data-module="animation"
                            data-animation="check_checkbox"
                            data-animation-config=""
                            id="svg-426"
                            width="133px"
                            height="200px"
                            viewBox="0 0 133 200"
                        >
                            <path
                                d="M61.207,199.738c2.002-0.131,3.73-1.44,4.396-3.328L132.719,6.883c0.912-2.599-0.463-5.444-3.071-6.355
                                    c-2.604-0.904-5.465,0.459-6.377,3.061L60.035,182.061L9.473,82.883c-1.249-2.458-4.264-3.44-6.727-2.198
                                    c-2.467,1.244-3.453,4.245-2.207,6.702l55.875,109.628c0.854,1.686,2.586,2.735,4.461,2.735
                                    C60.986,199.75,61.097,199.747,61.207,199.738z"
                            />
                        </svg>
                    </div>
                );
            }

            return <div role="presentation" className="image" dangerouslySetInnerHTML={{ __html: Icon }} />;
        }

        return <div role="presentation" className="image" />;
    }

    renderTabs() {
        const tabs = [];
        let selectedStep;
        let disabledStep;

        this.props.definition.map((step, index) => {
            if (this.props.currentStep - 1 === index) {
                selectedStep = 'true';
                disabledStep = 'false';
            } else if (this.props.currentStep - 1 < index) {
                selectedStep = 'false';
                disabledStep = 'true';
            }

            tabs.push(
                <li
                    key={step} role="tab"
                    aria-labelledby={`test hpn-step-${index + 1}`}
                    aria-selected={selectedStep}
                    aria-disabled={disabledStep}
                >
                    <a>
                        { this.renderIcon() }
                        <h3 id={`hpn-step-${index + 1}`}>{step}</h3>
                    </a>
                </li>
            );
            return tabs;
        });
        return tabs;
    }

    render() {
        const { hpnDefinition, definition, currentStep } = this.props;
        if (hpnDefinition) {
            return (
                <nav
                    id="hpn01"
                    role="navigation"
                    data-tpl="hpn01"
                    className={`${hpnDefinition.Type.Value.toLowerCase() === 'icons' ? '' : 'hpn01--numbered'}`}
                >
                    <ol role="tablist">
                        { this.renderTabs() }
                    </ol>
                    <h3 id="test">{definition[currentStep - 1]}</h3>
                </nav>
            );
        }
        return <div />;
    }
}

Hpn.propTypes = {
    hpnDefinition: PropTypes.shape({
        Type: PropTypes.shape({
            Value: PropTypes.string
        }),
        Icon: PropTypes.string
    }).isRequired,
    currentStep: PropTypes.number.isRequired,
    definition: PropTypes.array.isRequired
};
