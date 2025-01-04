const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

// Ensure the 'uploads' folder exists
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Middleware for file uploads
const fileUploadMiddleware = (req, res, next) => {
  const folderName = req.url.split('/')[1] || '';
  const uploadDir = path.join(__dirname, '../uploads/', folderName);
  ensureUploadDir(uploadDir);

  // Initialize file upload settings
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, '../temp'),
    safeFileNames: true,
    preserveExtension: true,
    limits: { fileSize: 1 * 1024 * 1024 }, // 10MB file limit
  })(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });

    // Proceed to the next middleware or controller
    next();
  });
};

module.exports = fileUploadMiddleware;
