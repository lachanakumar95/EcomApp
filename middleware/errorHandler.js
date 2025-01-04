const fs = require('fs');
const path = require('path');

// Define the path to the morgan log file
const logFilePath = path.join(__dirname, '../error.log');

function formatDateTo12Hour(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;
    return `${day}/${month}/${year}, ${formattedTime}`;
  }

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error details to the console for debugging
    console.error(err);

    // Append the error log to the access.log file
    const logEntry = `
    [${formatDateTo12Hour(new Date())}] ${req.method} ${req.originalUrl}
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
