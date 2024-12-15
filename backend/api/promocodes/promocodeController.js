const customError = require('../../utils/customError');
const promocodeModel = require('./promocodeModel');

exports.createPromocode = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {promocode, discount_percentage, max_discount_price, min_order_price, usageCount, maxUsage, expiryDate, description} = req.body;
        if(!promocode) throw customError.BadRequest('Promo Code filed required');
        if(!discount_percentage) throw customError.BadRequest("Discount percentage filed required");
        if(!max_discount_price) throw customError.BadRequest("Maximum discount price filed required");
        if(!min_order_price) throw customError.BadRequest("Minimum order price filed required");
        if(!maxUsage) throw customError.BadRequest("Apply of number time filed required");
        if(!expiryDate) throw customError.BadRequest("Expiry date filed required");
        await promocodeModel.create({
            promocode : promocode,
            discount_percentage : discount_percentage,
            max_discount_price : max_discount_price,
            min_order_price : min_order_price,
            maxUsage : maxUsage,
            expiryDate : expiryDate,
            description : description

        });
        res.status(200).json({success : true, data : {...req.body}, message : "Record inserted successfully"});
    }
    catch(err)
    {
        next(err);
    }
}

exports.getpromocode = async (req, res, next)=>{
    try
    {
        const result = await promocodeModel.find({isActive : true})
        .sort({createdAt : -1});
        const final = result.map((item)=>{
            return {
                id : item._id.toString(),
                promocode : item.promocode,
                discount_percentage : item.discount_percentage,
                max_discount_price : item.max_discount_price,
                min_order_price : item.min_order_price,
                maxUsage : item.maxUsage,
                expiryDate :  new Date(item.expiryDate).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', ''),
                description : item.description
            }
        });
        if(result.length > 0)
        {
            res.status(200).json({success : true, count: result.length, data : final});
        }
        else
        {
            res.status(200).json({ success: true, message: "No records not found" });
        }
    }
    catch(err)
    {
        next(err);
    }
}

exports.deletePromocode = async (req, res, next)=>{
    try
    {
        const {id} = req.params;
        if(!id) throw customError.BadRequest("Promo code id field required");
        const deletePromocode = await promocodeModel.findByIdAndUpdate(id,{
            isActive : false
        });
        if (deletePromocode) {
            res.status(200).json({ success: true, message: "Record deleted successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch(err)
    {
        next(err);
    }

}


exports.published = async (req, res, next) => {
    try {
        const { id } = req.params;
        const check = await promocodeModel.findByIdAndUpdate(id);
        if (check) {
            if (check.published) {
                await promocodeModel.findByIdAndUpdate(id, {
                    published: false
                });
            }
            else {
                await promocodeModel.findByIdAndUpdate(id, {
                    published: true
                });
            }
            res.status(200).json({ success: true, message: "Record updated successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "No recods not found" });
        }
    }
    catch (err) {
        next(err);
    }
}
