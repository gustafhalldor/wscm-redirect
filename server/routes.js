import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const router = express.Router();

router.use(bodyParser.json());
router.use(express.json());

const LOCAL_REDIRECT = `http://localhost:8989/wscm/v1/landing`;
const LOCAL_SERVICE = `http://localhost:8989/wscm/v1`;
// cannot use test for some of the calls because this redirect thing isn't set up there yet.
const TEST_REDIRECT = `https://apitest.mappan.is/wscm`;
const REDIRECT_ENV = LOCAL_REDIRECT;

router.get('/getTransactionDetails/:redirectkey', (req, res, next) => {
  axios({
    method: 'get',
    url: `${REDIRECT_ENV}/${req.params.redirectkey}`,
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      const obj = {
        status: error.response.status,
        message: error.response.data.message,
      }
      res.send(obj);
    })
});

router.put('/updateRecipient/:redirectkey', (req, res, next) => {
  axios({
    method: 'put',
    url: `${REDIRECT_ENV}/${req.params.redirectkey}/updateRecipient`,
    data: req.body,
  })
    .then(response => {
      res.sendStatus(response.status);
    })
    .catch(error => {
      const obj = {
        status: error.response.status,
        message: error.response.data.message,
      }
      res.send(obj);
    })
});

router.get('/getCountries/:redirectkey', (req, res, next) => {
  axios({
    method: 'get',
    url: `${LOCAL_SERVICE}/countries/`,
    headers: {'x-redirect-key': req.params.redirectkey},
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      // If no API key is found behind the redirect key, a "400" status is returned.
      const obj = {
        status: error.response.status,
        message: error.response.data.message,
      }
      res.send(obj);
    })
});

router.get('/getDeliveryPrices/:redirectkey/:countryCode/:postcode/:weight', (req, res, next) => {
  axios({
    method: 'get',
    url: `${LOCAL_SERVICE}/deliveryservicesandprices?countryCode=${req.params.countryCode}&postCode=${req.params.postcode}&weight=${req.params.weight}`,
    headers: {'x-redirect-key': req.params.redirectkey},
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      // If no API key is found behind the redirect key, a "400" status is returned.
      const obj = {
        status: error.response.status,
        message: error.response.data.message,
      }
      res.send(obj);
    })
});

router.get('/getPostboxes/:redirectkey', (req, res, next) => {
  axios({
    method: 'get',
    url: `${LOCAL_SERVICE}/postboxes`,
    headers: {'x-redirect-key': req.params.redirectkey},
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      // If no API key is found behind the redirect key, a "400" status is returned.
      const obj = {
        status: error.response.status,
        message: error.response.data.message,
      }
      res.send(obj);
    })
});

router.put('/updateEmail/:redirectkey', (req, res, next) => {
  axios({
    method: 'put',
    url: `${REDIRECT_ENV}/${req.params.redirectkey}/updateCustomerEmail`,
    data: req.body,
  })
    .then(response => {
      res.sendStatus(response.status);
    })
    .catch(error => {
      const obj = {
        status: error.response.status,
        message: error.response.data.message,
      }
      res.send(obj);
    })
});

router.post('/createShipmentAndProcessPayment/:redirectkey', (req, res, next) => {
  // First we get the total price from DB.
  // If it differs from the one in application state we return an error message

  axios({
    method: 'get',
    url: `${REDIRECT_ENV}/${req.params.redirectkey}/totalPrice`,
  })
    .then(response => {
      console.log(response.data);
      console.log(req.body.amount);
      // Allow for inconsistency of +- 1 króna because of possible, but unlikely, int parsing discrepancy.
      if (req.body.amount < response.data-1 || req.body.amount > response.data+1) {
        const obj = {
          status: 400,
          message: 'Ekki er verðsamræmi milli vafra og netþjóns. Vinsamlegast reyndu aftur.',
        }
        return res.send(obj);
      }

      // Then we create the shipment
      axios({
        method: 'post',
        url: `${LOCAL_SERVICE}/shipments/create`,
        headers: {'x-redirect-key': req.params.redirectkey},
        data: req.body,
      })
        .then(shipmentResponse => {
          // shipmentResponse.data is the shipment that got created.
          // const obj = {
          //   status: shipmentResponse.status,
          //   body: shipmentResponse.data,
          // }
          // res.send(obj);

          /* --- PAYMENT PROCESSING STARTS --- */

          // step 1 of 2: First we get a token from Valitor
          axios({
            method: 'post',
            url: `http://localhost:8282/paymentgw/accounts/epostur/token`,
            data: req.body.card,
          })
            .then(tokenResponse => {
              console.log("inní tokenResponse");
              console.log(tokenResponse.data.token);
              // axios call succeeded and we have ourselves a token
              const tokenObject = {
                token: tokenResponse.data.token,
                amount: req.body.amount,
              };

              // step 2 of 2: Then we make the actual charge
              axios({
                method: 'post',
                url: `http://localhost:8282/paymentgw/accounts/epostur/charge`,
                data: tokenObject,
              })
                .then(chargeResponse => {
                  console.log("inní chargeResponse");
                  console.log(chargeResponse.data);
                  const obj = {
                    status: 201,
                    body: chargeResponse.data,
                  }
                  // TODO: Send email to customer with information on shipment
                  // TODO: Send email to customer with payment receipt
                  res.send(obj);
                })
                .catch(error => { //"charge creditcard" catch
                  const obj = {
                    status: error.response.status,
                    message: error.response.data.message,
                  }
                  res.send(obj);
                })
            })
            .catch(error => { // "get token" catch
              const obj = {
                status: error.response.status,
                message: error.response.data.message,
              }
              res.send(obj);
            })

          /* --- PAYMENT PROCESSING FINISHED --- */

        })
        .catch(error => { // "create shipment" catch
          // If no API key is found behind the redirect key, a "401" status is returned.
          const obj = {
            status: error.response.status,
            message: error.response.data.message,
          }
          res.send(obj);
        })
    })
    .catch(error => { // "get total price" catch
      console.log(error);
      const obj = {
        status: error.response.status,
        message: error.response.data.message,
      }
      res.send(obj);
    })
})

router.put('/updateCreatedStatus/:redirectkey', (req, res, next) => {
  axios({
    method: 'put',
    url: `${LOCAL_REDIRECT}/${req.params.redirectkey}`,
    headers: {'x-redirect-key': req.params.redirectkey, 'Content-Type': 'application/json'},
    data: req.body,
  })
    .then(response => {
      const obj = {
        status: response.status,
        body: response.data,
      }
      res.send(obj);
    })
    .catch(error => {
      const obj = {
        status: error.response.status,
        message: error.response.data.message,
      }
      res.send(obj);
    })
});

export default router;
