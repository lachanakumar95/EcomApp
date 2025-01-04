const path = require('path');
const fs = require('fs');
const tagsModel = require('./tagsModel');
const customError = require('../../utils/customError');

exports.createTags = async (req, res, next) => {
    try {
        // Check if the request body is empty
        if (Object.keys(req.body).length === 0) {
            throw customError.BadRequest("Request body cannot be empty");
        }

        const { tag_name } = req.body;

        // Check if tag_name is provided
        if (!tag_name) {
            throw customError.BadRequest("Tag name field is required");
        }

        let uniqueFilename = null;
        let uploadPath = null;

        // Check if a file is uploaded
        if (req.files && req.files.file) {
            const file = req.files.file;

            // Enforce single file upload
            if (Array.isArray(file)) {
                return res.status(400).json({ success: false, error: 'Only one file is allowed' });
            }

            const folderName = req.url.split('/')[1] || '';
            uniqueFilename = `${Date.now()}_${file.name}`;
            uploadPath = path.join(__dirname, `../../uploads/${folderName}`, uniqueFilename);

            // Move the file to the uploads folder
            await new Promise((resolve, reject) => {
                file.mv(uploadPath, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        // Save tag data to the database
        await tagsModel.create({
            tag_name: tag_name,
            file_name: uniqueFilename || null, // Save null if no file
            file_path: uploadPath || null,     // Save null if no file
        });

        res.status(201).json({
            success: true,
            tag_name: tag_name,
            file: uniqueFilename || 'No file uploaded',
            message: 'Tag created successfully',
        });
    } catch (err) {
        next(err);
    }
};


exports.editTags = async (req, res, next) => {
    try {

        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { tag_name } = req.body;
        if (!tag_name) throw customError.BadRequest("Tag name filed required");

        const imageId = req.params.id;

        //Check exiting images
        const existingImage = await tagsModel.findById(imageId);
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
        await tagsModel.findByIdAndUpdate(imageId, {
            tag_name: tag_name,
            file_name: uniqueFilename,
            file_path: uploadPath
        });
        res.status(201).json({ success: true, tag_name: tag_name, message: 'Tag Updated successfully', });

    }
    catch (err) {
        next(err);
    }
}

exports.deleteTags = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteTags = await tagsModel.findByIdAndUpdate(id, {
            isActive: false
        });
        if (deleteTags) {
            res.status(200).json({ success: true, message: "Tag deleted successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch (err) {
        next(err);
    }
}

exports.getTags = async (req, res, next) => {
    try {
        const result = await tagsModel.find({ isActive: true }).sort({ createdAt: -1 });
        const fullRecords = result.map((item) => {
            return {
                id: item._id,
                tag_name: item.tag_name,
                image: item.file_name == null ? null : `${req.protocol}://${req.get('host')}/uploads/tags/${item.file_name}`,
                published: item.published,
                isActive: item.isActive,
                date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
            }
        });
        if (result.length > 0) {
            res.status(200).json({ success: true, count: fullRecords.length, data: fullRecords });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch (err) {
        next(err);
    }
}

//Admin published tag
exports.getTagsPublished = async (req, res, next) => {
    try {
        const result = await tagsModel.find(
            { 
                isActive: true,
                published : true
             }
        ).sort({ createdAt: -1 });
        const fullRecords = result.map((item) => {
            return {
                id: item._id,
                tag_name: item.tag_name,
                image: `${req.protocol}://${req.get('host')}/uploads/tags/${item.file_name}`,
                published: item.published,
                isActive: item.isActive,
                date: new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '')
            }
        });
        if (result.length > 0) {
            res.status(200).json({ success: true, count: fullRecords.length, data: fullRecords });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch (err) {
        next(err);
    }
}

exports.published = async (req, res, next) => {
    try {
        const { id } = req.params;
        const check = await tagsModel.findByIdAndUpdate(id);
        if (check) {
            if (check.published) {
                await tagsModel.findByIdAndUpdate(id, {
                    published: false
                });
                res.status(200).json({ success: true, message: "Tag unpublished successfully" });
            }
            else {
                await tagsModel.findByIdAndUpdate(id, {
                    published: true
                });
                res.status(200).json({ success: true, message: "Tag published successfully" });
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
