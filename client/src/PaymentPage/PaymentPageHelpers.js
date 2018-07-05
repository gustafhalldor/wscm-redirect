export function getCurrentMonthAndYear() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  return { month, year };
}

export function saveCustomerEmailAddress(redirectkey, customerEmail) {
  const saveCustomerEmailUrl = `http://localhost:3001/api/updateEmail/${redirectkey}`;

  const myHeaders = new Headers();
  myHeaders.set('Content-Type', 'application/json');

  const email = { email: customerEmail };

  const myEmailInit = {
    method: 'PUT',
    body: JSON.stringify(email),
    headers: myHeaders,
  };

  const emailRequest = new Request(saveCustomerEmailUrl, myEmailInit);

  fetch(emailRequest)
    .then((response) => {
      // það þarf ekkert að vera hérna frekar en ég vill
    })
    .catch((error) => {
      console.log('Tókst ekki að vista email viðskiptavinar.', error);
    });
}

export function createShipmentAndProcessPayment(redirectkey, recipient, customerEmail, selectedCountry, selectedDeliveryOption, ccDetails, totalAmount) {
  const myHeaders = new Headers();
  myHeaders.set('Content-Type', 'application/json');

  const createShipmentUrl = `http://localhost:3001/api/createShipmentAndProcessPayment/${redirectkey}`;

  const shipment = {
    recipient: {
      name: recipient.fullName,
      addressLine1: recipient.address,
      postcode: recipient.postcode,
      countryCode: selectedCountry,
    },
    options: {
      deliveryServiceId: selectedDeliveryOption,
    },
    amount: totalAmount,
    card: {
      customerName: ccDetails.name,
      customerEmail,
      creditCard: {
        ccNumber: ccDetails.number,
        expiryMonth: ccDetails.expiryMonth,
        expiryYear: ccDetails.expiryYear,
        cvv: ccDetails.cvc,
      },
    },
  };

  const myShipmentInit = {
    method: 'POST',
    body: JSON.stringify(shipment),
    headers: myHeaders,
  };

  const shipmentRequest = new Request(createShipmentUrl, myShipmentInit);

  return fetch(shipmentRequest);
}

export function processPayment(redirectkey, ccDetails, totalAmount) {
  const myHeaders = new Headers();
  myHeaders.set('Content-Type', 'application/json');

  const processPaymentUrl = `http://localhost:3001/api/payment/${redirectkey}`;

  const details = {
    amount: totalAmount,
    card: {
      creditCard: {
        ccNumber: ccDetails.number,
        expiryMonth: ccDetails.expiryMonth,
        expiryYear: ccDetails.expiryYear,
        cvv: ccDetails.cvc,
      },
    },
  };

  const myPaymentInit = {
    method: 'POST',
    body: JSON.stringify(details),
    headers: myHeaders,
  };

  const processPaymentRequest = new Request(processPaymentUrl, myPaymentInit);

  return fetch(processPaymentRequest);
}
