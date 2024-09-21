//import User model object
const User = require('./../model/userSchema')
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

//JWT SIGN TOKEN FUNCTION(generate a JSON web token for given user id) it protect our routes
const signToken = id => {
    return jwt.sign({id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
};

//SIGN UP A NEW USER
exports.signUp =  async (req,res,next) => {
    try{
        const newUser = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        });

        //ASSIGN A JWT TO NEW USER
        const token = signToken(newUser._id);

        //HIDE PASSWORD: i.e set password to undefined in response obj.
        newUser.password = undefined;
        //SEND RES BACK IN JSON FORMAT
        res.status(201).json({
            status:'success',
            token,
            data:{ user:newUser}
        });
    } catch (err){
        if(err) return next(err);
    }
}

//LOGIN A USER
exports.login =  async (req,res,next) => {
    const {email,password} = req.body;
    try{
        if(!email || !password){
          return res.status(401).json({message:"Please provide email and password"});
        }

        //1ST CHECK IF USER WITH PROVIDED EMAIL IS EXIST IN DB
        const user  = await User.findOne({email});
        const isValidPassword = await user.isValidPassword(password,user.password);
        if(!user && !isValidPassword){
          return res.status(400).json({message:"Incorrect email or password"}); 
        }

        /* //2ND COMPARE PASSWORD FOR EXISTING USER
        const isValidPassword = await user.isValidPassword(password,user.password);
        if(!isValidPassword) {
          return res.status(400).json({message:"incorrect Email or Password"});
           
        }  */

        //3RD IF USER EXISTS WITH VALID PASSWORD THEN ASSIGN THE USER A JWT TOKEN
        const token = signToken(user._id);
        //return token in json format as response 
        res.status(200).json({
            status:"Success",
            token
        });
    }catch(err){
        next(err);
    };
};

//CREATE A MIDDLEWARE FUNCTION THAT HANDLE USER AUTHENTICATION
exports.authenticationFunction = async (req,res, next) => {
    try{
        let token;
        //Check if token is passed to header
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }

        //IF TOKEN DOES NOT EXIST

        if(!token){
            return next(res.status(401).json("Unauthorized"));
        }

        //IF TOKEN EXISTS THEN CHECK ITS VALIDITY (may be altered or expired)
        const decodedPayload = await promisify(jwt.verify)(
            token,JWT_SECRET
        );

        //check if user still exists using token payload (user may be deactivated )
        const currentUser = await User.findById(decodedPayload.id);
        if(!currentUser) return next(res.status(401).json("User does not exist"));

        //if there is user exists, assing it to req.user object
        req.user = currentUser;
        next();
    }catch(err){
        res.json(err);
    }
};


/**
 * epxorts.authenticate(req,res,next){}
 It is an express middle where function designed to handle user authentication by varifying
 presence and validity of JWT passed in request's authorization header
 *starting of authorization header with word "bearer", indicate token had passed to header.

 * if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }


 It checks if incoming request contains an authorization header and if that authorization header starts
 with word "Bearer". Then split the header by space and takes the second part which is the actual token,
 and assign it to token variable.
 */

 //CALLING next() AFTER SENDING RESPONSE IS UNNECESSARY
 //PASS err IN catch block TO next() like next(err) BCZ next() IS ERROR HANDLING MIDDLEWARE