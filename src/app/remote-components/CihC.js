/*
 * Created by LTL
 */
import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import Cih from '../react-components/Cih';
import RemoteComponent from './RemoteComponent';
import TooltipCustom from '../app-forms/components/TooltipCustom';
import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
import { getCookie } from '../helpers';

class CihC extends RemoteComponent {
    static renderTextBubble(buttonDefinition, invoiceOnline) {
        if (!invoiceOnline && buttonDefinition.BubbleTooltip) {
            // ** to fix the overlapping with the off screen content ** //
            document.querySelector('#off-screen-content').style.zIndex = '10';
            return (
                <div className="bubble-text" dangerouslySetInnerHTML={{ __html: buttonDefinition.BubbleTooltip }} />
            );
        }
        return null;
    }

    static renderTooltip(tooltipText) {
        if (tooltipText) {
            return <TooltipCustom tooltipText={tooltipText} />;
        }
        return null;
    }

    static renderButton(contract) {
        let buttonDefinition;
        // let redirectLink;
        const ContractType = contract.ContractStatus.ContractType.toUpperCase();
        const invoiceOnline = JSON.parse(contract.ContractStatus.InvoiceAcceptedOnline);

        if (ContractType.localeCompare('FLATRATE') === 0) {
            return null;
        } else if (components.cih01c.Children.length > 1) {
            if (invoiceOnline) {
                components.cih01c.Children.map((button) => {
                    if (!button.BubbleTooltip) {
                        buttonDefinition = button;
                        // redirectLink = buttonDefinition.Link.TargetId;
                    }
                    return null;
                });
            } else if (!invoiceOnline) {
                components.cih01c.Children.map((button) => {
                    if (button.BubbleTooltip) {
                        buttonDefinition = button;
                        // redirectLink = buttonDefinition.Link.TargetId;
                    }
                    return null;
                });
            }
        } else {
            buttonDefinition = components.cih01c.Children[0];
            // redirectLink = '#';
        }

        if (buttonDefinition.Link) {
            return (
                <div className="cnt03" >
                    <a href={buttonDefinition.Link.TargetId} title="" className="btn color-cta-3">{buttonDefinition.Text}</a>
                    { CihC.renderTextBubble(buttonDefinition, invoiceOnline) }
                    { CihC.renderTooltip(buttonDefinition.Tooltip) }
                </div>
            );
        }
        return null;
    }

    constructor(props) {
        super(props);

        this.renderCihC = this.renderCihC.bind(this);
    }

    componentWillMount() {
        const ContractNumber = getCookie('ContractNumber');
        if (ContractNumber === null) {
            this.setState({
                ContractNumber: null
            });
        } else {
            this.setState({ ContractNumber });
        }
    }

    componentDidMount() {
        this.getData(this.props.definition.ApiEndpoint);
    }

    renderCihC() {
        const { Contracts } = this.state.data;
        const listOfContracts = [];

        if (Contracts) {
            Contracts.map((contract, index) => {
                if (this.state.ContractNumber === contract.ContractNumber) {
                    listOfContracts.push(
                        <div key={contract.ContractNumber}>
                            <div data-tpl="cih01" className="cih01--cta">
                                <Cih definition={components.cih01c} contract={contract} />
                                { CihC.renderButton(contract) }
                            </div>
                        </div>
                    );
                }
                return listOfContracts;
            });
            return listOfContracts;
        }
        return null;
    }

    render() {
        return (
            <div>
                <div className="pl-16">
                    {this.state.emptyData ? RemoteComponent.renderEmptyDataText(components.cih01c.EmptyDataMessage) : null}
                </div>
                <div>
                    {this.state.ContractNumber === null ? this.renderGenericError() : this.renderCihC()}
                    {this.state.hideGenericError === false ? this.renderGenericError() : null}
                </div>
            </div>
        );
    }
}

export default function (container, definition) {
    render(<CihC definition={definition} />, container);
}
