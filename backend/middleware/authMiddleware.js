const jwt = require('jsonwebtoken');
const User = require('../models/uderModel');

const protectPrivateRoute = async (req, res, next) => {
    let token;

    try{
        if(req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ){
            try{
                // Get Token from header
                token = req.headers.authorization.split(' ')[1];
    
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
                // Get user from token
                req.user = await User.findById(decoded.id).select('-password');
    
                next()
            }catch(error){
                res.status(401);
                throw new Error('Not authorized');
            }
        }
    
        if(!token){
            res.status(401);
            throw new Error('Not authorized');
        }
    }catch(err){
        res.send(err.message)
        console.log(err)
    }

}

module.exports = {
    protectPrivateRoute
};