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
    url: `${LOCAL_REDIRECT}/${req.params.redirectkey}`,
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
    url: `${LOCAL_REDIRECT}/${req.params.redirectkey}/updateRecipient`,
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
    url: `${LOCAL_REDIRECT}/${req.params.redirectkey}/updateCustomerEmail`,
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

router.post('/createShipment/:redirectkey', (req, res, next) => {
  axios({
    method: 'post',
    url: `${LOCAL_SERVICE}/shipments/create`,
    headers: {'x-redirect-key': req.params.redirectkey},
    data: req.body,
  })
    .then(response => {
      // response.data is the shipment that got created.
      const obj = {
        status: response.status,
        body: response.data,
      }
      res.send(obj);
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

// router.post('/payment/:redirectkey', (req, res, next) => {
//   console.log(req.body);
//   axios({
//     method: 'post',
//     url: ,
//     headers: {'x-redirect-key': req.params.redirectkey},
//     data: req.body,
//   })
//     .then(response => {
//       // response.data is the shipment that got created.
//       const obj = {
//         status: response.status,
//         body: response.data,
//       }
//       res.send(obj);
//     })
//     .catch(error => {
//       // If no API key is found behind the redirect key, a "400" status is returned.
//       const obj = {
//         status: error.response.status,
//         message: error.response.data.message,
//       }
//       res.send(obj);
//     })
// });

export default router;