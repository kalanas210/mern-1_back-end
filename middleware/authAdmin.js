import jwt from "jsonwebtoken";

const authAdmin  = async (req, res , next) => {

    const {adminToken} = req.cookies;
    if (!adminToken) {
        return res.json({success: false, message: 'Not logged in'});
    }

    try{
        const tokenDecode = jwt.verify(adminToken, process.env.JWT_SECRET);
        console.log(tokenDecode);
        if (tokenDecode.email === process.env.ADMIN_EMAIL) {
            next();
        } else {
            return res.json({success: false, message: 'Not Authenticated'});
        }

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export default authAdmin;