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

const object = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    matter:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    pic:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    }
})

const mirror = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    pic:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    }
})

const rug = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    pic:{
        type:String,
        required:true
    }
})


const collection=new mongoose.model("users",LogInSchema)
const objectCollection = new mongoose.model("objects",object)
module.exports={
    collection,objectCollection
}
>>>>>>> parent of 123e482 (updated server to insert and amount)
