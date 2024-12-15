const path = require('path');
const fs = require('fs');
const customError = require('../../../utils/customError');
const generalinfoModel = require('./generalinfoModel');

exports.createUpdateRecords = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            throw customError.BadRequest("Request body can't be empty");
        }

        const { site_name, footer_copywrite, currency_symboll } = req.body;
        // if (!site_name || !footer_copywrite || !currency_symboll) {
        //     throw customError.BadRequest("site_name, footer_copywrite, and currency_symboll are required fields");
        // }

        const folderName = req.url.split('/')[1] || '';
        let uniqueFilename = null;
        let uploadPath = null;

        if (req.files && req.files.file) {
            const file = req.files.file;
            uniqueFilename = `${Date.now()}_${file.name}`;
            uploadPath = path.join(__dirname, `../../../uploads/${folderName}`, uniqueFilename);

            // Move the file to the uploads folder
            await new Promise((resolve, reject) => {
                file.mv(uploadPath, (err) => {
                    if (err) reject(new Error('Failed to move file'));
                    resolve();
                });
            });
        }

        const checkData = await generalinfoModel.find().select('-createdAt -updatedAt');

        if (checkData.length === 0) {
            // No existing record, create a new one
            const newRecord = {
                site_name,
                footer_copywrite,
                currency_symboll,
                file_name: uniqueFilename || null,
                file_path: uploadPath || null,
            };

            await generalinfoModel.create(newRecord);
        } else {
            // Update existing record
            const updateFields = {
                site_name,
                footer_copywrite,
                currency_symboll,
            };

            if (uniqueFilename && uploadPath) {
                const oldFilePath = checkData[0].file_path;

                // Delete the old file if it exists
                if (oldFilePath && fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                updateFields.file_name = uniqueFilename;
                updateFields.file_path = uploadPath;
            }

            await generalinfoModel.findByIdAndUpdate(checkData[0]._id.toString(), updateFields);
        }

        const result = await generalinfoModel.find();
        const final = result.map((item) => ({
            id: item._id,
            site_name: item.site_name,
            footer_copywrite: item.footer_copywrite,
            currency_symboll: item.currency_symboll,
            image: item.file_name
                ? `${req.protocol}://${req.get('host')}/uploads/${folderName}/${item.file_name}`
                : null,
        }));

        res.status(200).json({
            success: true,
            data: final,
            message: checkData.length === 0 ? 'Record inserted successfully' : 'Record updated successfully',
        });
    } catch (err) {
        next(err);
    }
};


exports.getGerneralInfo = async (req, res, next)=>{
    try
    {
        const result = await generalinfoModel.find();
        const final = result.map((item) => {
            return {
                id: item._id,
                site_name: item.site_name,
                footer_copywrite: item.footer_copywrite,
                currency_symboll: item.currency_symboll,
               // company_color: item.company_color,
                image: item.file_name === null ? null : `${req.protocol}://${req.get('host')}/uploads/generalinfo/${item.file_name}`
            }
        });
        if(result.length > 0)
        {
            res.status(200).json({success : true, data : final});
        }
        else
        {
            res.status(200).json({success : false, message : "No records not found"});
        }

    }
    catch(err)
    {
        next(err);
    }
}
