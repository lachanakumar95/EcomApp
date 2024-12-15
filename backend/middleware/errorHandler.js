const fs = require('fs');
const path = require('path');

// Define the path to the morgan log file
const logFilePath = path.join(__dirname, '../error.log');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error details to the console for debugging
    console.error(err);

    // Append the error log to the access.log file
    const logEntry = `
    [${new Date().toISOString()}] ${req.method} ${req.originalUrl}
    Status: ${statusCode}
    Error: ${message}
    Stack: ${err.stack || 'No stack trace available'}\n`;

    fs.appendFile(logFilePath, logEntry, (error) => {
        if (error) {
            console.error('Failed to write error to log file:', error);
        }
    });

    // Send the error response
    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

module.exports = errorHandler;
