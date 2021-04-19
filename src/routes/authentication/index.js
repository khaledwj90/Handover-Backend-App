// @flow
import express from "express";


const router = express.Router();

router.use('/login', require('./login'));
router.use('/registration', require('./registeration'));


module.exports = router;
