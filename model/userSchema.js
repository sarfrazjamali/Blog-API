const mongooose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");

const userSchema = new mongooose.Schema({
    firstname:{
        type:String,
        required:[true,"A user must have a first name."],
    },

    lastname:{
        type:String,
        required:[true,"A user must have a last name" ]
    },

    email:{
        type:String,
        required:[true,"A user must have a email."],
        unique:[true,"A user must have a unique email."],
        lowercase:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },

    password:{
        type:String,
        required:true,
    },

    posts:[
        {
            type:mongooose.Schema.Types.ObjectId,
            ref:"Post",
        },
    ],
});

//HASH THE PLAIN TEXT PASSWORD BEFORE SAVING IN DB
userSchema.pre("save",async function(next){
    //AVOID RE-HASHING (only hash if password field in this doc is new or modified)
    if(!this.isModified("password"))  return next();

    //HASH THE PASSWORD , IF PASSWORD IS NOT EMPTY OR UNDEFIEND,IF EMPTY OR UNDEFINED GO TO NEXT()
    if(this.password) return hashedPassword = await bcrypt.hash(this.password,10);
    next();
});

//COMPARE PASSWORDS
userSchema.methods.isValidPassword = async (currentPassword,storedUserPassword) => {
    return await bcrypt.compare(currentPassword,storedUserPassword);
};
const User = mongooose.model("User",userSchema);
module.exports = User;

