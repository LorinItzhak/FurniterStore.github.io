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
    category:{
        type:String,
        //enum:['chair','bed','couch','mirror','rug','table'],
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

const couch = new mongoose.Schema({
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

/*const rugCollect = new mongoose.model("rrugs",rug)
module.exports = rugCollect

const mirrorCollect = new mongoose.model("mmirrors",mirror)
module.exports=mirrorCollect

const couchCollect = new mongoose.model("ccouchs",couch)
module.exports=couchCollect

const tableCollect = new mongoose.model("ttables",table)
module.exports=tableCollect

const bedCollect = new mongoose.model("bbeds",bed)
module.exports=bedCollect

const chairCollect = new mongoose.model("cchairs",chair)
module.exports=chairCollect

const collection=new mongoose.model("users",LogInSchema)
module.exports=collection*/
const chairCollect = new mongoose.model("chairs",chair)
const collection=new mongoose.model("users",LogInSchema)
module.exports = {
    collection,chairCollect
}


