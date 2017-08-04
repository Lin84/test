/*
 * Created by LTL
 */
import React from 'react';

export default class Button extends React.Component {
    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        const { btnDefinition, handleSubmit, toggleMode, resetData } = this.props;

        if (handleSubmit) {
            handleSubmit();
        } else if (btnDefinition.FieldName === 'CancelButton') {
            toggleMode();
            resetData();

            // ** onclick cancel btn hide the generic error msg, will rename the method** //
            if (this.props.receivedDataToTrue) {
                this.props.receivedDataToTrue();
            }
        } else if (btnDefinition.FieldName === 'EditButton') {
            toggleMode();
        }
    }

    render() {
        const { btnDefinition, enableSave, receivedData } = this.props;

        return (
            <button
                title={btnDefinition.Label}
                className={`btn ${btnDefinition.Class} ${enableSave || receivedData === false ? 'disabled' : ''}`}
                onClick={this.handleClick}
            >
                {btnDefinition.Label}
            </button>
        );
    }
}
