const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema ({
        pay_id: {type : String},
        order_id: {type : String},
        signature: {type : String},
        orders : {type : Array},
        name: {type : String},
        email: {type : String},
        contact: {type : String},
        address : {type : String},
        totalAmount : {type : Number},
        rest_id : {type: mongoose.Schema.Types.ObjectId},
        rest_name : {type : String},
});

const orderModel = mongoose.model( "order" , orderSchema, "userOrder");

module.exports = orderModel;