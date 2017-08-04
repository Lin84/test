/*
 * Created by LTL
 */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import download from 'downloadjs';
import TooltipCustom from '../app-forms/components/TooltipCustom';
import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
import { getCookie, setCookie } from '../helpers';
import badRequest from '../fetching-data/errorHandle/badRequest';
import internalError from '../fetching-data/errorHandle/internalError';

export default class InvoiceDetailsItem extends React.Component {
    static handleClickCorrection(InvoiceNumber) {
        setCookie('InvoiceNumber', InvoiceNumber);
    }

    constructor(props) {
        super(props);

        this.state = {
            genericErrorMsg: '404 no connection',
            hideGenericError: undefined,
            downloadText: props.definition.DisplayPdfLabel
        };

        this.handleClickDownloadFile = this.handleClickDownloadFile.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.renderDownload = this.renderDownload.bind(this);
        this.renderGenericError = this.renderGenericError.bind(this);
    }

    handleClickDownloadFile(url, contract, InvoiceNumber) {
        setCookie('InvoiceNumber', InvoiceNumber);
        const address = `${url}?ContractNumber=${contract}&InvoiceNumber=${InvoiceNumber}`;

        createLoadingCircle();
        showLoadingCircle();

        defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';
        axios(address, {
            method: 'GET',
            headers: defaultHeaders
        }).then(response => {
            this.setState({
                hideGenericError: true
            });
            download(atob(response.data.PDFdata), `invoice-${InvoiceNumber}.pdf`);
            setTimeout(() => {
                removeLoadingCircle();
            }, 1000);

        }).catch(error => {
            switch (error.response.status) {
                case 500: {
                    this.setState({
                        genericErrorMsg: internalError({ errorResponse: error })
                    });
                    break;
                }

                case 400: {
                    this.setState({
                        genericErrorMsg: badRequest({ errorResponse: error })
                    });
                    break;
                }

                default: {
                    this.setState({
                        genericErrorMsg: '404 - We are really sory, please try later.'
                    });
                }
            }
            this.setState({ hideGenericError: false });
            setTimeout(() => {
                removeLoadingCircle();
            }, 1000);
        });
    }

    renderButton() {
        const { invoice, definition, InvoiceCorrectionUrl } = this.props;

        if (invoice.IsCorrectable) {
            return (
                <a
                    href={InvoiceCorrectionUrl}
                    title=""
                    className="btn color-cta-3 mb-22"
                    onClick={() => { InvoiceDetailsItem.handleClickCorrection(invoice.InvoiceNumber); }}
                >
                    { definition.CorrectionLabel }
                </a>
            );
        }
        return null;
    }

    renderDownload() {
        const { invoice, definition, pdfUrl } = this.props;
        const ContractNumber = getCookie('ContractNumber');

        if (definition.DisplayPdfLabel) {
            return (
                <div className="ta-c mb-22">
                    <a
                        href="#download-invoice"
                        title="Link Title"
                        className="link link--download"
                        onClick={() => { this.handleClickDownloadFile(pdfUrl, ContractNumber, invoice.InvoiceNumber); }}
                    >
                        {this.state.downloadText}
                    </a>
                </div>
            );
        }
        return null;
    }

    renderGenericError() {
        return (
            <div className="validation-summary-errors FancyErrorMessage mb-0">
                <p>{this.state.genericErrorMsg}</p>
            </div>
        );
    }

    render() {
        const { definition, invoice } = this.props;
        return (
            <div data-tpl="invoiceDetailsItem">
                <h2 className="headline">{`${definition.BillDateLabel}: ${invoice.DocumentDate}`}</h2>
                <div>{`${definition.InvoiceAmountLabel}: ${invoice.TransactionAmount} ${invoice.Currency}`}</div>
                <div>{`${definition.BillingPeriodLabel}: ${invoice.StartBillingPeriod} ${definition.ToLabel} ${invoice.EndBillingPeriod}`}</div>
                <div>{`${definition.InvoiceStatusLabel} ${invoice.Status}`}</div>
                <div className="ta-r">
                    <div className="mb-22 ta-c d-ib">
                        { this.renderDownload() }
                        { this.renderButton() }
                    </div>
                </div>
                {this.state.hideGenericError === false ? this.renderGenericError() : null}
            </div>
        );
    }
}

