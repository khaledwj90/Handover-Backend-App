// @flow

import firebaseAdmin from 'firebase-admin';
import Util from "./index";

const serviceAccount = require('../../firebase-admin-config.json')

class Firebase {
    messaging: *;

    constructor() {
        if (!firebaseAdmin.apps.length) {
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount),
            })
            this.messaging = firebaseAdmin.messaging();
        }
    }

    getNotificationMessage(event: string): { title: string, body: string } | undefined {
        switch (event) {
            case Util.Constants.PUSH_NOTIFICATION_EVENT.DRIVER_NEAR_PICKUP_LOCATION:
                return ({
                    title: 'Driver Near You',
                    body: 'Please be ready to pass the package to the driver'
                })
            case Util.Constants.PUSH_NOTIFICATION_EVENT.DRIVER_NEAR_DELIVERY_LOCATION:
                return ({
                    title: 'Driver Near Delivery Address',
                    body: 'Driver almost reached to the delivery location'
                });
            case Util.Constants.PUSH_NOTIFICATION_EVENT.DRIVER_PICKEDUP_PACKAGE:
                return ({
                    title: 'We Received Your Package',
                    body: 'We are on the way to deliver it'
                });
            case Util.Constants.PUSH_NOTIFICATION_EVENT.DRIVER_DELIVERED_PACKAGE:
                return ({
                    title: 'Your Package Delivered',
                    body: ':) :) ;)'
                });
            default:
                return undefined
        }
    }

    sendFCMMessage(tokens: string[], payload: { event: string, location: string }): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const message = {
                notification: this.getNotificationMessage(payload.event),
                contentAvailable: true,
                priority: 'high',
                tokens: tokens,
                data: payload
            };
            console.log('MESS: ', message)
            try {
                const response = await this.messaging.sendMulticast(message);
                resolve(response);
            } catch (e) {
                reject(e);
            }
        })
    }
}

export default Firebase
