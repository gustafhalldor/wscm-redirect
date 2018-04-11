import React from 'react';
import './BasketContents.css';

const BasketContents = (props) => {
  return (
    <div className="rightSide col-md-4">
      <h1>Innihald körfu</h1>
      <table className="table">
        <colgroup span="3" />
        <thead>
          <tr>
            <th>Lýsing</th>
            <th className="tableTextCenter">Fjöldi</th>
            <th>Þyngd</th>
            <th>Verð</th>
          </tr>
        </thead>
        <tbody>
          {props.basket.map((item, i) => {
            return (
              <tr key={i}>
                <td>{item.description}</td>
                <td className="tableTextCenter">{item.count}</td>
                <td>{item.weight * item.count} kg ({item.count}*{item.weight}kg)</td>
                <td>{item.price * item.count} kr.</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>Samtals:</td>
            <td>{props.totalWeight} kg</td>
            <td>{props.totalPrice} kr.</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default BasketContents;
