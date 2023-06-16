//const { Collection } = require("mongodb");
const mongoose=require("mongoose")

mongoose.connect('mongodb+srv://eliav:2001@collection.tjg4v6e.mongodb.net/?retryWrites=true&w=majority')
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

const collection=new mongoose.model('Collection',LogInSchema)
module.exports=collection