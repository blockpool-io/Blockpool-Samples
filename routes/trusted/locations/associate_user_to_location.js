'use strict';
const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../../../config/config');
const handleBiTHeaders = require('../../../headerhandler');

router.post('/', (req, res) => {
  let bitid = req.body.bitid;
  let locationid = req.body.locationid;
  let destinationwalletid = req.body.destinationwalletid;
  if (!bitid || !locationid) {
    return res.status(400).json({
      success : false,
      message : "missing required fields"
    });
  }
  delete req.body.locationid;

  handleBiTHeaders.hashKey(config.apiprivatekey)
  .then((apihashedkey) => {
    let params = {
      url : config.urlToBit + '/organisations/locations/' + locationid + '/associate',
      headers : {
        apipublickey : config.apipublickey,
        apihashedkey : apihashedkey
      },
      json : true,
      body : req.body
    };

    request.post(params, (error, response, body) => {
      if (error) {
        let statusCode = 500;
        if (response) {
          statusCode = response.statusCode;
        }
        return res.status(statusCode).json({
          success : false,
          message: error.message
        });
      } else {
        return res.status(response.statusCode).json(body);
      }
    });
  })
  .catch((err) => {
    return res.status(401).json({
      success : false,
      message: err.message
    });
  });
});

module.exports = router;