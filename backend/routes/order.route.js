import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.route('/').post(protectRoute, createOrder).get(protectRoute, adminRoute, getAllOrders);
router.route('/myorders').get(protectRoute, getMyOrders);
router.route('/:id').get(protectRoute, getOrderById);
router.route('/:id/pay').put(protectRoute, updateOrderToPaid);
router.route('/:id/deliver').put(protectRoute, adminRoute, updateOrderToDelivered);

export default router; 