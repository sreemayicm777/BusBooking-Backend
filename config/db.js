const mongoose = require("mongoose");

const ConnectDB = async() =>{
    try {
        const connect = await mongoose.connect(process.env.DB_URI);
        console.log("Database is connected:", connect.connection.name );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = ConnectDB;