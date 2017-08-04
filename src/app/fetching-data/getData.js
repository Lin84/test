/* eslint-disable */
export default function() {
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
                    genericErrorMsg: internalError({errorResponse: error})
                });
                break;
            }

            case 400: {
                this.setState({
                    genericErrorMsg: badRequest({errorResponse: error})
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
/* eslint-enable */
