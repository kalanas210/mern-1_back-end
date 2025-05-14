


// admin login : /api/admin/login
import jwt from "jsonwebtoken";

export const adminLogin = async(req, res) => {
    try{
        const { email, password } = req.body;

        if(password === process.env.ADMIN_PASSWORD && email === process.env.ADMIN_EMAIL) {
            const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '1h'});

            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
                maxAge: 60 * 60 * 1000,
            });

            return res.json({success:true , message:'Admin Login successfully'});

        } else {
            return res.json({success:false , message:'Invalid email or password'});
        }
    } catch (error) {
        console.log(error.message);
        res.json({success:true , message:error.message});
    }
}

// admin is auth : /api/admin/is-auth


export const isAdminAuth = async(req, res) => {
    try{

        return res.json({success: true});

    } catch (error) {
        console.log(error.message);
        res.json({success: false , message:error.message});
    }
}

// admin logout : /api/admin/logout

export const adminLogout = async(req, res) => {
    try{
        res.clearCookie('adminToken',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
        });
        res.json({success: true , message:"Logout"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false , message:error.message});
    }
}
