
const { response } = require("express");
const locationModel =require ("../model/locationModel");

module.exports.getLocationList = async (request,response) => {
    try {
        let location = await locationModel.find();
        let sendData = {
            status : location.list === 0 ? false : true,
            location,
            count : location.length
        };
        response.status(200).send(sendData);
    } catch (error) {
        let errorData = { status : false, error};
        response.status(400).send(errorData);
    }
};