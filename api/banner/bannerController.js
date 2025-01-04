const path = require('path');
const fs = require('fs');
const bannerModel = require('./bannerModel');
const customError = require('../../utils/customError');

exports.createBanner = async (req, res, next) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        // Enforce single file upload
        if (Array.isArray(req.files.file)) {
            return res.status(400).json({ success: false, error: 'Only one file is allowed' });
        }
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { title, description } = req.body;
        if (!title) throw customError.BadRequest("Title filed required");
        if (!description) throw customError.BadRequest("Description filed required");

        const file = req.files.file;
        const folderName = req.url.split('/')[1] || '';
        const uniqueFilename = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(__dirname, `../../uploads/${folderName}`, uniqueFilename);

        // Move the file to the uploads folder
        file.mv(uploadPath, async (err) => {
            if (err) return res.status(500).json({ error: 'Failed to move file' });
            await bannerModel.create({
                title : title,
                description : description,
                file_name: uniqueFilename,
                file_path: uploadPath
            });
            res.status(201).json({ success: true, title: title, description: description, file: file.name, message: 'Record inserted successfully', });

        });
    }
    catch (err) {
        next(err);
    }
}

exports.editBanner = async (req, res, next) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        // Enforce single file upload
        if (Array.isArray(req.files.file)) {
            return res.status(400).json({ success: false, error: 'Only one file is allowed' });
        }
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { title, description } = req.body;
        if (!title) throw customError.BadRequest("Title filed required");
        if (!description) throw customError.BadRequest("Description filed required");

        const file = req.files.file;
        const folderName = req.url.split('/')[1] || '';
        const uniqueFilename = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(__dirname, `../../uploads/${folderName}`, uniqueFilename);

        const imageId = req.params.id;

        //Check exiting images
        const existingImage = await bannerModel.findById(imageId);
        if (!existingImage) {
            return res.status(404).json({ success: false, error: 'Image not found from database' });
        }

        if (fs.existsSync(existingImage.file_path)) {
            // Delete the old image from the file system
            fs.unlink(existingImage.file_path, async (err) => {

                if (err) return res.status(500).json({ error: 'Failed to delete old image' });
                // Move the file to the uploads folder
                file.mv(uploadPath, async (err) => {
                    if (err) return res.status(500).json({ error: 'Failed to move file' });
                    await bannerModel.findByIdAndUpdate(imageId, {
                        title : title,
                        description : description,
                        file_name: uniqueFilename,
                        file_path: uploadPath
                    });
                    res.status(201).json({ success: true, title: title, description: description, file: file.name, message: 'Record Updated successfully', });
                });
            });

        }
        else {
            return res.status(404).json({ success: false, error: 'Old image not found in file system' });
        }

    }
    catch (err) {
        next(err);
    }
}

exports.deleteBanner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteBanner = await bannerModel.findByIdAndUpdate(id, {
            isActive: false
        });
        if (deleteBanner) {
            res.status(200).json({ success: true, message: "Record deleted successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "No records found" });
        }
    }
    catch (err) {
        next(err);
    }
}

exports.getBanner = async (req, res, next) => {
    try {
        const result = await bannerModel.find({ isActive: true }).sort({ createdAt: -1 });
        const fullRecords = result.map((item) => {
            return {
                id: item._id,
                title: item.title,
                description: item.description,
                image: `${req.protocol}://${req.get('host')}/uploads/banner/${item.file_name}`,
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
        const check = await bannerModel.findByIdAndUpdate(id);
        if (check) {
            if (check.published) {
                await bannerModel.findByIdAndUpdate(id, {
                    published: false
                });
            }
            else {
                await bannerModel.findByIdAndUpdate(id, {
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