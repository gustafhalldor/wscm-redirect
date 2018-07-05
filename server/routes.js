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
      };
      res.send(obj);
    })
});

router.get('/getPostcodes/:redirectkey', (req, res, next) => {
    axios({
        method: 'get',
        url: `${LOCAL_SERVICE}/postcodes/`,
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
            };
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
      // Allow for inconsistency of +- 1 króna because of possible, but unlikely, int conversion discrepancy.
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
          // TODO maybe check if shipment was created successfully?

          /* --- PAYMENT PROCESSING STARTS --- */
          axios({
            method: 'post',
            url: `${LOCAL_REDIRECT}/${req.params.redirectkey}/payment`,
            data: req.body.card,
          })
            .then(paymentResponse => {
              console.log("inní paymentResponse");
              console.log(paymentResponse);
              console.log(paymentResponse.data);

              const paymentObject = {
                status: paymentResponse.status,
                body: paymentResponse.data,
              }
              res.send(paymentObject);
            })
            .catch(error => {
              const obj = {
                status: error.response.status,
                message: error.response.data.message,
              }
              res.send(obj);
            })
          /* --- PAYMENT PROCESSING ENDS --- */
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

export default router;
