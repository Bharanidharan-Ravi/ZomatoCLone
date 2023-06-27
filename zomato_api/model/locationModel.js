const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema ({
        name: { type : String },
        city_id: { type : Number },
        location_id: { type : Number },
        city: { type : String },
        country_name: { type : String }
});

const locationModel = mongoose.model( "locations" , locationSchema, "location");

module.exports = locationModel;