import express from "express";
import jwt from "jsonwebtoken";
import assert from "assert";
import Util from "../../util";

const router = express.Router();


router.post('/', async (request, response) => {
    try {
        const {email, password, type} = request.body;
        const dbConnection = request.locals.dbConnection;
        const usersCollection = dbConnection.collection('Users');


        let userDetails = await usersCollection.findOne({email: email.toLowerCase(), type: type});
        console.log('---- ', userDetails);
        //user is already taken
        if (userDetails !== null) {
            return response.status(Util.Constants.HTTP_STATUSES.HTTP_UNAUTHORIZED_CODE).send({status: Util.Constants.RESPONSE_STATUS.EMAIL_TAKEN});
        }

        //encrypt password
        const hashedPassword = await Util.Functions.setPassword(password);
        userDetails = {
            email: email.toLowerCase(),
            password: hashedPassword,
            type: type
        };

        const insertResult = await usersCollection.insertOne(userDetails)
        assert.equal(1, insertResult.insertedCount);

        const tokenPayload = {
            id: insertResult._id,
            userType: type,
            date: new Date()
        };
        //JWT token
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
        response.status(Util.Constants.HTTP_STATUSES.HTTP_SUCCESS_CODE).send({
            status: Util.Constants.RESPONSE_STATUS.SUCCESS,
            data: {token: token}
        });
    } catch (e) {
        //will use winston lib for logging in production
        console.log(e);
        response.status(Util.Constants.HTTP_STATUSES.HTTP_SERVER_ERROR_CODE).send({status: Util.Constants.RESPONSE_STATUS.FAILED});
    }


})

module.exports = router;
