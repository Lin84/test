/*
 * Created by LTL
 */
import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';

import MultistepForm from './components/MultistepForm';

const InBetweenInvoice = (props) => {
    return (
        <div id="InBetweenInvoice" className="formEdit customForm" data-tpl="form" data-module="form" data-module-config="">
            <MultistepForm formDefinition={props.formDefinition} />
        </div>
    );
};

export default function(container, formDefinition) {
    render(<InBetweenInvoice formDefinition={formDefinition} />, container);
}

InBetweenInvoice.propTypes = {
    formDefinition: PropTypes.object.isRequired
};
