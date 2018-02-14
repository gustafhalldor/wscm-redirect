import React from 'react';
import './basketContents.css';

const BasketContents = (props) => {

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
            {props.basket.map((item, i) => {
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
              <td>{props.totalWeight} kg</td>
              <td>{props.totalPrice} kr.</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
}

export default BasketContents;
