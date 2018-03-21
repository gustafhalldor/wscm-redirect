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
      console.log('Tókst ekki að vista email viðskiptavinar.');
    })
}
