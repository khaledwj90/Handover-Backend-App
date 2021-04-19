// @flow

class Constants {
    constructor() {
    }

    URL_DEMO: string = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0-mlhjq.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true`;

    LOCAL_URL: string = `mongodb://localhost:27017/${process.env.DB_NAME}`;

    HTTP_STATUSES: * = {
        HTTP_UNAUTHORIZED_CODE: '401',
        HTTP_SUCCESS_CODE: '200',
        HTTP_BADREQUEST_CODE: '400',
        HTTP_SERVER_ERROR_CODE: '500',
        HTTP_NOT_FOUND: '404',
        HTTP_CONNECTION_FAILED: 'connection-failed',
    }

    PUBLIC_ROUTES: * = [
        'authentication'
    ]

    RESPONSE_STATUS: * = {
        SUCCESS: '000',
        FAILED: '111',
        EMAIL_TAKEN: '001',
    }

    ORDER_STATUS: * = {
        DELIVERED: 'DELIVERED',
        COMPLETED: 'COMPLETED',//Will update this state after payment
        IN_PROGRESS: 'IN-PROGRESS',
        CANCELED: 'CANCELED',
    }

    DELIVERY_STATUS: * = {
        ON_WAY: 'ON-WAY',
        PACKAGE_NEAR_PICKUP: 'PACKAGE-NEAR-PICKUP',
        PACKAGE_PICKED_UP: 'PACKAGE-PICKED-UP',
        NEAR_DELIVERY_DESTINATION: 'NEAR-DELIVERY-DESTINATION',
        DELIVERED: 'DELIVERED',
    };

    PUSH_NOTIFICATION_EVENT: * = {
        DRIVER_LOCATION_UPDATE: 'DRIVER-LOCATION-UPDATE',
        DRIVER_NEAR_PICKUP_LOCATION: 'DRIVER-NEAR-PICKUP-LOCATION',
        DRIVER_NEAR_DELIVERY_LOCATION: 'DRIVER-NEAR-DELIVERY-LOCATION',
        DRIVER_ARRIVED_TO_PICKUP_LOCATION: 'DRIVER-ARRIVED-TO-PICKUP-LOCATION',
        DRIVER_ARRIVED_TO_DELIVERY_LOCATION: 'DRIVER-ARRIVED-TO-DELIVERY-LOCATION',
        DRIVER_PICKEDUP_PACKAGE: 'DRIVER-PICKEDUP-PACKAGE',
        DRIVER_DELIVERED_PACKAGE: 'DRIVER-DELIVERED-PACKAGE',
    }
}

export default Constants


