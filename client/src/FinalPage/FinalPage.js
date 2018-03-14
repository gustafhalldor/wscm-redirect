import React from 'react';
import { connect } from 'react-redux';
import './FinalPage.css';

const PaymentPage = (props) => {
  return (
    <div className="finalPageContainer">
      <div className="flex-container-row justify-center">
        {props.shipmentCreatedAndPaidForSuccessfully === true ?
          <h2>Vei! Greiðsla fór í gegn og sending hefur verið búin til!</h2> :
          <h2>Eitthvað meijor fokkaðist upp</h2>
        }
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    shipmentCreatedAndPaidForSuccessfully: state.transactionDetails.shipmentCreatedAndPaidForSuccessfully,
  };
}

export default connect(mapStateToProps)(PaymentPage);
