/*
 * Created by LTL
 */
import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import InvoiceDetailsItem from '../react-components/InvoiceDetailsItem';
import RemoteComponent from './RemoteComponent';
import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
import { getCookie, hideComponent } from '../helpers';

class InvoiceDetailsCollection extends RemoteComponent {
    static renderLin(index, InvoiceListItemsLength) {
        if (index + 1 < InvoiceListItemsLength) {
            return <hr data-tpl="lin01" className="color-line-1 mb-0 mt-0" />;
        }
        return null;
    }

    constructor(props) {
        super(props);

        this.renderImportantMessage = this.renderImportantMessage.bind(this);
        this.renderInvoices = this.renderInvoices.bind(this);
    }

    componentDidMount() {
        const ApiEndpoint = `${this.props.definition.ApiEndpoint}?ContractNumber=${getCookie('ContractNumber')}`;
        this.getData(ApiEndpoint);

        // DFD - 4322 - hide back button in detail page if customer has only one contract
        const backButton = document.querySelector('[data-tpl="bnv01"]');
        const hideBackButton = JSON.parse(getCookie('hideBackButton'));
        hideComponent({ component: backButton, ifHideComponent: hideBackButton });
    }

    renderImportantMessage() {
        if (this.props.definition.ImportantMessage) {
            return (
                <div key="ImportantMessage">
                    <div data-tpl="cih01" className="cih01--cta mb-22">
                        <div dangerouslySetInnerHTML={{ __html: this.props.definition.ImportantMessage }} />
                    </div>
                </div>
            );
        }
        return null;
    }

    renderInvoices() {
        const { InvoiceListItems } = this.state.data;
        let AllInvoices = [];

        if (InvoiceListItems) {
            AllInvoices = InvoiceListItems.map((invoice, index) =>
                <div key={invoice.InvoiceNumber}>
                    <div data-tpl="cih01" className="cih01--cta">
                        <InvoiceDetailsItem
                            definition={components.invoiceDetailsItem}
                            invoice={invoice}
                            InvoiceCorrectionUrl={this.props.definition.InvoiceCorrectionUrl}
                            pdfUrl={this.props.definition.PdfUrl}
                        />
                        { InvoiceDetailsCollection.renderLin(index, InvoiceListItems.length) }
                    </div>
                </div>
            );
        }
        return AllInvoices;
    }

    render() {
        return (
            <div>
                <div className="pl-16">
                    { this.state.emptyData ? RemoteComponent.renderEmptyDataText(components.invoiceDetailsCollection.EmptyDataMessage) : null }
                </div>
                <div>
                    { this.state.emptyData ? null : this.renderImportantMessage() }
                    { this.renderInvoices() }
                    { this.state.hideGenericError === false ? this.renderGenericError() : null }
                </div>
            </div>
        );
    }
}

export default function (container, definition) {
    render(<InvoiceDetailsCollection definition={definition} />, container);
}
