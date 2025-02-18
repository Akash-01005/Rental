import mongoose from "mongoose";

const DB = ()=>{
    mongoose.connect(process.env.DB)
    .then(()=>{
        console.log("DB connected successfully...")
    })
    .catch(err=>console.log(err))
}

export default DB;