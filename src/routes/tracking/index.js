// @flow
import express from "express";


const router = express.Router();

router.use('/update-driver-location', require('./updateDriverLocation'));
router.use('/set-user-fcm-token', require('./setFCMToken'));


module.exports = router;
