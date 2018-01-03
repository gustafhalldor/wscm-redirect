import React, { Component } from 'react';
import Header from './Header/Header.js';
import CustInfo from './CustInfo/CustInfo.js';
import BasketContents from './BasketContents/BasketContents.js';
import './App.css';
import mockContents from './BasketContents/mockContents.json';
//import fetch from 'node-fetch';

class App extends Component {
  state = {
    custInfo: {},
    basketContents: []
  };

  componentDidMount = () => {
    // let myHeaders = new fetch.Headers();
    // myHeaders.set("x-api-key", "4F/UEh52hA86NWTQyM6+ogYGEsOClgD19jfrwl4Ol2E=");
    //
    // let url = `http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}`;
    // let myInit = {
    //   'method': 'GET',
    //   'headers': myHeaders
    // }
    //
    // let request = new fetch.Request(url, myInit)

    // const url = encodeURIComponent(this.props.match.params.redirectkey)
    console.log(this.props.match.params.redirectkey);
    const appObject = this;
    fetch(`http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}`)
      .then(response => {
        return response.json();
      }).then(function(response) {
        console.log("response er:");
        console.log(response);
        appObject.setState({
          custInfo: response.recipient,
          basketContents: response.products
        })
      });
  }

  render(match) {
    return (
      <div className="Container">
        <Header />
        <main className="flex-container">
         {/* Líklega þarf ég eitt foreldri hér sem svo renderar CustInfo og BasketContents, því það tvennt hangir saman og notast við upplýsingar úr sama fetchi. */}
          <CustInfo customer={this.state.custInfo}/>
          <BasketContents basket={this.state.basketContents}/>
        </main>
      </div>
    );
  }
}

export default App;
