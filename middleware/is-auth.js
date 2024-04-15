
const jwt = require('jsonwebtoken');


// validating and attaching token to all request 
module.exports= (req, res , next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token , 'secret');
    } catch (err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    // if passed the above if block hence the user has correct jwt hence now we should let him go ahead
    req.userId = decodedToken.userId;
    next();
    
}