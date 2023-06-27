const mongoose = require("mongoose");

const mealTypeSchema = new mongoose.Schema ({
        name: { type : String },
        content: { type : String },
        image: { type : String },
        meal_type: { type : Number }
});

const mealTypeModel = mongoose.model("mealTypes", mealTypeSchema, "mealtype");

module.exports = mealTypeModel;