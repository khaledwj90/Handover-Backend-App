import Util from "./util";

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

/**
 * initialize passport to support JWT authentication
 * function will return below response
 * will return **tokenPayload** as object inside user
 * error: error // we have to return 500 response
 * user: false | user
 * info:{message: expiredDate|userNotFount|blockedUser}
 * @param Passport
 * @constructor
 */
exports.PassportInitialize = (Passport, DBConnection) => {
    Passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwtPayload, cb) => {
        const connection = await Util.Functions.createDBConnection(DBConnection);
        const userCollection = connection.collection(`Users`);
        console.log('JWT Payload: ', jwtPayload);

        try {
            if (!jwtPayload.id) return cb(null, false);
            //checking token Date Time
            const currentDateTime = new Date();
            const tokenDateTime = new Date(jwtPayload.date);
            const days = Util.Functions.getDaysBetweenDates(currentDateTime, tokenDateTime);
            if (days > process.env.JWT_TOKEN_EXPIRE) return cb(null, false, {message: 'expiredDate'});

            const userID = Util.Functions.getMongoDBID(jwtPayload.id);
            const user = await userCollection.findOne({_id: userID});
            if (user === null) {
                return cb(null, false, {message: 'user not found'});
            } else {
                return cb(null, user);
            }
        } catch (e) {
            return cb(e);
        }
    }));
};




