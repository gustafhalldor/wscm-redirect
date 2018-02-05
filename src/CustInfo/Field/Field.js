import React, { Component } from 'react';

class Field extends Component {

  onChange = (evt) => {
    const fieldName = this.props.name;
    const value = evt.target.value;
    // If the Field has a validate property, we put the value of the input through the Validator module
    const error = this.props.validate ? this.props.validate(value) : false;

    this.props.onChange({ fieldName, value, error });
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
        <span style={{ color: 'red' }}>{ this.props.errorState }</span>
      </div>
    );
  }
}

export default Field;
