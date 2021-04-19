// @flow

import express from "express";
import {checkSchema, validationResult} from 'express-validator';
import Util from "../../util";
import type {OrdersCollectionType} from "../../util/DBSchema.flowType";
import ValidationSchema from './getOrderDetails.schema';

const router: * = express.Router();


router.get('/', checkSchema(ValidationSchema), async (request, response) => {
    try {
        const errors = validationResult(request);
        console.log('ERR: ', errors);
        if (!errors.isEmpty()) {
            return response.status(Util.Constants.HTTP_STATUSES.HTTP_BADREQUEST_CODE).send({status: Util.Constants.RESPONSE_STATUS.FAILED});

        }

        const {orderId} = request.query;
        const dbConnection = request.locals.dbConnection;
        const ordersCollection = dbConnection.collection('Orders');
        const user = request.user;

        //todo we have to check if the user is belong to the order id for more secure
        const orderDetails: OrdersCollectionType = await ordersCollection.findOne({_id: Util.Functions.getMongoDBID(orderId)})

        if (orderDetails === null) {
            response.status(Util.Constants.HTTP_STATUSES.HTTP_NOT_FOUND).send({status: Util.Constants.RESPONSE_STATUS.SUCCESS});
        }
        response.status(Util.Constants.HTTP_STATUSES.HTTP_SUCCESS_CODE).send({
            status: Util.Constants.RESPONSE_STATUS.SUCCESS,
            data: {
                ...orderDetails,
                lastPosition: orderDetails.tracking
                    ? orderDetails.tracking[orderDetails.tracking.length - 1] : {lat: 0, lng: 0}
            }
        });
    } catch (e) {
        //todo use winston lib for logging in production
        console.log(e);
        response.status(Util.Constants.HTTP_STATUSES.HTTP_SERVER_ERROR_CODE).send({status: Util.Constants.RESPONSE_STATUS.FAILED});
    }
})

module.exports = router;
