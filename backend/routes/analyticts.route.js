import express from "express"
import { admineRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";

const routes = express.Router();

routes.get("/", protectRoute, admineRoute, async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();

        const endDate = new Date();
        const startDate = new Date(endDate.getDate() - 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await getDailySalesData(startDate, endDate);

        res.json({
            analyticsData,
            dailySalesData,
        });
    } catch (error) {
        console.log("Error in analytics route", error.message);
        res.status(500).json({message : "Server error", error: error.message});
    }
})

export default routes;