const customError = require('../../utils/customError');
const taxModel = require('./taxModel');

exports.createTax = async (req, res, next)=>{
    try
    {   
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {tax_type, percentage} = req.body;

        if(!tax_type) throw customError.BadRequest('Tax type filed required');
        if(!percentage) throw customError.BadRequest('Percentage filed required');

        await taxModel.create({
            tax_type : tax_type,
            percentage : percentage
        });
        res.status(200).json({success: true, data : {...req.body}, message : 'Tax created successfully'});
    }
    catch(err)
    {
        next(err);
    }
}

exports.updateTax = async (req, res, next)=>{
    try
    {   
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const {id} = req.params;
        const {tax_type, percentage} = req.body;

        if(!tax_type) throw customError.BadRequest('Tax type filed required');
        if(!percentage) throw customError.BadRequest('Percentage filed required');

        const findTax = await taxModel.findById(id);
        if(!findTax)
        {
            res.status(200).json({success: false, message : "Cann't find tax record"});
        }

        await taxModel.findByIdAndUpdate(id, {
            tax_type : tax_type,
            percentage : percentage
        });

        res.status(200).json({success : true, data : {...req.body}, message : 'Tax updated successfully'});
    }
    catch(err)
    {
        next(err);
    }
}

exports.getTax = async (req, res, next)=>{
    try
    {
        const result = await taxModel.find().sort({createdAt : -1});

        if(result.length > 0)
        {
            res.status(200).json({success : true, data : result});
        }
        else
        {
            res.status(200).json({success : false, message : 'Tax records not found'});
        }
    }
    catch(err)
    {
        next(err);
    }
}

//Admin panel published only
exports.getTaxPublishedData = async (req, res, next)=>{
    try
    {
        const result = await taxModel.find({
            published : true
        }).sort({createdAt : -1});
        const fullRecords = result.map((item)=>{
            return {
                id : item._id,
                tax_type : item.tax_type,
                percentage : item.percentage,
                joinValue : `${item.tax_type} - ${item.percentage} %`,
                published : item.published
            }
        });
        if(result.length > 0)
        {
            res.status(200).json({success : true, data : fullRecords});
        }
        else
        {
            res.status(200).json({success : false, message : 'Tax records not found'});
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
        const check = await taxModel.findById(id);
        if (check) {
            if (check.published) {
                await taxModel.findByIdAndUpdate(id, {
                    published: false
                });
                res.status(200).json({ success: true, message: "Tax unpublished successfully" });
            }
            else {
                await taxModel.findByIdAndUpdate(id, {
                    published: true
                });
                res.status(200).json({ success: true, message: "Tax published successfully" });
            }
           
        }
        else {
            res.status(200).json({ success: false, message: "No recods not found" });
        }
    }
    catch (err) {
        next(err);
    }
}
