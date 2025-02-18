import jwt from "jsonwebtoken";
import userModel from '../models/user.js';

export const verify = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.cookies.user;
        if (!token) {
            return res.status(401).json({ status: false, message: "No token found!!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ status: false, message: "User not found!" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ status: false, message: "Authentication failed!" });
    }
};