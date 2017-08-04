/*
 * Created by LTL
 */
import React from 'react';
import axios from 'axios';
import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
// import badRequest from '../fetching-data/errorHandle/badRequest';
// import internalError from '../fetching-data/errorHandle/internalError';
import errorHandler from '../fetching-data/errorHandle/errorHandler';

export default class RemoteComponent extends React.Component {
    static renderEmptyDataText(Text) {
        return <h3 className="subheadline" data-tpl="hea03">{Text}</h3>;
    }

    constructor(props) {
        super(props);

        this.state = {
            genericErrorMsg: '404 no connection',
            hideGenericError: undefined,
            emptyData: undefined,
            data: {}
        };

        this.getData = this.getData.bind(this);
        this.renderGenericError = this.renderGenericError.bind(this);
    }

    getData(address) {
        createLoadingCircle();
        showLoadingCircle();

        defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';
        axios(address, {
            method: 'GET',
            headers: defaultHeaders
        }).then(response => {
            const temp = response.data;
            let currentTemp;

            Object.keys(temp).map((key) => {
                currentTemp = temp[key];

                if (typeof currentTemp !== 'undefined' && currentTemp !== null && currentTemp.length !== null && currentTemp.length > 0) {
                    this.setState({
                        data: response.data,
                        emptyData: false
                    });
                } else {
                    this.setState({
                        emptyData: true
                    });
                }
                return null;
            });

            this.setState({ hideGenericError: true });

            setTimeout(() => {
                removeLoadingCircle();
            }, 1000);

        }).catch(error => {

            this.setState({
                genericErrorMsg: errorHandler({ errorResponse: error }),
                hideGenericError: false
            });

            setTimeout(() => {
                removeLoadingCircle();
            }, 1000);

        });
    }

    renderGenericError() {
        return (
            <div className="validation-summary-errors FancyErrorMessage">
                <p>{this.state.genericErrorMsg}</p>
            </div>
        );
    }

    render() {
        return <div>Basic Remote Component</div>;
    }
}
