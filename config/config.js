//IMPORT dotenv
require("dotenv").config();

module.exports = {
    MONGODB_URL:process.env.MONGODB_URL,
    PORT:process.env.PORT
}
//exporting to connectToDB.js and server