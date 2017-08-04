/*
 * Created by LTL
 */
import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';

import MultistepForm from './components/MultistepForm';

const CorrectInvoice = (props) => {
    return (
        <div id="CorrectInvoice" className="formEdit customForm" data-tpl="form" data-module="form" data-module-config="">
            <MultistepForm
                showCorrectionReason
                formDefinition={props.formDefinition}
            />
        </div>
    );
};

export default function(container, formDefinition) {
    render(<CorrectInvoice formDefinition={formDefinition} />, container);
}

CorrectInvoice.propTypes = {
    formDefinition: PropTypes.object.isRequired
};
