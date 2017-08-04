import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { increment } from '../../../AC/counter';

class PlusOne extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.increment();
    }

    render() {
        return (
            <p>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.handleClick}
                >
                    + {this.props.counter}
                </button>
            </p>
        );
    }
}

PlusOne.defaultProps = {
    counter: 1
};

PlusOne.propTypes = {
    counter: PropTypes.number
};

export default connect(
    state => ({
        counter: state.counter
    }),
    { increment }
)(PlusOne);
