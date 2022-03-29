const bcrypt = require('bcrypt');
const User = require('../models/uderModel');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../middleware/errorMiddleware');

// @desc   Register a new user
// @route  /api/users
// @access Public
const registerUser = async (req, res, next) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please include all fields');
    }

    try{

        // Find if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400)
            throw new Error('Invalid user data');
        }
    
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
    
        if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else{
            res.status(400);
            throw new Error('Invalid user data')
        }
    }catch(err){
        next(err);
    }
}


// @desc   Register a new user
// @route  /api/users/login
// @access Public
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});

    try{
        // Check user and passwords match
        if(user && (await bcrypt.compare(password, user.password))){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else{
            res.status(401);
            throw new Error('Invalid credentials')
        }
    }catch(err){
        next(err);
    }

}

// @desc   Get current user
// @route  /api/users/me
// @access Private
const getMe = async (req, res) => {
    const user = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name
    }
    res.status(200).json(user);
}

const generateToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '10d'
    })
}


module.exports = {
    registerUser,
    loginUser,
    getMe
}