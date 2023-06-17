const express=require("express")
const app=express()
const path =require("path")
//const ejs=require("ejs")
//const { template } = require("handlebars")
//const { request } = require("http")
const collection =require("./mongodb")
//const viewsPath=path.join(__dirname,"../views")
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set("view engine","ejs")
app.get("/",(req,res)=>{
    res.render("login.ejs") 
})

app.get("/signup",(req,res)=>{
    res.render("signup.ejs") 
})

app.post("/signup",async(req,res)=>{
const data={
    name:req.body.name,
    password:req.body.password
}
await collection.insertMany([data])

res.render("home")
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