// @flow

import express from "express";
import Util from "../../util";
import jwt from "jsonwebtoken";
import assert from "assert";

const router: * = express.Router();


router.post('/', async (request, response) => {
    try {
        const {orderId, status} = request.body;
        const dbConnection = request.locals.dbConnection;
        const ordersCollection = dbConnection.collection('Orders');
        const user = request.user;

        const updatedStatusResult = await ordersCollection.updateOne({_id: Util.Functions.getMongoDBID(orderId)}, {$set: {status: status}});

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
