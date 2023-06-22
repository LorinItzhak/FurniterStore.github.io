const express=require("express")
const app=express()
const path =require("path")
const ejs=require("ejs")
//const {check,validationResult}=require('express-validator ')
const bodyParser=require('body-parser')
//const { template } = require("handlebars")
//const { request } = require("http")
//const collection =require("./mongodb")
//app.use=(express.static(path.join(__dirname,'views')));
app.use(express.json())
//const urlencodedParser=bodyParser.urlencoded({extended:false})
app.use(express.urlencoded({extended:false}))
app.set("view engine","ejs")
const mongMod = require("./mongodb")
const collection = mongMod.collection
const objectCollection = mongMod.objectCollection
//app.engine('ejs', require('ejs').__express);
app.use(express.static(path.join(__dirname, '../public')))//מקשר את הדפי ejs  ל css רק להוסיף לינק לכל אחד מהם


app.get("/",(req,res)=>{
    res.render("login.ejs", { alertMessage: "" });
})

app.get("/signup",(req,res)=>{
    //res.render("signup") 
    res.render("signup.ejs", { alertMessage: "" });
})
app.get("/home",(req,res)=>{
    //res.render("signup") 
    res.render("home.ejs", { alertMessage: "" });
})

app.post("/signup",async(req,res)=>{
    
    const checkk=await collection.findOne({name:req.body.name})
    if(checkk!=null){
        //res.send("name taken")
        let alertMessage = " Username already taken";
        res.render("home.ejs", { alertMessage: "" });
       // res.render("signup.ejs", { alertMessage: "Username already taken" });
       
    }
else if(req.body.name==''||req.body.password==''){
     let alertMessage = " Fill the missing info";
        res.render("signup",{alertMessage});
}
    else{
        const data={
            name:req.body.name,
            password:req.body.password
        };
        try {
            await collection.insertMany([data]);
            let alertMessage = " You have successfully signed up";
            res.render("home", { alertMessage }); // Changed this line
          } catch (error) {
            console.error(error);
            let alertMessage = " Error occurred while signing up";
            res.render("signup", { alertMessage }); // Changed this line
          }
        
        //await collection.insertMany([data])
        //let alertMessage = "you succsfully sign up";
        //res.render("signup", { alertMessage});
        
    }
    
})


app.post("/login",async(req,res)=>{
    
  try{
    const check=await collection.findOne({name:req.body.name}) 
if(check.password===req.body.password){
    let alertMessage="Hi "+req.body.name
    res.render("home.ejs", { alertMessage});
    
}
else{
    let alertMessage=" wrong password"
    res.render("login",{alertMessage})
}
  
  }
  catch{
    let alertMessage=" wrong details"
    res.render("login",{alertMessage})
  }
    
    })
    
   //OBJECT ADDING************************************************************************************************************** 
   //****************************************************************************************************************************
   //**************************************************************************************************************************** 

app.get("/addObject",(req,res)=>{
res.render("addObject",{alertMessage:""});
console.log("ok")
})
app.post("/addObject",async (req,res)=>{
        console.log("1")
        let isValid = await objectCollection.findOne({category:req.body.category,name:req.body.name})
        if(isValid != null)
        {
            let info = {
                amount:parseInt(isValid.amount)+parseInt(req.body.amount)
            }
            await objectCollections.findOneAndUpdate({category:req.body.category,name:req.body.name},info)
            res.render("home",{alertMessage:""})
        }
        else if(req.body.name==''||req.body.color==''||req.body.matter==''||req.body.amount==''||req.body.pic==''||req.body.price==''||req.body.amount < 0||req.body.price < 0)
        {
            let alertMessage = "wront info"
            res.render("addObject",{alertMessage})
        }
        else
        {
            let info = {
            name:req.body.name,
            color:req.body.color,
            matter:req.body.matter,
            amount:req.body.amount,
            pic:req.body.pic,
            price:req.body.price,
            category:req.body.category
            }
            try{
                await chairCollect.insertMany([info])
                let alertMessage = "hi"
                res.render("home", { alertMessage:"" });
            }
            catch (error) {
            console.error(error);
            let alertMessage = "Error";
            res.render("addObject.ejs", { alertMessage });
            }
        }
    })
    
    /*********************************************************************************************************************************
     * *******************************************************************************************************************************
     * *******************************************************************************************************************************
     */

app.listen(3000,()=>{
    console.log("port connected")
})