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
var currUser=0
var loggedIn=true
let alertMessage=""
const mongMod = require("./mongodb")
const collection = mongMod.collection
const objectCollection = mongMod.objectCollection
//app.engine('ejs', require('ejs').__express);
app.use(express.static(path.join(__dirname, '../public')))//מקשר את הדפי ejs  ל css רק להוסיף לינק לכל אחד מהם


app.get("/",(req,res)=>{
    
    res.render("home.ejs", { alertMessage,loggedIn: currUser !== 0 });
})

app.get("/signup",(req,res)=>{
    //res.render("signup") 
    res.render("signup.ejs", { alertMessage: "" ,loggedIn: currUser !== 0});
})
app.get("/login",(req,res)=>{
    
    res.render("login.ejs", { alertMessage: "",loggedIn: currUser !== 0});
})


app.post("/signup",async(req,res)=>{
    
    const checkk=await collection.findOne({name:req.body.name})
    if(checkk!=null){
        //res.send("name taken")
        let alertMessage = " Username already taken";
        res.render("signup.ejs", { alertMessage ,loggedIn: currUser !== 0});
       // res.render("signup.ejs", { alertMessage: "Username already taken" });
    }
else if(req.body.name==''||req.body.password==''){
     let alertMessage = " Fill the missing info";
        res.render("signup",{alertMessage,loggedIn: currUser !== 0});
}
    else{
        const data={
            name:req.body.name,
            password:req.body.password,
            admin:false
        };
        try {
            currUser = await collection.insertMany([data]);
            let alertMessage = "Hi "+req.body.name;
            res.render("home", { alertMessage ,loggedIn:currUser!==0}); // Changed this line
          } catch (error) {
            console.error(error);
            let alertMessage = " Error occurred while signing up";
            res.render("signup", { alertMessage,loggedIn: currUser !== 0 }); // Changed this line
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
    if(check.admin == true)
    {
        currUser = check
        res.render("adminHome",{alertMessage,loggedIn: currUser !== 0})
    }
    else{
        currUser = check
        res.render("home.ejs", { alertMessage,loggedIn: currUser !== 0});
    }
}
else{
    let alertMessage=" wrong password"
    res.render("login",{alertMessage,loggedIn: currUser !== 0})
}
  
  }
  catch{
    let alertMessage=" wrong details"
    res.render("login",{alertMessage,loggedIn: currUser !== 0})
  }
    
    })
    
   //**************************************************************************************************************************** 
   //****************************************************************************************************************************
   //**************************************************************************************************************************** 
   function openSearch() {
    document.getElementById("myOverlay").style.display = "block";
  }
  
  function closeSearch() {
    document.getElementById("myOverlay").style.display = "none";
  }
   //ADD OBJECT
app.get("/addObject",(req,res)=>{
res.render("addObject",{alertMessage:""});
console.log("ok")
})
app.post("/addObject",async (req,res)=>{
        if(currUser.admin == true)
        {
        console.log("1")
        let isValid = await objectCollection.findOne({category:req.body.category,name:req.body.name})
        if(isValid != null)
        {
            let info = {
                amount:parseInt(isValid.amount)+parseInt(req.body.amount)
            }
            await objectCollection.findOneAndUpdate({category:req.body.category,name:req.body.name},info)
            res.render("home",{alertMessage:""})
        }
        else if(req.body.name==''||req.body.color==''||req.body.matter==''||req.body.amount==''||req.body.pic==''||req.body.price==''||req.body.amount < 0||req.body.price < 0)
        {
            let alertMessage = "wrong info"
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
                await objectCollection.insertMany([info])
                let alertMessage = "hi"
                res.render("home", { alertMessage:"" });
            }
            catch (error) {
            console.error(error);
            let alertMessage = "Error";
            res.render("addObject.ejs", { alertMessage });
            }
        }
    }
    else{
        res.render("home",{alertMessage:"user is not admin"})
    }
    })

    //DELETE OBJECT
    app.get("/deleteObject",(req,res)=>{
        res.render("deleteObject",{alertMessage:""});
    })
    app.post("/deleteObject",async (req,res)=>{
        if(currUser.admin == true){
            let isValid = await objectCollection.findOne({category:req.body.category,name:req.body.name})
            if(isValid != null)
            {
                let info = {
                    category:req.body.category,
                    name:req.body.name
                }
                await objectCollection.findOneAndDelete({category:req.body.category,name:req.body.name},info)
                res.render("home",{alertMessage:"done"})
            }
            else{
                let alertMessage = "wrong info"
                res.render("home",{alertMessage})
            }
        }
        else{
            res.render("home",{alertMessage:"user is not admin"})
        }
    })


    //SHOW OBJECT TO SCREEN
    
    app.get('/chairs', async (req, res) => {
        // Query for the data from MongoDB
        const data = await objectCollection.find({"category":"chair","amount": { $gte: 1}}); 
        res.render('chairs', { details: data }); 
    });
    app.get('/bed', async (req, res) => {
        // Query for the data from MongoDB
        const data = await objectCollection.find({"category":"bed","amount": { $gte: 1}}); 
        res.render('bed', { details: data }); 
    });
    app.get('/couch', async (req, res) => {
        // Query for the data from MongoDB
        const data = await objectCollection.find({"category":"couch","amount": { $gte: 1}}); 
        res.render('couch', { details: data }); 
    });
    app.get('/mirror', async (req, res) => {
        // Query for the data from MongoDB
        const data = await objectCollection.find({"category":"mirror","amount": { $gte: 1}}); 
        res.render('mirror', { details: data }); 
    });
    app.get('/rug', async (req, res) => {
        // Query for the data from MongoDB
        const data = await objectCollection.find({"category":"rug","amount": { $gte: 1}}); 
        res.render('rug', { details: data }); 
    });
    app.get('/table', async (req, res) => {
        // Query for the data from MongoDB
        const data = await objectCollection.find({"category":"table","amount": { $gte: 1}}); 
        res.render('table', { details: data }); 
    });
   
   
    app.post('/logout', (req, res) => {
        if (currUser !== 0) {
            currUser = 0;
            console.log('User logged out');
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'You were not logged in' });
        }
    });

    app.get("/search",(req,res)=>{
        res.render("search.ejs")
    })
    app.post('/search',async(req,res)=>{
        var infor=""
        if(req.body.chair)
        {
            infor = await objectCollection.find({"category":"chair" ,"price": { $gte: req.body.min, $lte: req.body.max }
        })
            
        }
        if(req.body.arm){
            infor =infor + await objectCollection.find({"category":"armchair", "price": { $gte: req.body.min, $lte: req.body.max }})
        }
        if(req.body.table)
        {
            infor =infor+ ',' + await objectCollection.find({"category":"table", "price": { $gte: req.body.min, $lte: req.body.max }})
        }
        if(req.body.sofa)
        {
            infor =infor + await objectCollection.find({"category":"couch","price": { $gte: req.body.min, $lte: req.body.max }})
        }
        if(req.body.accs)
        {
            infor =infor+ ',' + await objectCollection.find({"category":"mirror","price": { $gte: req.body.min, $lte: req.body.max }})
        }
        if(req.body.bed){
            infor =infor+ ',' + await objectCollection.find({"category":"bed","price": { $gte: req.body.min, $lte: req.body.max }})
        }
        //res.render({infor:infor})
        res.json({infor})
    })
   

    /*********************************************************************************************************************************
     * *******************************************************************************************************************************
     * *******************************************************************************************************************************
     */

app.listen(3000,()=>{
    console.log("port connected")
})


