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
const purchaseCollection=mongMod.purchaseCollection
//app.engine('ejs', require('ejs').__express);
app.listen(3000,()=>{
    console.log("port connected")
})
app.use(express.static(path.join(__dirname, '../public')))//מקשר את הדפי ejs  ל css רק להוסיף לינק לכל אחד מהם
const session = require('express-session')
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: true,
  store:require('connect-mongo').create({mongoUrl:"mongodb+srv://eliav:2001@ourshop.vtknxmb.mongodb.net/?retryWrites=true&w=majority"})
  /*store: new MongoStore({
    url:"mongodb+srv://eliav:2001@ourshop.vtknxmb.mongodb.net/?retryWrites=true&w=majority",
    ttl:12*24*60*60,
    autoRemove:'native'
  })*/
}));

app.get("/",(req,res)=>{
    
    res.render("home.ejs", { alertMessage,loggedIn: req.session.user !== undefined });
})

app.get("/ContactUs",(req,res)=>{
    res.render("ContactUs",{alertMessage:" "})
})

app.get("/aboutus",(req,res)=>{
    res.render("aboutus")
})

app.get("/signup",(req,res)=>{
    //res.render("signup") 
    res.render("signup.ejs", { alertMessage: "" ,loggedIn: req.session.user !== undefined});
})
app.get("/login",(req,res)=>{
    
    res.render("login.ejs", { alertMessage: "",loggedIn: req.session.user !== undefined});
})


