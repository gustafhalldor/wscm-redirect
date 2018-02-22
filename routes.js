import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/getCountries/:redirectkey', (req, res, next) => {
  axios({
    method: 'get',
    url: `http://localhost:8989/wscm/countries/`,
    headers: {'x-redirectKey': req.params.redirectkey},
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
    url: `http://localhost:8989/wscm/deliveryservicesandprices?countryCode=${req.params.countryCode}&postCode=${req.params.postcode}&weight=${req.params.weight}`,
    headers: {'x-redirectKey': req.params.redirectkey},
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
    url: 'http://localhost:8989/wscm/postboxes',
    headers: {'x-redirectKey': req.params.redirectkey},
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

router.get('/createShipment', (req, res, next) => {

});

export default router;
