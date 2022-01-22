const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Utsavsecret';
const fetchuser = async (req, res, next) => {
    //Get the tokenId and return user id 
    const tokenid = await req.header('auth-token');
    if (!tokenid) {
        return res.status(401).send('Please authenticate using valid token');
    }
    try {
        //verify and send to the next
        var decoded = jwt.verify(tokenid, JWT_SECRET);
        req.user = decoded.user
        next()
    } catch (error) {
        return res.status(401).send('Please authenticate using valid token');
    }

}

module.exports = fetchuser