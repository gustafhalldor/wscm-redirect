import React from 'react';
import { connect } from 'react-redux';
import './finalPage.css';

const PaymentPage = (props) => {
  return (
    <div className="finalPageContainer">
      <div className="flex-container-row justify-center">
        {props.shipmentPaid === true ?
          <div>
            <h2>Vei! Greiðsla fór í gegn og sending hefur verið búin til!</h2>
            <p>
              <span>Heimildarnúmer: {props.paymentResponse.transactionNumber}</span>
              <br />
              <span>Dagsetning: {props.paymentResponse.payDate}</span>
              <br />
              <span>Tími: {props.paymentResponse.payTime}</span>
              <br />
              <span>Kortanúmer: {props.paymentResponse.starredCcNumber}</span>
              <br />
              <span>Upphæð: {props.paymentResponse.amount} kr.</span>
            </p>
          </div> :
          <h2>Eitthvað meijor fokkaðist upp</h2>
        }
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    shipmentPaid: state.transactionDetails.shipmentPaid,
    paymentResponse: state.transactionDetails.chargeResponse,
  };
}

export default connect(mapStateToProps)(PaymentPage);
