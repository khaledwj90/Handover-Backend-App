// @flow
import express from "express";


const router = express.Router();

router.use('/create-order', require('./createOrder'));
router.use('/get-orders-list', require('./gerOrdersList'));
router.use('/get-order-details', require('./getOrderDetails'));
router.use('/change-order-status', require('./changeOrderStatus'));
router.use('/change-order-delivery-status', require('./changeOrderDeliveryStatus'));


module.exports = router;
