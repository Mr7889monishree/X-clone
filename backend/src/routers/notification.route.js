import express from "express"
import { deleteNotification, getNotification } from "../controller/notifcation.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const notificationRoutes=express.Router();


notificationRoutes.get('/',protectRoute,getNotification);
notificationRoutes.delete('/:notificationId',protectRoute,deleteNotification);

export default notificationRoutes;
