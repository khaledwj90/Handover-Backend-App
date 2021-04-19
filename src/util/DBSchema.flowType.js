// @flow

/*
These are the mongodb schema
 */

type LocationType = {
    lat: number,
    lng: number,
    timestamp: string,
}
export type OrdersCollectionType = {
    _id: Object,
    customerId: Object,
    driverId: Object,
    pickupLocation: LocationType,
    deliveryLocation: LocationType,
    status: string,
    tracking: LocationType[],
    deliveryStatus: string,
    pickupTimestamp: string,
    deliveryTimestamp: string,
};

export type UsersCollectionType = {
    _id: Object,
    email: string,
    password: string,
    type: 'driver' | 'customer',
    fcmToken: string,
}
