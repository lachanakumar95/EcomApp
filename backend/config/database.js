const mongoose = require('mongoose');
const dbConnect = async ()=>{
    try
    {
        await mongoose.connect(process.env.DB_URL);
        console.log("Databse Connected");
    }
    catch(err)
    {
        console.log("Database not connect", err);
         // You might want to exit the process if the connection fails.
         process.exit(1); // Exit the process with failure
    }
}

module.exports = dbConnect;