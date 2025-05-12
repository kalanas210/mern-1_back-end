import jwt from "jsonwebtoken";


const authUser = async (req, res, next) => {
    const {token} = req.cookies;
    console.log(token);
    if (!token) {
        return res.json({success: false, message: 'Not Authenticated'});
    }
    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(tokenDecode);
        if (tokenDecode.id) {
            req.user= tokenDecode.id;
            console.log(req.user);
        } else {
            return res.json({success: false, message: 'Not Authenticated'});
        }
        next();

    } catch (error) {
        res.json({success: false, message: error.message});
    }

}

export default authUser;