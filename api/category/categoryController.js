const path = require('path');
const fs = require('fs');
const customError = require('../../utils/customError');
const categoryModel = require('./categoryModel');

exports.createCategory = async (req, res, next) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        // Enforce single file upload
        if (Array.isArray(req.files.file)) {
            return res.status(400).json({ success: false, error: 'Only one file is allowed' });
        }

        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { category_name } = req.body;
        if (!category_name) throw customError.BadRequest("Category name filed required");

        const file = req.files.file;
        const folderName = req.url.split('/')[1] || '';
        const uniqueFilename = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(__dirname, `../../uploads/${folderName}`, uniqueFilename);

        // Move the file to the uploads folder
        file.mv(uploadPath, async (err) => {
            if (err) return res.status(500).json({ error: 'Failed to move file' });
            await categoryModel.create({
                category_name: category_name,
                file_name: uniqueFilename,
                file_path: uploadPath
            });
            res.status(201).json({ success: true, categoryname: req.body.category_name, file: file.name, message: 'Category created successfully', });

        });
    }
    catch (err) {
        next(err);
    }
}

exports.editCategory = async (req, res, next) => {
    try {

        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { category_name } = req.body;
        if (!category_name) throw customError.BadRequest("Category name filed required");

        const imageId = req.params.id;

        //Check exiting images
        const existingImage = await categoryModel.findById(imageId);
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
        await categoryModel.findByIdAndUpdate(imageId, {
            category_name: category_name,
            file_name: uniqueFilename,
            file_path: uploadPath
        });
        res.status(201).json({ success: true, categoryname: req.body.category_name, message: 'Category updated successfully', });

    }
    catch (err) {
        next(err);
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteCategory = await categoryModel.findByIdAndUpdate(id, {
            isActive: false
        });
        if (deleteCategory) {
            res.status(200).json({ success: true, message: "Category deleted successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch (err) {
        next(err);
    }
}

exports.getCategory = async (req, res, next) => {
    try {
        const categoryResult = await categoryModel.find({
            isActive: true
        })
            .sort({
                createdAt: -1
            });
        const finalResult = categoryResult.map((item) => {
            return {
                id: item._id,
                category_name: item.category_name,
                image: `${req.protocol}://${req.get('host')}/uploads/category/${item.file_name}`,
                home_display: item.home_display,
                published: item.published,
                isActive: item.isActive,
                date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
            }
        });
        if (categoryResult.length > 0) {
            res.status(200).json({ success: true, count: categoryResult.length, data: finalResult });
        }
        else {
            res.status(200).json({ success: true, data:finalResult, message: "No records not found" })
        }
    }
    catch (err) {
        next(err);
    }
}

//Admin panel 
exports.getCategorypublished = async (req, res, next) => {
    try {
        const categoryResult = await categoryModel.find({
            isActive: true, published : true
        })
            .sort({
                createdAt: -1
            });
        const finalResult = categoryResult.map((item) => {
            return {
                id: item._id,
                category_name: item.category_name,
                image: `${req.protocol}://${req.get('host')}/uploads/category/${item.file_name}`,
                home_display: item.home_display,
                published: item.published,
                isActive: item.isActive,
                date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
            }
        });
        if (categoryResult.length > 0) {
            res.status(200).json({ success: true, count: categoryResult.length, data: finalResult });
        }
        else {
            res.status(200).json({ success: true, data:finalResult, message: "No records not found" })
        }
    }
    catch (err) {
        next(err);
    }
}

/// Seting of category

exports.homeDisplay = async (req, res, next) => {
    try {
        const { id } = req.params;
        const check = await categoryModel.findByIdAndUpdate(id);
        if (check) {
            if (check.home_display) {
                await categoryModel.findByIdAndUpdate(id, {
                    home_display: false
                });
            }
            else {
                await categoryModel.findByIdAndUpdate(id, {
                    home_display: true
                });
            }
            res.status(200).json({ success: true, message: "Category home display updated successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "No recods not found" });
        }
    }
    catch (err) {
        next(err);
    }
}

exports.published = async (req, res, next) => {
    try {
        const { id } = req.params;
        const check = await categoryModel.findByIdAndUpdate(id);
        if (check) {
            if (check.published) {
                await categoryModel.findByIdAndUpdate(id, {
                    published: false
                });
                res.status(200).json({ success: true, message: "Category unpublished successfully" });
            }
            else {
                await categoryModel.findByIdAndUpdate(id, {
                    published: true
                });
                res.status(200).json({ success: true, message: "Category published successfully" });
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

