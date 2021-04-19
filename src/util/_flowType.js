// @flow

import type {FirebaseInterface} from "./firebase.type";

export interface UtilInterface {
    Constants: ConstantsInterface;
    Functions: FunctionsInterface;
    Firebase: FirebaseInterface
}

interface ConstantsInterface {

    URL_DEMO: string;

    LOCAL_URL: string;

    HTTP_STATUSES: {
        HTTP_UNAUTHORIZED_CODE: string,
        HTTP_SUCCESS_CODE: string,
        HTTP_BADREQUEST_CODE: string,
        HTTP_SERVER_ERROR_CODE: string,
        HTTP_NOT_FOUND: string,
    };
    RESPONSE_STATUS: {
        SUCCESS: string,
        FAILED: string,
        EMAIL_TAKEN: string,
    };

    ORDER_STATUS: {
        DELIVERED: string,
        COMPLETED: string,
        IN_PROGRESS: string,
        CANCELED: string,
    };

    DELIVERY_STATUS: {
        ON_WAY: string,
        PACKAGE_NEAR_PICKUP: string,
        PACKAGE_PICKED_UP: string,
        NEAR_DELIVERY_DESTINATION: string,
        DELIVERED: string,
    };

    PUSH_NOTIFICATION_EVENT: {
        DRIVER_LOCATION_UPDATE: string,
        DRIVER_NEAR_PICKUP_LOCATION: string,
        DRIVER_NEAR_DELIVERY_LOCATION: string,
        DRIVER_ARRIVED_TO_PICKUP_LOCATION: string,
        DRIVER_ARRIVED_TO_DELIVERY_LOCATION: string,
        DRIVER_PICKEDUP_PACKAGE: string,
        DRIVER_DELIVERED_PACKAGE: string,
    }
}


interface FunctionsInterface {

    createDBConnection(oldDbConnection: any): Promise<any>;

    isPublicRoutes(request: any): boolean;

    setPassword(password: string): Promise<string | false>;

    comparePassword(pass1: string, pass2: string): Promise<boolean>;

    getDaysBetweenDates(currentDate: number, oldDate: number): number;

    getMongoDBID(id: string): Object;

    getDistanceFromLatLngInKm(data: { lat1: number, lng1: number, lat2: number, lng2: number }): number;
}
