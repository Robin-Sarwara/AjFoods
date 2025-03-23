const jwt = require('jsonwebtoken')
require('dotenv').config()

const EnsureAuthenticated = (req,res,next)=>{
    const auth = req.header('authorization');
    if(!auth){
        return res.status(403)
        .json({message:"Unauthorized, JWT Token is required"})
    }
    try{
    const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : auth; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded;
    next()
    }
    catch(err){
        res.status(401)
        .json({message:"Unauthorized, JWT token is wrong or expired"})
    }
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: "Access denied, Admins only"
        });
        
    }
    next();
};


module.exports = {EnsureAuthenticated,isAdmin}