'use strict';
const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../config/config');
const addBitHeaders = require('../addBiTHeaders');

router.post('/', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({
            success : false,
            message : "missing required fields"
        });
    }

    addBitHeaders.hashKey(config.apiprivatekey)
    .then((apihashedkey) => {
        let params = {
            url : config.urlToBit + '/organisations/users',
            headers : {
                apipublickey : config.apipublickey,
                apihashedkey : apihashedkey
            },
            json : true,
            body : req.body
        };
    
        request.post(params, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({
                    success : false,
                    message: error,message
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