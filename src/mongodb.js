//const { Collection } = require("mongodb");
const mongoose=require("mongoose")

//mongoose.connect("mongodb://0.0.0.0:27017/OurShop")
mongoose.connect("mongodb+srv://eliav:2001@ourshop.vtknxmb.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log('mongoose connected');
    
})
.catch(()=>{
    console.log('failed');
})

const LogInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model("users",LogInSchema)
module.exports=collection