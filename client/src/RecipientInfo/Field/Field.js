import React from 'react';

const Field = (props) => {
  const onChange = (evt) => {
    const fieldName = props.name;
    const value = evt.target.value;
    // If the Field has a validate property, we put the value of the input through the Validator module
    const error = props.validate ? props.validate(value) : false;

    props.onChange({ fieldName, value, error });
  };

  return (
    <div>
      <label htmlFor={props.name}>{props.label}{props.required && <span className="redAsterix"> *</span>}</label>
      <br />
      <input
        id={props.name}
        placeholder={props.placeholder}
        value={props.value}
        onChange={onChange}
      />
      <br />
      <span style={{ color: 'red' }}>{ props.errorState }</span>
    </div>
  );
};

export default Field;
