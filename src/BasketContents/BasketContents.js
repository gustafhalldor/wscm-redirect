import React, { Component } from 'react';
import './basketContents.css';

class BasketContents extends Component {
  render() {
    return (
      <div className="rightSide col-md-6">
        <h1>Innihald körfu</h1>
        <ul>
          {this.props.basket.map((item, i) => {
            return <li key={i}>{item.description} - {item.weight} kg</li>
          })}
        </ul>
      </div>
    );
  }
}

export default BasketContents;
