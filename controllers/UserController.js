// Register User : api/user/register

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Changed from 'bcrypt' to 'bcryptjs' for better compatibility

export const register = async(req, res) => {
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.json({success: false , message:"Missing required field"});
        }

        const existingUser = await User.findOne({email: email});

        if (existingUser) {
            return res.json({success: false , message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({name, email, password: hashedPassword});

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
            maxAge: 60 * 60 * 1000,
        });

        return res.json({success: true, user:{email:user.email, name:user.name} });

    } catch (error) {
        console.log(error.message);
        res.json({success: false , message:error.message});
    }
}

// Login User : api/user/login

export const login = async(req, res) => {
    try{

        const {email, password} = req.body;
        if (!email || !password) {
            return res.json({success: false , message:"Missing required field"});
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.json({success: false , message:"Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({success: false , message:"Invalid password"});
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
            maxAge: 60 * 60 * 1000,
        });

        return res.json({success: true, user:{email:user.email, name:user.name} });

    } catch (error){
        console.log(error.message);
        res.json({success: false , message:error.message});
    }
}

// check Auth : /api/use/is-auth

export const isAuth = async(req, res) => {
    try{
        const userId = req.user;
        const user = await User.findById({_id:userId}).select("-password");
        return res.json({success: true, user});

    } catch (error) {
        console.log(error.message);
        res.json({success: false , message:error.message});
    }
}

//Logout use : /api/user/logout

export const logout = async(req, res) => {
    try{
        res.clearCookie('token',{
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

