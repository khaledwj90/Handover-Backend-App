// @flow
import _ from 'lodash';
import bcrypt from 'bcrypt';
import Constants from "./constants";
import Mongo from "mongodb";

class Functions extends Constants {
    mongoClient: any;

    constructor() {
        super();
        this.mongoClient = Mongo.MongoClient;
    }

    createDBConnection(oldDbConnection: any): Promise<any> {
        const connectionURL = process.env.NODE_ENV === 'development' ? this.LOCAL_URL : this.URL_DEMO;
        return new Promise((resolve, reject) => {
            if (oldDbConnection) {
                resolve(oldDbConnection);
                console.log('Old Connection');
                return;
            }
            this.mongoClient.connect(connectionURL, {useNewUrlParser: true}, (err, client) => {
                console.log('======= New Connection ============');
                if (err) {
                    reject(err);
                    return;
                }
                resolve(client.db(process.env.DB_NAME));
            });
        });
    }

    isPublicRoutes(request: any): boolean {
        const currentURL: string = request.originalUrl;
        const isPublic = _.findIndex(this.PUBLIC_ROUTES, x => {
            return (currentURL.includes(x))
        })
        return isPublic > -1
    }

    setPassword(password: string): Promise<string | false> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS), (err, hash) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(hash);
                }
            })
        })
    };

    comparePassword(pass1: string, pass2: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(pass1, pass2, (error, result) => {
                if (error) reject(false);
                else if (result) resolve(true);
                else resolve(false);
            })
        })
    }

    getDaysBetweenDates(currentDate: number, oldDate: number): number {
        const res = Math.abs(oldDate - currentDate) / 1000;
        return Math.floor(res / 86400);
    };

    getMongoDBID(id: string): Object {
        try {
            return Mongo.ObjectID(id);
        } catch (e) {
            return id;
        }
    };

    getDistanceFromLatLngInKm(data: { lat1: number, lng1: number, lat2: number, lng2: number }): number {
        const deg2rad = (deg) => {
            return deg * (Math.PI / 180)
        };
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(data.lat2 - data.lat1);  // deg2rad below
        const dLon = deg2rad(data.lng2 - data.lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(data.lat1)) * Math.cos(deg2rad(data.lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }
}

export default Functions
