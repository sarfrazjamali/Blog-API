const mongoose = require('mongoose');
const CONFIG = require('./../config/config');

//DB CONNECTION FUNCTION
const connectToDB = () => {
    mongoose.connect(CONFIG.MONGODB_URL);

    //Event listener to test connection
    mongoose.connection.on('connected',()=>{
        console.log("Successfully connect to DB !");   
    });

    //catch error
    mongoose.connection.on('error',(err)=>{
        console.log("Connection to DB Failed");
        console.log(err);
    })
}
module.exports = connectToDB;