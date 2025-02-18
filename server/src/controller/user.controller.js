import bcrypt from 'bcrypt';
import userModel from '../models/user.js';
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";
import { uploadImage, deleteImage, updateImage } from '../libs/cloudinary.js';


export const signUp = async(req,res)=>{
    try{
        const { userName, email, password } = req.body;
        const check = await userModel.findOne({userName: userName});
        if(check==null){
            const hashPassword = await bcrypt.hash(password,10);
            const newUser = {userName, email, password: hashPassword};
            await userModel.create(newUser);
            return res.status(200).json({status: true, message: "User Created!"});
        }else{
            return res.status(401).json({status: false, message: "User Already Exists!!"});
        }
   }catch(error){
        return res.status(500).json({status: false, message: "Internal Server Error!!"});
   }
}

export const login = async(req,res)=>{
    try {
        const { email, password } = req.body;
        const check = await userModel.findOne({email: email});
        if(check!=null){
            const comparePassword = await bcrypt.compare(password,check.password); 
            if(comparePassword){
                const token = jwt.sign({id: check._id}, process.env.JWT_SECRET_KEY);
                res.cookie('token', token, {maxAge: 24*60*60*3600, httpOnly: true});
                return res.status(200).json({status: true, message: "Authorized User!",user:check});
            }
            return res.status(401).json({status: false, message: "Wrong Password!!"});
        }
        return res.status(404).json({status: false, message: "User Not found!!"});
    } catch (error) {
        return res.status(500).json({status: false, message: "Internal Server Error!!"});
    }
}

export const resetPassword = async(req,res)=>{
    try {
       const { email } =  req.body;
       const check  = await userModel.findOne({email: email});
       const forgotToken = jwt.sign({id: check._id}, process.env.JWT_SECRET_KEY, {expiresIn: "15m"});
       res.cookie('forgotToken', forgotToken, {maxAge: 15 * 60 * 1000, httpOnly: true});
       if(check!=null){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
            }
          });
          
          var mailOptions = {
            from: process.env.EMAIL,
            to: check.email,
            subject: 'Password Reset Link:',
            text: `http://localhost:5173/forgot-password/${forgotToken}  note: this link will expire in 15 minutes`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          return res.status(200).json({status: true, message: "Email Sent Successfully!!", user_id: check._id});
       }
       return res.status(404).json({status: false, message: "Invalid User Details!!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: "Internal Server Error!!"});
    }  
}

export const forgotPassword = async(req,res)=>{
    try {
        const token = req.params.id;
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const check = await userModel.findOne({_id: decode.id});
        if(check!=null){
            const { password } = req.body;
            const hashPassword = await bcrypt.hash(password,10);
            await userModel.findByIdAndUpdate({_id: check._id},{password: hashPassword});
            res.clearCookie('forgotToken');
            return res.status(200).json({status: true, message: "Password Updated Successfully!!"});
        }
        return res.status(404).json({status: false, message: "Invalid User Details!!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: "Internal Server Error!!"});
    }
}

export const checkAuth = (req,res)=>{
    try {
        return res.status(200).json({status: true, message: "Authenticated User!"});
    } catch (error) {
        return res.status(500).json({status: false, message: "Internal Server Error!!"});
    }
}

export const logout =(req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({status: true, message: "User logged Out Successfully!"});
}

export const updateProfile = async (req, res) => {
  try {
    const { userName, contactNo, profilePic } = req.body;
    const userId = req.user._id;

    // Get current user to check if profile pic needs updating
    const currentUser = await userModel.findById(userId);
    
    let updatedProfilePic = profilePic;

    // If there's a new profile pic and an old one exists, update it
    if (profilePic && currentUser.profilePic && profilePic !== currentUser.profilePic) {
      const oldPublicId = currentUser.profilePic.split('/').pop().split('.')[0];
      await deleteImage(oldPublicId);
      updatedProfilePic = profilePic;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { 
        userName,
        contactNo,
        profilePic: updatedProfilePic
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const result = await uploadImage(req.file);
    
    // Update user's profile picture in database
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.url },
      { new: true }
    ).select('-password');

    res.status(200).json({ 
      imageUrl: result.url,
      user: updatedUser
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};