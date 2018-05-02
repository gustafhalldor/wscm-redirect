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

export function processPayment(redirectkey, ccDetails, ) {

}
