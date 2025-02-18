import express from 'express'
import { login, logout, signUp, resetPassword, forgotPassword, checkAuth } from '../controller/user.controller.js';
import { verify } from '../middleware/verify.js';


const userRoutes = express.Router();

userRoutes.post("/signup",signUp);
userRoutes.post("/login",login);
userRoutes.delete("/logout",verify,logout);
userRoutes.post("/reset-password",verify,resetPassword);
userRoutes.put("/forgot-password/:id",verify,forgotPassword);
userRoutes.get("/check",verify,checkAuth);


export default userRoutes;