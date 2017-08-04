import React from 'react';

import TooltipCustom from './TooltipCustom';
import ErrorBlock from './ErrorBlock';

export default class Checkbox extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            checked: false,
            valid: true
        };
    }

    handleClick() {
        this.setState({ checked: !this.state.checked });
        this.props.handleCheck(this.props.content.FieldName);
    }

    renderTooltip() {
        if (this.props.content.Tooltip) {
            return <TooltipCustom tooltipText={this.props.content.Tooltip} />;
        }
        return null;
    }

    render() {
        const { content } = this.props;

        return (
            <div className={`form-group info checkbox-group ${this.props.content.Required ? 'required' : ''}`}>
                <div className="formEdit__content">
                    <div className="checkbox">
                        <input
                            id={content.FieldName}
                            name={content.CheckboxName}
                            type="checkbox"
                            onClick={this.handleClick}
                        />
                        <input
                            id={`${content.FieldName}-hidden`}
                            name={content.CheckboxName}
                            type="hidden"
                        />
                        <label htmlFor={content.FieldName}>
                            <span dangerouslySetInnerHTML={{ __html: content.CheckboxLabel }} />
                        </label>
                    </div>
                    {this.renderTooltip()}
                </div>
            </div>
        );
    }
}
