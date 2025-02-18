import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    userName: {
        type:String,
        unique: true,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required: true
    },
    role:{
        type: String,
        enum: ["user","owner"],
        default: "user" 
    },
    profilePic:{
        type: String,
        defalut: null
    },
    contactNo:{
        type: String,
    }
})

const userModel = mongoose.model('Auth',userSchema);

export default userModel;