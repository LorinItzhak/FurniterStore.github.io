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
//app.engine('ejs', require('ejs').__express);
app.use(express.static(path.join(__dirname,'public')))//מקשר את הדפי ejs  ל css רק להוסיף לינק לכל אחד מהם
app.get("/",(req,res)=>{
    res.render("login") 
    res.render("login.ejs", { alertMessage: "" });
})

app.get("/signup",(req,res)=>{
    //res.render("signup") 
    res.render("signup.ejs", { alertMessage: "" });
})

app.post("/signup",async(req,res)=>{
    
    const checkk=await collection.findOne({name:req.body.name})
    if(checkk!=null){
        //res.send("name taken")
        let alertMessage = "Username already taken";
        res.render("signup",{alertMessage});
       // res.render("signup.ejs", { alertMessage: "Username already taken" });
       
    }
else if(req.body.name==''||req.body.password==''){
     let alertMessage = "Fill the missing info";
        res.render("signup",{alertMessage});
}
    else{
        const data={
            name:req.body.name,
            password:req.body.password
        };
        try {
            await collection.insertMany([data]);
            let alertMessage = "You have successfully signed up";
            res.render("home", { alertMessage }); // Changed this line
          } catch (error) {
            console.error(error);
            let alertMessage = "Error occurred while signing up";
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
    let alertMessage="you log in sucssfully"
    res.render("home",{alertMessage})
}
else{
    let alertMessage="wrong password"
    res.render("login",{alertMessage})
}
  
  }
  catch{
    let alertMessage="wrong details"
    res.render("login",{alertMessage})
  }
    
    })


app.listen(3000,()=>{
    console.log("port connected")
})