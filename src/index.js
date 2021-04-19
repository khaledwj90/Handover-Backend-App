//@flow

import {swaggerOptions} from "./swagger/swaggerConfig";
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import express from "express";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import Passport from 'passport';
import {PassportInitialize} from './passport.config';
import Util from './util';

const app = express();
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


Util.Functions.createDBConnection(null)
    .then((DBConnection) => {
        app.use(cors());
        app.use(express.json());
        PassportInitialize(Passport, DBConnection);

        //add DB Connection to all api requests
        app.use((req, res, next) => {
            req.locals = {
                dbConnection: DBConnection
            }
            next();
        });

        //todo will use winston lib for logging in production
        app.use((req, res, next) => {
            console.log(`-------------- REQ(${req.originalUrl}) ----------\n`);
            console.info('->Request Host\n', req.headers.host);
            console.log('-> Request Body\n', req.body);
            console.log('-> Request Query\n', req.query);
            console.log('-> Request Header\n', req.headers);
            console.log('=================== END ====================\n');
            next();
        });

        app.use(async (request, response, next) => {
            //authentication
            try {
                const isPublicRoute: boolean = Util.Functions.isPublicRoutes(request);
                //check if the route is public route(don't require a jwt token)
                if (isPublicRoute === true) return next();

                Passport.authenticate('jwt', {session: false}, (error, user, info) => {
                    console.log(user)
                    if (error) {
                        return response.status(Util.Constants.HTTP_STATUSES.HTTP_SERVER_ERROR_CODE).end();
                    }
                    if (!user) {
                        return response.status(Util.Constants.HTTP_STATUSES.HTTP_UNAUTHORIZED_CODE).end();
                    } else {
                        /*add user info to the request*/
                        request.user = user;
                        return next()
                    }
                })(request, response, next)
            } catch (e) {
                console.error(e);
                response.status(Util.Constants.HTTP_STATUSES.HTTP_SERVER_ERROR_CODE).end();
            }
        });
        app.use('/', require('./routes/index'))

    });

const port = process.env.PORT || 4001;
app.listen(port, (error) => {
    if (error) {
        throw error
    }
    console.log(`Server is running on port ${port}`);
    process.on('SIGINT', () => {
        console.log("Bye bye!");
        process.exit();
    });
});

