import React from 'react';

const ErrorBlock = (props) => {
    return (
        <span className="error-block">{props.errorText}</span>
    );
};

export default ErrorBlock;
