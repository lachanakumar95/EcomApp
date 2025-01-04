const path = require('path');
const fs = require('fs');
const offerbannerModel = require('./offerbannerModel');
const customError = require('../../utils/customError');

exports.createOfferbanner = async (req, res, next) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        // Enforce single file upload
        if (Array.isArray(req.files.file)) {
            return res.status(400).json({ success: false, error: 'Only one file is allowed' });
        }
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { title } = req.body;
        if (!title) throw customError.BadRequest("Title filed required");

        const file = req.files.file;
        const folderName = req.url.split('/')[1] || '';
        const uniqueFilename = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(__dirname, `../../uploads/${folderName}`, uniqueFilename);

        // Move the file to the uploads folder
        file.mv(uploadPath, async (err) => {
            if (err) return res.status(500).json({ error: 'Failed to move file' });
            await offerbannerModel.create({
                title: title,
                file_name: uniqueFilename,
                file_path: uploadPath
            });
            res.status(201).json({ success: true, title: title, file: file.name, message: 'Record inserted successfully', });

        });
    }
    catch (err) {
        next(err);
    }
}

exports.editOfferbanner = async (req, res, next) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        // Enforce single file upload
        if (Array.isArray(req.files.file)) {
            return res.status(400).json({ success: false, error: 'Only one file is allowed' });
        }
        if (Object.keys(req.body).length === 0) throw customError.BadRequest("Request body cann't be empty");
        const { title } = req.body;
        if (!title) throw customError.BadRequest("Title filed required");

        const file = req.files.file;
        const folderName = req.url.split('/')[1] || '';
        const uniqueFilename = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(__dirname, `../../uploads/${folderName}`, uniqueFilename);

        const imageId = req.params.id;

        //Check exiting images
        const existingImage = await offerbannerModel.findById(imageId);
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
                    await offerbannerModel.findByIdAndUpdate(imageId, {
                        title: title,
                        file_name: uniqueFilename,
                        file_path: uploadPath
                    });
                    res.status(201).json({ success: true, title: title, file: file.name, message: 'Record Updated successfully', });
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

exports.deleteOfferbanner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteOfferbanner = await offerbannerModel.findByIdAndUpdate(id, {
            isActive: false
        });
        if (deleteOfferbanner) {
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

exports.getofferBanner = async (req, res, next) => {
    try {
        const result = await offerbannerModel.find({ isActive: true }).sort({ createdAt: -1 });
        const fullRecords = result.map((item) => {
            return {
                id: item._id,
                title: item.title,
                image: `${req.protocol}://${req.get('host')}/uploads/brand/${item.file_name}`,
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
        const check = await offerbannerModel.findByIdAndUpdate(id);
        if (check) {
            if (check.published) {
                await offerbannerModel.findByIdAndUpdate(id, {
                    published: false
                });
            }
            else {
                await offerbannerModel.findByIdAndUpdate(id, {
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
