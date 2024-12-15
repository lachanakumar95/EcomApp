const policyModel = require('./policyModel');
const customError = require('../../../utils/customError');
exports.createUpdate = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request body can'nt be empty");
        
        const {terms_condition, shipping_policy, privacy_policy, return_policy} = req.body;
        
        // if(!terms_condition) throw customError.BadRequest("Terms & Condition field required");
        // if(!shipping_policy) throw customError.BadRequest("Shipping Policy field required");
        // if(!privacy_policy) throw customError.BadRequest("Privacy Policy field required");
        // if(!return_policy) throw customError.BadRequest("Return Policy field required");

        const checkData = await policyModel.find();

        if(checkData.length == 0)
        {
            await policyModel.create({
                terms_condition : terms_condition,
                shipping_policy : shipping_policy,
                privacy_policy : privacy_policy,
                return_policy : return_policy
            });

            const result = await policyModel.find().select("-createdAt -updatedAt");
            res.status(200).json({success : true, data : result, message: "Record inserted successfully"});
        }
        else
        {
            await policyModel.findByIdAndUpdate(checkData[0]._id.toString(), {
                terms_condition : terms_condition,
                shipping_policy : shipping_policy,
                privacy_policy : privacy_policy,
                return_policy : return_policy
            });

            const result = await policyModel.find().select("-createdAt -updatedAt");
            res.status(200).json({success : true, data : result, message: "Record updated successfully"});
        }
    }
    catch(err)
    {
        next(err);
    }
}

exports.getPolicy = async (req, res, next)=>{
    try
    {
        const result = await policyModel.find();
        if(result.length > 0)
        {
            res.status(200).json({success : true, data : result});
        }
        else
        {
            res.status(200).json({success : false, message : 'No records not found'});
        }
    }
    catch(err)
    {
        next(err);
    }
}