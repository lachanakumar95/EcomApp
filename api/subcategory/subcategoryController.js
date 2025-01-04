const path = require('path');
const fs = require('fs');
const customError = require('../../utils/customError');
const subCategoryModel = require('./subcategoryModel');

exports.subCreateCategory = async (req, res, next) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        // Enforce single file upload
        if (Array.isArray(req.files.file)) {
            return res.status(400).json({ success: false, error: 'Only one file is allowed' });
        }

        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { subcategory_name, parentcategory } = req.body;
        if (!subcategory_name) throw customError.BadRequest("Sub category name filed required");
        if (!parentcategory) throw customError.BadRequest("Parent category filed required");

        const file = req.files.file;
        const folderName = req.url.split('/')[1] || '';
        const uniqueFilename = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(__dirname, `../../uploads/${folderName}`, uniqueFilename);

        // Move the file to the uploads folder
        file.mv(uploadPath, async (err) => {
            if (err) return res.status(500).json({ error: 'Failed to move file' });
            await subCategoryModel.create({
                subcategory_name: subcategory_name,
                file_name: uniqueFilename,
                file_path: uploadPath,
                fk_category: parentcategory
            });
            res.status(201).json({ success: true, subcategoryname: req.body.subcategory_name, file: file.name, message: 'Sub Category created successfully', });

        });
    }
    catch (err) {
        next(err);
    }
}

exports.editSubcategory = async (req, res, next) => {
    try {
       
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { subcategory_name, parentcategory } = req.body;
        if (!subcategory_name) throw customError.BadRequest("Category name filed required");
        if (!parentcategory) throw customError.BadRequest("Parent category filed required");

        const imageId = req.params.id;

        //Check exiting images
        const existingImage = await subCategoryModel.findById(imageId);
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
       
        await subCategoryModel.findByIdAndUpdate(imageId, {
            subcategory_name: subcategory_name,
            file_name: uniqueFilename,
            file_path: uploadPath,
            fk_category: parentcategory
        });
        res.status(201).json({ success: true, subcategoryname: req.body.subcategory_name, message: 'Sub Category Updated successfully', });

    }
    catch (err) {
        next(err);
    }
}

exports.deleteSubcategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteCategory = await subCategoryModel.findByIdAndUpdate(id, {
            isActive: false
        });
        if (deleteCategory) {
            res.status(200).json({ success: true, message: "Sub Category deleted successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch (err) {
        next(err);
    }
}

exports.getSubcategory = async (req, res, next) => {
    try {
        const result = await subCategoryModel.find({
            isActive: true
        }).populate({
            path: 'fk_category',
            match: { isActive: true, published: true },
            select: 'category_name'
        }).sort({ createdAt: -1 });

        const full = result.map((item) => {
            if (item.fk_category == null) // check parent category isactive true and published true
            {
                return {
                    id: item._id,
                    subcategory_name: item.subcategory_name,
                    parentCategory: null,
                    home_display: item.home_display,
                    published: item.published,
                    isActive: item.isActive,
                    images: `${req.protocol}://${req.get('host')}/uploads/subcategory/${item.file_name}`,
                    date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
                };
            }
            else {
                return {
                    id: item._id,
                    subcategory_name: item.subcategory_name,
                    parentCategory: {
                        id: item.fk_category._id,
                        category_name: item.fk_category.category_name
                    },
                    home_display: item.home_display,
                    published: item.published,
                    isActive: item.isActive,
                    images: `${req.protocol}://${req.get('host')}/uploads/subcategory/${item.file_name}`,
                    date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
                };
            }
        });
        if ((result.length > 0)) {
            res.status(200).json({ success: true, count: result.length, data: full });
        }
        else {
            res.status(200).json({ success: true, message: "No records not found" })
        }

    }
    catch (err) {
        next(err);
    }
}

//Admin panel form parent category id based
exports.getSubcategoryBasedParent = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await subCategoryModel.find({
            fk_category : id,
            isActive: true,
            published : true
        }).populate({
            path: 'fk_category',
            match: { isActive: true, published: true },
            select: 'category_name'
        }).sort({ createdAt: -1 });

        const full = result.map((item) => {
            if (item.fk_category == null) // check parent category isactive true and published true
            {
                return {
                    id: item._id,
                    subcategory_name: item.subcategory_name,
                    parentCategory: null,
                    home_display: item.home_display,
                    published: item.published,
                    isActive: item.isActive,
                    images: `${req.protocol}://${req.get('host')}/uploads/subcategory/${item.file_name}`,
                    date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
                };
            }
            else {
                return {
                    id: item._id,
                    subcategory_name: item.subcategory_name,
                    parentCategory: {
                        id: item.fk_category._id,
                        category_name: item.fk_category.category_name
                    },
                    home_display: item.home_display,
                    published: item.published,
                    isActive: item.isActive,
                    images: `${req.protocol}://${req.get('host')}/uploads/subcategory/${item.file_name}`,
                    date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
                };
            }
        });
        if ((result.length > 0)) {
            res.status(200).json({ success: true, count: result.length, data: full });
        }
        else {
            res.status(200).json({ success: true, message: "No records not found" })
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
        const check = await subCategoryModel.findByIdAndUpdate(id);
        if (check) {
            if (check.home_display) {
                await subCategoryModel.findByIdAndUpdate(id, {
                    home_display: false
                });
            }
            else {
                await subCategoryModel.findByIdAndUpdate(id, {
                    home_display: true
                });
            }
            res.status(200).json({ success: true, message: "Sub Category home display updated successfully" });
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
        const check = await subCategoryModel.findByIdAndUpdate(id);
        if (check) {
            if (check.published) {
                await subCategoryModel.findByIdAndUpdate(id, {
                    published: false
                });
                res.status(200).json({ success: true, message: "Sub Category unpublished successfully" });
            }
            else {
                await subCategoryModel.findByIdAndUpdate(id, {
                    published: true
                });
                res.status(200).json({ success: true, message: "Sub Category published successfully" });
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
