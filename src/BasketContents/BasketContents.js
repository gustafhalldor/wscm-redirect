import React, { Component } from 'react';
import './basketContents.css';

class BasketContents extends Component {
  render() {
    return (
      <div className="rightSide col-md-4">
        <h1>Innihald körfu</h1>
        <table className="table">
          <colgroup span="3"></colgroup>
          <thead>
            <tr>
              <th>Lýsing</th>
              <th>Þyngd</th>
              <th>Verð</th>
            </tr>
          </thead>
          <tbody>
            {this.props.basket.map((item, i) => {
              return  <tr key={i}>
                        <td>{item.description}</td>
                        <td>{item.weight} kg</td>
                        <td>{item.price} kr.</td>
                      </tr>
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Samtals:</td>
              <td>{this.props.totalWeight} kg</td>
              <td>{this.props.totalPrice} kr.</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default BasketContents;
