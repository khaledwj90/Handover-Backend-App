// @flow

import express from "express";
import Util from "../../util";
import jwt from "jsonwebtoken";
import type {OrdersCollectionType} from "../../util/DBSchema.flowType";
import assert from "assert";

const router: * = express.Router();


router.post('/', async (request, response) => {
    try {
        const {lat, lng, orderId} = request.body;
        const dbConnection = request.locals.dbConnection;
        const ordersCollection = dbConnection.collection('Orders');
        const usersCollection = dbConnection.collection('Users');

        const updateOrderResult: { value: OrdersCollectionType } = await ordersCollection.findOneAndUpdate({_id: Util.Functions.getMongoDBID(orderId)}, {
            $push: {
                tracking: {
                    lat,
                    lng,
                    timestamp: new Date()
                }
            }
        });

        const customerId = updateOrderResult.value.customerId;

        const userDetails = await usersCollection.findOne({_id: Util.Functions.getMongoDBID(customerId)});

        await Util.Firebase.sendFCMMessage([userDetails.fcmToken], {
            event: Util.Constants.PUSH_NOTIFICATION_EVENT.DRIVER_LOCATION_UPDATE,
            location: JSON.stringify({orderId: orderId, lat: lat, lng: lng})
        })

        //check other rules to send push notification
        const driverDistanceFromDeliveryLocation = Util.Functions.getDistanceFromLatLngInKm({
            lat1: updateOrderResult.value.deliveryLocation.lat,
            lng1: updateOrderResult.value.deliveryLocation.lng,
            lat2: lat,
            lng2: lng
        });
        const driverDistanceFromPickupLocation = Util.Functions.getDistanceFromLatLngInKm({
            lat1: updateOrderResult.value.pickupLocation.lat,
            lng1: updateOrderResult.value.pickupLocation.lng,
            lat2: lat,
            lng2: lng
        });
        console.log('--->KM', driverDistanceFromPickupLocation, driverDistanceFromDeliveryLocation);


        //check if driver near the delivery location
        if (driverDistanceFromDeliveryLocation <= parseFloat(process.env.DRIVER_NEAR_DELIVERY_KM) && [Util.Constants.DELIVERY_STATUS.PACKAGE_PICKED_UP].indexOf(updateOrderResult.value.deliveryStatus) > -1) {
            await ordersCollection.updateOne({_id: Util.Functions.getMongoDBID(orderId)}, {$set: {deliveryStatus: Util.Constants.DELIVERY_STATUS.NEAR_DELIVERY_DESTINATION}});
            await Util.Firebase.sendFCMMessage([userDetails.fcmToken], {
                event: Util.Constants.PUSH_NOTIFICATION_EVENT.DRIVER_NEAR_DELIVERY_LOCATION,
                location: JSON.stringify({orderId: orderId, lat: lat, lng: lng})
            })
        }

        //check if the driver near pickup location
        if (driverDistanceFromPickupLocation <= parseFloat(process.env.DRIVER_NEAR_PICKUP_KM) && [Util.Constants.DELIVERY_STATUS.ON_WAY].indexOf(updateOrderResult.value.deliveryStatus) > -1) {
            await Util.Firebase.sendFCMMessage([userDetails.fcmToken], {
                event: Util.Constants.PUSH_NOTIFICATION_EVENT.DRIVER_NEAR_PICKUP_LOCATION,
                location: JSON.stringify({orderId: orderId, lat: lat, lng: lng})
            })
        }

        response.status(Util.Constants.HTTP_STATUSES.HTTP_SUCCESS_CODE).send({status: Util.Constants.RESPONSE_STATUS.SUCCESS});
    } catch (e) {
        //will use winston lib for logging in production
        console.log(e);
        response.status(Util.Constants.HTTP_STATUSES.HTTP_SERVER_ERROR_CODE).send({status: Util.Constants.RESPONSE_STATUS.FAILED});
    }
})

module.exports = router;
