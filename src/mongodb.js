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

const chair = new mongoose.Schema({
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
    }
})

const bed = new mongoose.Schema({
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

const table = new mongoose.Schema({
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

const tableCollect = new mongoose.model("table",table)
module.exports=tableCollect

const bedCollect = new mongoose.model("bed",bed)
module.exports=bedCollect


const chairCollect = new mongoose.model("chair",chair)
module.exports=chairCollect

const collection=new mongoose.model("users",LogInSchema)
module.exports=collection