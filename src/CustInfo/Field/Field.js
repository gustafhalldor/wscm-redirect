import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Field extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    // validate: PropTypes.func,
    onChange: PropTypes.func.isRequired
  };

  state = {
    error: false
  };

  componentWillReceiveProps(update) {
    this.setState({ value: update.value });
  }

  onChange = (evt) => {
    const name = this.props.name;
    const value = evt.target.value;
    // If the Field has a validate property, we put the value of the input through the validate function in CustInfo
    const error = this.props.validate ? this.props.validate(value) : false;

    this.setState({ value, error });

    this.props.onChange({ name, value, error });
  };

  render() {
    return (
      <div>
        <label htmlFor={this.props.name}>{this.props.label}{this.props.required && <span>*</span>}</label>
        <br/>
        <input
          id={this.props.name}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.onChange}
        />
        <br />
        <span style={{ color: 'red' }}>{ this.state.error }</span>
      </div>
    );
  }
}

export default Field;
