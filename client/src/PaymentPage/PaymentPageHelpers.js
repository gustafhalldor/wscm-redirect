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

export function createShipment(redirectkey, customer, selectedCountry, selectedDeliveryOption) {
  const myHeaders = new Headers();
  myHeaders.set('Content-Type', 'application/json');

  const createShipmentUrl = `http://localhost:3001/api/createShipment/${redirectkey}`;

  const shipment = {
    recipient: {
      name: customer.fullName,
      addressLine1: customer.address,
      postcode: customer.postcode,
      countryCode: selectedCountry,
    },
    options: {
      deliveryServiceId: selectedDeliveryOption,
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

export function updateCreatedStatusinDb(redirectkey, status) {
  const updateCreatedStatus = `http://localhost:3001/api/updateCreatedStatus/${redirectkey}`;

  const myHeaders = new Headers();
  myHeaders.set('Content-Type', 'application/json');

  const data = {
    status,
  };

  const myInit = {
    method: 'put',
    body: JSON.stringify(data),
    headers: myHeaders,
  };

  const updateCreatedStatusRequest = new Request(updateCreatedStatus, myInit);

  fetch(updateCreatedStatusRequest)
    .then((response) => {
      console.log(response);
      // það þarf ekkert að vera hérna frekar en ég vill
      return response.json();
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log('Tókst ekki að breyta created stöðu sendingar í db.', error);
    });
}
