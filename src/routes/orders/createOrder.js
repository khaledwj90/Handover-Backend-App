// @flow

import express from "express";
import Util from "../../util";
import jwt from "jsonwebtoken";
import assert from "assert";

const router: * = express.Router();


router.post('/', async (request, response) => {
    try {
        const {pickupLocation, deliveryLocation} = request.body;
        const dbConnection = request.locals.dbConnection;
        const ordersCollection = dbConnection.collection('Orders');
        const user = request.user;

        const createResult = await ordersCollection.insertOne({
            customerId: user._id,
            driverId: null,
            pickupLocation,
            deliveryLocation,
            status: Util.Constants.ORDER_STATUS.IN_PROGRESS,
            deliveryStatus: Util.Constants.DELIVERY_STATUS.ON_WAY,
            tracking: []
        })

        assert.equal(1, createResult.insertedCount);
        response.status(Util.Constants.HTTP_STATUSES.HTTP_SUCCESS_CODE).send({
            status: Util.Constants.RESPONSE_STATUS.SUCCESS,
            data: {}
        });
    } catch (e) {
        //will use winston lib for logging in production
        console.log(e);
        response.status(Util.Constants.HTTP_STATUSES.HTTP_SERVER_ERROR_CODE).send({status: Util.Constants.RESPONSE_STATUS.FAILED});
    }
})

module.exports = router;
