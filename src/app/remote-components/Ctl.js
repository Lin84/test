/*
 * Created by LTL
 */
import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import RemoteComponent from './RemoteComponent';
import Cih from '../react-components/Cih';
import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';

import { setCookie } from '../helpers';

class Ctl extends RemoteComponent {
    static handleClick(ContractNumber) {
        setCookie('ContractNumber', ContractNumber);
    }

    constructor(props) {
        super(props);

        this.renderContract = this.renderContract.bind(this);
    }

    componentDidMount() {
        this.getData(this.props.definition.ApiEndpoint);
    }

    renderContract() {
        const { Contracts } = this.state.data;
        let listOfContracts = [];
        if (Contracts) {
            if (Contracts.length > 1) {
                // DFD - 4322 - hide back button in detail page if customer has only one contract:
                setCookie('hideBackButton', false);
                listOfContracts = Contracts.map((contract, index) =>
                    <li key={contract.ContractNumber}>
                        <a
                            href={components.ctl01.RedirectEndpoint}
                            className="icon icon-arrow_link_internal" onClick={() => Ctl.handleClick(contract.ContractNumber)}
                        >
                        <div data-tpl="cih01" className="cih01--cta">
                            <Cih definition={components.cih01a} contract={contract} />
                        </div>
                        </a>
                    </li>
                );
            } else {
                setCookie('ContractNumber', Contracts[0].ContractNumber);
                setCookie('hideBackButton', true);
                window.location.href = components.ctl01.RedirectEndpoint;
            }
        }
        return listOfContracts;
    }

    render() {
        return (
            <div>
                {this.state.emptyData ? RemoteComponent.renderEmptyDataText(components.ctl01.EmptyDataMessage) : null}
                <ul>
                    {this.renderContract()}
                    {this.state.hideGenericError === false ? this.renderGenericError() : null}
                </ul>
            </div>
        );
    }
}

export default function (container, definition) {
    render(<Ctl definition={definition} />, container);
}
