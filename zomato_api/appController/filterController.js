const restaurantModel = require ("../model/restaurantModel");

module.exports.filter = async (request, response) => {
    try{
        let { MealType , loc_id, cuisine, page, hCost, lCost, sort } = request.body;
        let filter ={};
        // pagination
        const perPage = 2;
        const startIndex = (page - 1) * perPage;

        // filter operation 
        if (MealType !== undefined) filter ["mealtype_id"] = MealType;
        if (loc_id !== undefined) filter["location_id"] = loc_id;
        if (cuisine !== undefined) filter["cuisine_id"] = {$in : cuisine};
        if (lCost !== undefined && hCost !== undefined) {
          filter["min_price"] = { $lt: hCost, $gt: lCost };
        };

        
        let RestaurantList = await restaurantModel.find(filter).limit(perPage).skip(startIndex).sort({
          min_price: sort,
        });

        const totalNoOfRecords = await restaurantModel.find(filter).count();


        let sendData = {
            status: RestaurantList.length === 0 ? false : true,
            RestaurantList,
            count: RestaurantList.length,
            totalNoOfRecords: totalNoOfRecords
          };
          response.status(200).send(sendData);
        } catch (error) {
          let errorObj = { status: false, error };
          response.status(500).send(errorObj);
        };
}; 

