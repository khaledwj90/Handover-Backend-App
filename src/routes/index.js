// @flow
import express from "express";

const router = express.Router();

router.use('/authentication', require('./authentication'));
router.use('/tracking', require('./tracking'));
router.use('/orders', require('./orders'));


module.exports = router;
