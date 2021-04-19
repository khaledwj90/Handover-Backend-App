// @flow

import express from "express";
import Util from "../../util";
import jwt from "jsonwebtoken";
import assert from "assert";
import type {OrdersCollectionType} from "../../util/DBSchema.flowType";

const router: * = express.Router();


router.post('/', async (request, response) => {
    try {
        const {orderId, newStatus} = request.body;
        const dbConnection = request.locals.dbConnection;
        const ordersCollection = dbConnection.collection('Orders');
        const usersCollection = dbConnection.collection('Users');
        const user = request.user;
        //todo make sure the user is related to the order and handle error

        let changeOrderDeliveryStatus: { value: OrdersCollectionType }
        switch (newStatus) {
            case Util.Constants.DELIVERY_STATUS.PACKAGE_PICKED_UP:
                changeOrderDeliveryStatus = await ordersCollection.findOneAndUpdate({_id: Util.Functions.getMongoDBID(orderId)}, {
                    $set: {
                        deliveryStatus: newStatus,
                        pickupTimestamp: new Date()
                    }
                });
                break;
            case Util.Constants.DELIVERY_STATUS.DELIVERED:
                changeOrderDeliveryStatus = await ordersCollection.findOneAndUpdate({_id: Util.Functions.getMongoDBID(orderId)}, {
                    $set: {
                        status: Util.Constants.ORDER_STATUS.DELIVERED,
                        deliveryStatus: newStatus,
                        deliveryTimestamp: new Date()
                    }
                });
                break;
            default:
                changeOrderDeliveryStatus = await ordersCollection.findOneAndUpdate({_id: Util.Functions.getMongoDBID(orderId)}, {$set: {deliveryStatus: newStatus}});
        }

        const userDetails = await usersCollection.findOne({_id: Util.Functions.getMongoDBID(changeOrderDeliveryStatus.value.customerId)});


        switch (newStatus) {
            case Util.Constants.DELIVERY_STATUS.PACKAGE_PICKED_UP:
                await Util.Firebase.sendFCMMessage([userDetails.fcmToken], {
                    event: Util.Constants.PUSH_NOTIFICATION_EVENT.DRIVER_PICKEDUP_PACKAGE,
                    location: JSON.stringify({orderId: orderId, lat: 0, lng: 0})
                });
                break;
            case Util.Constants.DELIVERY_STATUS.DELIVERED:
                await Util.Firebase.sendFCMMessage([userDetails.fcmToken], {
                    event: Util.Constants.PUSH_NOTIFICATION_EVENT.DRIVER_DELIVERED_PACKAGE,
                    location: JSON.stringify({orderId: orderId, lat: 0, lng: 0})
                });
                break;
        }

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
