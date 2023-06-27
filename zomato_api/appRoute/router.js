const express = require ("express");
const router = express.Router();

const filter = require ("../appController/filterController");
const locationList = require("../appController/locationController");
const restaurantList = require("../appController/restaurantController");
const MealType = require ("../appController/MealTypeController");
const { genOrderDetails, verifyPayment, } = require("../appController/paymentController");


router.post("/api/filter", filter.filter);
router.get("/api/getLocationList", locationList.getLocationList);
router.get("/api/getRestaurantByLocationId/:loc_id", restaurantList.getRestaurantByLocationId);
router.get("/api/get-RestaurantDetails-By-Restaurant-Id/:id", restaurantList.getRestaurantDetailsByRestaurantId);
router.get("/api/get-MenuItems-By-Restaurant-Id/:r_id", restaurantList.getMenuItemsByRestaurantId);
router.get("/api/get-MealType-List" , MealType.getMealTypeList);
router.post("/api/gen-order-details", genOrderDetails);
router.post("/api/verify-payment", verifyPayment)
module.exports = router;