import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export function render(Component, container, props, store) {
    try {
        if (container) {
            if (store) {
                ReactDOM.render(
                    <Provider store={store}>
                        <Component {...props} />
                    </Provider>,
                    container
                );
            } else {
                ReactDOM.render(
                    <Component {...props} />,
                    container
                );
            }
        }
    } catch (e) {
            /* eslint-disable */
            console.error(e);
            /* eslint-enable */
    }
}

export function renderFactory(Component, containers, ...args) {
    [...containers].forEach((container) => {
        render(Component, container, ...args);
    });
}
