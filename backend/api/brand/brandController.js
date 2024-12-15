const path = require('path');
const fs = require('fs');
const brandModel = require('./brandModel');
const customError = require('../../utils/customError');

exports.createBrand = async (req, res, next) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        // Enforce single file upload
        if (Array.isArray(req.files.file)) {
            return res.status(400).json({ success: false, error: 'Only one file is allowed' });
        }
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { brand_name } = req.body;
        if (!brand_name) throw customError.BadRequest("Brand name filed required");

        const file = req.files.file;
        const folderName = req.url.split('/')[1] || '';
        const uniqueFilename = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(__dirname, `../../uploads/${folderName}`, uniqueFilename);

        // Move the file to the uploads folder
        file.mv(uploadPath, async (err) => {
            if (err) return res.status(500).json({ error: 'Failed to move file' });
            await brandModel.create({
                brand_name: brand_name,
                file_name: uniqueFilename,
                file_path: uploadPath
            });
            res.status(201).json({ success: true, brand_name: brand_name, file: file.name, message: 'Brand created successfully', });

        });
    }
    catch (err) {
        next(err);
    }
}

exports.editBrand = async (req, res, next) => {
    try {
      
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { brand_name } = req.body;
        if (!brand_name) throw customError.BadRequest("Brand name filed required");

        const imageId = req.params.id;

        //Check exiting images
        const existingImage = await brandModel.findById(imageId);

         if (!existingImage) {
            return res.status(404).json({ success: false, error: 'Image not found from database' });
        }
        // Handle file upload if a file is provided
        let uniqueFilename = existingImage.file_name; // Retain the old file name if no new file is uploaded
        let uploadPath = existingImage.file_path; // Retain the old file path

        if (req.files && req.files.file) {
            const file = req.files.file;
            const folderName = req.url.split('/')[1] || '';
            uniqueFilename = `${Date.now()}_${file.name}`;
            uploadPath = path.join(__dirname, `../../uploads/${folderName}`, uniqueFilename);
            // Delete the old image from the file system
            if (fs.existsSync(existingImage.file_path)) {
                fs.unlinkSync(existingImage.file_path); // Delete the old file
            }
            // Move the new file to the uploads folder
            file.mv(uploadPath, async (err) => {
                if (err) return res.status(500).json({ success: false, error: 'Failed to move file' });
                //Update the category image and value
            });
        }

        await brandModel.findByIdAndUpdate(imageId, {
            brand_name: brand_name,
            file_name: uniqueFilename,
            file_path: uploadPath
        });
        res.status(201).json({ success: true, brand_name: brand_name, message: 'Brand Updated successfully', });

    }
    catch (err) {
        next(err);
    }
}

exports.deleteBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteBrand = await brandModel.findByIdAndUpdate(id, {
            isActive: false
        });
        if (deleteBrand) {
            res.status(200).json({ success: true, message: "Brand deleted successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch (err) {
        next(err);
    }
}

exports.getBrand = async (req, res, next)=>{
    try
    {
        const result = await brandModel.find({isActive:true}).sort({createdAt : -1});
        const fullRecords = result.map((item)=>{
            return {
                id : item._id,
                brand_name : item.brand_name,
                image : `${req.protocol}://${req.get('host')}/uploads/brand/${item.file_name}`,
                published : item.published,
                isActive : item.isActive,
                date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
            }
        });
        if(result.length > 0)
        {
            res.status(200).json({success: true, count:fullRecords.length, data: fullRecords});
        }
        else
        {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch(err)
    {
        next(err);
    }
}
//Admin  Published Brand only
exports.getBrandPublished = async (req, res, next)=>{
    try
    {
        const result = await brandModel.find(
            {
                isActive: true,
                published : true
            }
        ).sort({createdAt : -1});
        const fullRecords = result.map((item)=>{
            return {
                id : item._id,
                brand_name : item.brand_name,
                image : `${req.protocol}://${req.get('host')}/uploads/brand/${item.file_name}`,
                published : item.published,
                isActive : item.isActive,
                date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
            }
        });
        if(result.length > 0)
        {
            res.status(200).json({success: true, count:fullRecords.length, data: fullRecords});
        }
        else
        {
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
        const check = await brandModel.findByIdAndUpdate(id);
        if (check) {
            if (check.published) {
                await brandModel.findByIdAndUpdate(id, {
                    published: false
                });
                res.status(200).json({ success: true, message: "Brand unpublished successfully" });
            }
            else {
                await brandModel.findByIdAndUpdate(id, {
                    published: true
                });
                res.status(200).json({ success: true, message: "Brand published successfully" });
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
