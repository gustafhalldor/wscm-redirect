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

router.get('/getDeliveryPrices', (req, res, next) => {

});

router.get('/createShipment', (req, res, next) => {

});

export default router;
