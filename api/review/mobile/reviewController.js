const customError = require('../../../utils/customError');
const reviewModel = require('./reviewModel');
exports.createReview = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {productid, rating, title, comment} = req.body;
        if(!productid) throw customError.BadRequest("Product ID filed required");
        if(!rating) throw customError.BadRequest("Rating filed required");
        await reviewModel.create({
            fk_user : req.user.id,
            fk_product : productid,
            rating : rating,
            title : title,
            comment : comment
        });
        res.status(200).json({success : true, data : {...req.body}, message : "Record inserted successfully"});
    }
    catch(err)
    {
        next(err);
    }
}