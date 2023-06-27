const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const menuItemSchema = new mongoose.Schema (
    {
        name: { type : String },
        description: { type : String },
        ingridients: { type : Array },
        restaurantId: { type : ObjectId },
        image: { type : String },
        qty: { type : Number },
        price: { type : String }
      }
);

const menuItemModel = mongoose.model ("menuItem", menuItemSchema, "menuitems");
module.exports = menuItemModel;