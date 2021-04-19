// @flow

import express from "express";
import Util from "../../util";
import jwt from "jsonwebtoken";
import assert from "assert";

const router: * = express.Router();


router.get('/', async (request, response) => {
    try {
        const dbConnection = request.locals.dbConnection;
        const ordersCollection = dbConnection.collection('Orders');
        const user = request.user;

        const ordersList = await ordersCollection.find({customerId: user._id}).project({tracking: 0}).sort({_id: -1}).toArray();

        response.status(Util.Constants.HTTP_STATUSES.HTTP_SUCCESS_CODE).send({
            status: Util.Constants.RESPONSE_STATUS.SUCCESS,
            data: ordersList
        });
    } catch (e) {
        //will use winston lib for logging in production
        console.log(e);
        response.status(Util.Constants.HTTP_STATUSES.HTTP_SERVER_ERROR_CODE).send({status: Util.Constants.RESPONSE_STATUS.FAILED});
    }
})

module.exports = router;