app.post("/signup",async(req,res)=>{
    
    const checkk=await collection.findOne({name:req.body.name})
    if(checkk!=null){
        //res.send("name taken")
        let alertMessage = " Username already taken";
        res.render("signup.ejs", { alertMessage ,loggedIn: req.session.user !== undefined});
       // res.render("signup.ejs", { alertMessage: "Username already taken" });
    }
else if(req.body.name==''||req.body.password==''){
     let alertMessage = " Fill the missing info";
        res.render("signup",{alertMessage,loggedIn: req.session.user !== undefined});
}
    else{
        const data={
            name:req.body.name,
            password:req.body.password,
            admin:false
        };
        try {
            req.session.user = await collection.insertMany([data]);
            loggedIn=true
            let alertMessage = "Hi "+req.body.name;
            res.render("home", { alertMessage ,loggedIn:req.session.user!==undefined}); // Changed this line
          } catch (error) {
            console.error(error);
            let alertMessage = " Error occurred while signing up";
            res.render("signup", { alertMessage,loggedIn: req.session.user !== undefined }); // Changed this line
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
        req.session.user = check
        loggedIn = true
        res.render("adminHome",{alertMessage,loggedIn})
    }
    else{
        req.session.user = check
        loggedIn=true
        res.render("home.ejs", { alertMessage,loggedIn});
    }
}
else{
    let alertMessage=" wrong password"
    res.render("login",{alertMessage,loggedIn: false})
}
  
  }
  catch{
    let alertMessage=" wrong details"
    res.render("login",{alertMessage,loggedIn: req.session.user !== undefined})
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
        if(req.session.user.admin == true)
        {
        console.log("1")
        let isValid = await objectCollection.findOne({category:req.body.category,name:req.body.name})
        if(isValid != null)
        {
            let info = {
                amount:parseInt(isValid.amount)+parseInt(req.body.amount)
            }
            await objectCollection.findOneAndUpdate({category:req.body.category,name:req.body.name},info)
            res.render("adminHome",{alertMessage:""})
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
                res.render("adminHome", { alertMessage:"" });
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
        if(req.session.user.admin == true){
            let isValid = await objectCollection.findOne({category:req.body.category,name:req.body.name})
            if(isValid != null)
            {
                let info = {
                    category:req.body.category,
                    name:req.body.name
                }
                await objectCollection.findOneAndDelete({category:req.body.category,name:req.body.name},info)
                res.render("adminHome",{alertMessage:"done"})
            }
            else{
                let alertMessage = "wrong info"
                res.render("adminHome",{alertMessage})
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
    app.get('/armchairs', async (req, res) => {
        // Query for the data from MongoDB
        const data = await objectCollection.find({"category":"armchair","amount": { $gte: 1}}); 
        res.render('armchairs', { details: data }); 
    });
   
   
    app.post('/logout', (req, res) => {
        if (req.session) {
            req.session.destroy()
            loggedIn=false
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
        var infor=[]
        var chairInfo=''
        var armInfo=''
        var tableInfo=''
        var sofaInfo=''
        var accsInfo=''
        var bedInfo=''
       if(await objectCollection.findOne({name:req.body.name}))
        {
            infor.push(await objectCollection.findOne({name:req.body.name}))
        }
        if(req.body.chair == "on")
        {
            chairInfo = await objectCollection.find({"category":"chair" ,"price": { $gte: req.body.min, $lte: req.body.max },"amount": { $gte: 1}})
            infor.push((chairInfo))
        }
            
        if(req.body.arm == "on"){
            armInfo = await objectCollection.find({"category":"armchair", "price": { $gte: req.body.min, $lte: req.body.max },"amount": { $gte: 1}})
            infor.push((armInfo))
        }
        if(req.body.table == "on")
        {
            tableInfo = await objectCollection.find({"category":"table", "price": { $gte: req.body.min, $lte: req.body.max },"amount": { $gte: 1}})
            infor.push((tableInfo))
        }
        if(req.body.sofa == "on")
        {
            sofaInfo =await objectCollection.find({"category":"couch","price": { $gte: req.body.min, $lte: req.body.max },"amount": { $gte: 1}})
            infor.push((sofaInfo))
        }
        if(req.body.accs== "on")
        {
            accsInfo = await objectCollection.find({"category":"mirror","price": { $gte: req.body.min, $lte: req.body.max },"amount": { $gte: 1}})
            infor.push((accsInfo))
        }
        if(req.body.bed == "on"){
            bedInfo = await objectCollection.find({"category":"bed","price": { $gte: req.body.min, $lte: req.body.max },"amount": { $gte: 1}})
            infor.push((bedInfo))
        }
        console.log(infor)
        res.render("search",{infor})
       // res.json({infor})
    })
   ///////////////////////// MyAccount

   app.get("/myAccount", async (req, res) => {
    if (req.session.user !== undefined) {
      res.render("myAccount", { loggedIn:true, user:req.session.user });
    } else {
      res.redirect("/login");
    }
  });
  
  // Route handler for changing password
  app.get("/changePassword", (req, res) => {
    res.render("changePassword",{loggedIn:true});
  });
  
app.post("/changePassword", async(req, res) => {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    if (currentPassword !== req.session.user.password) {
      res.render("changePassword", { loggedIn:true,message: "Incorrect current password" });
    } else if (newPassword !== confirmPassword) {
      res.render("changePassword", { loggedIn:true,message: "New password and confirmation do not match" });
    } else {
      // Update the user's password in the database
      let isValidd = await collection.findOne({name:req.session.user.name})
      if(isValidd != null)
      {
          let infoo = {
              password:newPassword
            }
           
          await collection.findOneAndUpdate({name:req.session.user.name},infoo)
      res.render("changePassword", { loggedIn:true,message: "Password changed successfully" });
    }
    else{
        res.render("changePassword", { loggedIn:true,message: "failed" });
    }
    }
  });

  app.get("/accountInformation", (req, res) => {
    // Retrieve account information for the current user from the database
    // Render the accountInformation.ejs template with the account information data
    res.render("accountInformation", {loggedIn:true ,alertMessage:"",user:req.session.user });
  });
  app.get("/OrderHistory",async(req,res)=>{
    let acc = await purchaseCollection.find({"name":req.session.user.name})
    res.render("OrderHistory",{alertMessage:"hi",details:acc,loggedIn:true,user:req.session.user})
  })

  app.get("/addCart",(req,res)=>{
    render("home",{alertMessage:""})
})
app.post("/addCart",async (req,res)=>{
if(loggedIn){
    console.log(req.body.name)
    let d = await collection.findOne({name:req.session.user.name})
    let flag = 1
    let i =0;
    if(d.cart==undefined)
    {
        d.cart={}
        d.cart.totalSize = 0
        d.cart.totalPrice = 0
        d.cart.objs = []
        
    } 
    if(d.cart.totalSize == 0)
    {
        d.cart.totalSize = 1
        d.cart.totalPrice = parseInt(req.body.price)
        let inf={
            name:req.body.name,
            category:req.body.category,
            price:req.body.price,
            pic:req.body.pic,
            amount:1,
            color:req.body.color,
            matter:req.body.matter
        }
        d.cart.objs.push(inf)

        await d.save()
        console.log(d)
    }
    else
    {
        d.cart.objs.forEach(function(item) {
            if(item.name == req.body.name){
                flag = 0
                item.amount+=parseInt(req.body.amount)
            }
        });
        if(flag){
            d.cart.totalSize += 1
            d.cart.totalPrice += parseInt(req.body.price)
            let inf={
               name:req.body.name,
               category:req.body.category,
               price:req.body.price,
               pic:req.body.pic,
               amount:req.body.amount,
               color:req.body.color,
               matter:req.body.matter
            }
            d.cart.objs.push(inf)
            
        }
        await d.save();
        console.log(d.cart.objs)
    }
    }
    else
    {
        res.render("home",{alertMessage:"user not logged in"})
    }
})

app.get("/Mybag",async (req,res)=>{
    if(req.session.user!== undefined){
        let r = await collection.findOne({name:req.session.user.name})
        res.render("Mybag", {alertMessage:"hi",details:[r.cart.objs],num:req.session.user.cart.totalSize,price:req.session.user.cart.totalPrice});
    }
    else{
        res.redirect("/login")
    }
})
app.get("/deleteItem",async (req,res)=>{
    let r = await collection.findOne({name:req.session.user.name})
    res.render("Mybag",{alertMessage:"hi",details:[r.cart.objs],num:req.session.user.cart.totalSize,price:req.session.user.cart.totalPrice})
})
app.post("/deleteItem",async (req,res)=>{
    console.log(1)
    console.log(req.session.user.cart.objs)
    let p = await collection.findOne({name:req.session.user.name})
    var delItem = await objectCollection.findOne({name:req.body.name})
    console.log(delItem)
    //console.log(p.cart)
    if(p)
    {
        p.cart.totalPrice -= parseInt(delItem.price)
        p.cart.totalSize -= 1
        filteredArr=p.cart.objs.filter(item => item.name !== delItem.name)
        p.cart.objs = filteredArr
        console.log(p.cart.objs)
        await p.save()
        res.render("Mybag",{alertMessage:"hi",details:[p.cart.objs],num:p.cart.totalPrice,price:p.cart.totalPrice})
    }
    
})

app.get('/checkout',async (req,res)=>{
    let r = await collection.findOne({name:req.session.user.name})
    res.render("checkout",{details:[r.cart.objs],size:req.session.user.cart.totalSize,price:req.session.user.cart.totalPrice});
})
app.get("/deleteItemC",async (req,res)=>{
    let r = await collection.findOne({name:req.session.user.name})
    res.render("checkout",{details:[r.cart.objs],size:req.session.user.cart.totalSize,price:req.session.user.cart.totalPrice});
})
app.post("/deleteItemC",async (req,res)=>{
    console.log(1)
    let p = await collection.findOne({name:req.session.user.name})
    var delItem = await objectCollection.findOne({name:req.body.name})
    console.log(delItem)
    //console.log(p.cart)
    if(p)
    {
        p.cart.totalPrice -= parseInt(delItem.price)
        p.cart.totalSize -= 1
        filteredArr=p.cart.objs.filter(item => item.name !== delItem.name)
        p.cart.objs = filteredArr
        console.log(p.cart.objs)
        await p.save()
        res.render("checkout",{details:[p.cart.objs],num:p.cart.totalPrice,price:p.cart.totalPrice})
    }
    
})
app.get('/buy',async (req,res)=>{
    let acc = await collection.findOne({name:req.session.user.name})
    const today = new Date();
    const options = { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Jerusalem',
        timeZoneName: 'short'
    }
    
    var f={
        purHis:acc.cart.objs,
        name:req.session.user.name,
        date:today.toLocaleDateString('en-GB',options)
    }
    var v = await purchaseCollection.insertMany([f])
    acc.cart.objs.forEach(async function(item){
        let d = await objectCollection.findOne({name:item.name})
        if(parseInt(req.body.amount) > d.amount){
            res.render("home",{alertMessage:"error"})
            exit(0)
        }
        else{
            d.amount -= parseInt(req.body.amount)
            await d.save();
        }
    })
    acc.cart={}
    await acc.save()
    res.render("home",{alertMessage:"purchased"});
})


    /*********************************************************************************************************************************
     * *******************************************************************************************************************************
     * *******************************************************************************************************************************
     */



