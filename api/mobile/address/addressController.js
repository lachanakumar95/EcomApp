const addressModel = require('../../address/addressModel');
const customError = require('../../../utils/customError');

exports.createAddress = async (req, res, next)=>{
    try
    {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Request Body Cann't be empty");
        const {house_no, street, landmark, country, state, city, pincode, address_type, set_default} = req.body;
        const userId = req.user.id;
        if(!house_no) throw customError.BadRequest('House No filed required');
        if(!street) throw customError.BadRequest('Street filed required');
        if(!landmark) throw customError.BadRequest('Landmark filed required');
        if(!country) throw customError.BadRequest('Country filed required');
        if(!state) throw customError.BadRequest('State filed required');
        if(!city) throw customError.BadRequest('City filed required');
        if(!pincode) throw customError.BadRequest('Pincode filed required');

        await addressModel.create({
            fk_user : userId,
            house_no : house_no,
            street : street,
            landmark : landmark,
            country : country,
            state : state,
            city : city,
            pincode : pincode,
            address_type : address_type,
            set_default : set_default
        });

        res.status(200).json({success : true, data : {...req.body}, message : 'Record inserted successfully'});

    }
    catch(err)
    {
        next(err);
    }
}

exports.updateAddress = async (req, res, next)=>{
    try
    {
    
    }
    catch(err)
    {
        next(err);
    }
}