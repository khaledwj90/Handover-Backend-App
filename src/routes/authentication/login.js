// @flow

import express from "express";
import {checkSchema, validationResult} from 'express-validator';
import validationSchema from './login.schema';
import Util from "../../util";
import jwt from "jsonwebtoken";

const router: * = express.Router();


router.post('/', checkSchema(validationSchema), async (request, response) => {
    try {
        const errors = validationResult(request);
        console.log('err: ', errors);
        if (!errors.isEmpty()) {
            return response.status(Util.Constants.HTTP_STATUSES.HTTP_BADREQUEST_CODE).send({status: Util.Constants.RESPONSE_STATUS.FAILED});
        }
        const {email, password, type} = request.body;
        const dbConnection = request.locals.dbConnection;
        const usersCollection = dbConnection.collection('Users');

        let userDetails = await usersCollection.findOne({email: email.toLowerCase(), type: type})

        if (userDetails === null) {
            return response.status(Util.Constants.HTTP_STATUSES.HTTP_NOT_FOUND).send({
                status: Util.Constants.RESPONSE_STATUS.FAILED
            })
        }

        const isAuthorized = await Util.Functions.comparePassword(password, userDetails.password);

        if (isAuthorized === false) {
            return response.status(Util.Constants.HTTP_STATUSES.HTTP_UNAUTHORIZED_CODE).send({
                status: Util.Constants.RESPONSE_STATUS.FAILED
            })
        }

        const tokenPayload = {
            id: userDetails._id,
            userType: userDetails.type,
            date: new Date()
        };

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
