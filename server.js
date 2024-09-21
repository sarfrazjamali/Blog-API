const app = require('./app');
const CONFIG = require('./config/config');
//Import DB connection function
const connectToDB = require('./db/connectToDB');

//Invoke connection DB function
connectToDB();
app.listen(CONFIG.PORT,()=>{
    console.log(`Server is running on http://locahost:${CONFIG.PORT}`);
    
});