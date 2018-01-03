import React, { Component } from 'react';
import './custInfo.css';

class CustInfo extends Component {
  onFormSubmit = (evt) => {
    evt.preventDefault();
    console.log("kallað í onFormSubmit");
  };

  render() {
    return (
      <div className="leftSide col-md-6">
        <h1>Upplýsingar um viðtakanda</h1>
        <form onSubmit={this.onFormSubmit}>
          <div>
            <input
            placeholder="Nafn"/>
          </div>
          <br />
          <div>
            <input
            placeholder="Heimilisfang"/>
          </div>
          <br />
          <div>
            <input
            placeholder="Póstnúmer"/>
          </div>
          <br />
          <div>
            <input
            placeholder="Land"/>
          </div>
          <br />
          <div>
            <input
            placeholder="Email"/>
          </div>
          <br />
          <div>
            <input
            placeholder="Símanúmer"/>
          </div>
          <br />
          <input type='submit' value="Áfram á næsta skref"/>
        </form>
      </div>
    );
  }
}

export default CustInfo;
