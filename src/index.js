const express=require("express")
const app=express()
const path =require("path")
const ejs=require("ejs")
//const {check,validationResult}=require('express-validator ')
const bodyParser=require('body-parser')
//const { template } = require("handlebars")
//const { request } = require("http")
const collection =require("./mongodb")
//app.set=('views',path.join(__dirname,"../views"))
app.use(express.json())
//const urlencodedParser=bodyParser.urlencoded({extended:false})
app.use(express.urlencoded({extended:false}))
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,'public')))//מקשר את הדפי ejs  ל css רק להוסיף לינק לכל אחד מהם
app.get("/",(req,res)=>{
    res.render("login") 
})

app.get("/signup",(req,res)=>{
    res.render("signup") 
})

app.post("/signup",async(req,res)=>{
    
    const checkk=await collection.findOne({name:req.body.name})
    if(checkk!=null){
        res.send("name taken")
       // res.render("signup.ejs", { alertMessage: "Username already taken" });
    }

    else{
        const data={
            name:req.body.name,
            password:req.body.password
        }
        
        await collection.insertMany([data])
        
        res.render("home")
    }
    
})


app.post("/login",async(req,res)=>{
    
  try{
    const check=await collection.findOne({name:req.body.name}) 
if(check.password===req.body.password){
    res.render("home")
}
else{
    res.send("wrong password")
}
  
  }
  catch{
    res.send("wrong details")
  }
    
    })


app.listen(3000,()=>{
    console.log("port connected")
})