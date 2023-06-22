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
const chairCollect = mongMod.chairCollect
//const chairCollect = require("./mongodb")
const bedCollect = require("./mongodb")
const tableCollect = require("./mongodb")
const couchCollect= require("./mongodb")
const mirrorCollect = require("./mongodb")
const rugCollect = require("./mongodb")
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

   //ADD CHAIR
app.get("/addChair",(req,res)=>{
res.render("addChair",{alertMessage:""});
console.log("ok")
})
app.post("/addChair",async (req,res)=>{

    let isValid = await chairCollect.findOne({nameChair:req.body.nameChair})
    if(isValid != null&&req.body.amount >=0 && req.body.price >=0)
    {
        req.body.amount += isValid.body.amount;
    }
    else if(req.body.nameChair==''||req.body.color==''||req.body.matter==''||req.body.amount==''||req.body.pic==''||req.body.price==''||req.body.amount < 0||req.body.price < 0)
    {
        let alertMessage = "wront info"
        res.render("addChair.ejs",{alertMessage})
    }
    else
    {
        let info = {
            nameChair:req.body.nameChair,
            color:req.body.color,
            matter:req.body.matter,
            amount:req.body.amount,
            pic:req.body.pic,
            price:req.body.price
        }
        try{
                await chairCollect.insertMany([info])
                let alertMessage = "hi"
                res.render("home", { alertMessage:"" });
        }
        catch (error) {
            console.error(error);
            let alertMessage = "Error";
            res.render("addChair.ejs", { alertMessage });
        }
    }
})

//ADD BED

app.get("/addBed",(req,res)=>{
    res.render("addBed",{alertMessage:""});
    console.log("ok")
    })
    app.post("/addBed",async (req,res)=>{

        let isValid = await bedCollect.findOne({name:req.body.name})
        if(isValid != null&&req.body.amount >=0 && req.body.price >=0)
        {
            req.body.amount += isValid.body.amount;
        }
        else if(req.body.name==''||req.body.color==''||req.body.matter==''||req.body.amount==''||req.body.pic==''||req.body.price==''||req.body.amout < 0||req.body.price < 0||req.body.size=='')
        {
            let aler = "wront info"
            res.render("addBed.ejs",{aler})
        }
        else
        {
            let info = {
                name:req.body.name,
                color:req.body.color,
                matter:req.body.matter,
                amout:req.body.amount,
                pic:req.body.pic,
                size:req.body.size,
                price:req.body.price
            }
            try{
                    await bedCollect.insertMany([info])
                    let al = "all is done!"
                    res.render("home", { al });
            }
            catch (error) {
                console.error(error);
                let alertMessage = "Error";
                res.render("addBed.ejs", { alertMessage });
            }
        }
    })




    //ADD TABLE
    app.get("/addTable",(req,res)=>{
        res.render("addTable",{alertMessage:""});
        console.log("ok")
        })
        app.post("/addTable",async (req,res)=>{
    
            let isValid = await tableCollect.findOne({name:req.body.name})
            if(isValid != null&&req.body.amount >=0 && req.body.price >=0)
            {
                req.body.amount += isValid.body.amount;
            }
            else if(req.body.name==''||req.body.color==''||req.body.matter==''||req.body.amount==''||req.body.pic==''||req.body.price==''||req.body.amout < 0||req.body.price < 0||req.body.size=='')
            {
                let aler = "wront info"
                res.render("addTable.ejs",{aler})
            }
            else
            {
                let info = {
                    name:req.body.name,
                    color:req.body.color,
                    matter:req.body.matter,
                    amout:req.body.amount,
                    pic:req.body.pic,
                    size:req.body.size,
                    price:req.body.price
                }
                try{
                        await tableCollect.insertMany([info])
                        let al = "all is done!"
                        res.render("home", { al });
                }
                catch (error) {
                    console.error(error);
                    let alertMessage = "Error";
                    res.render("addTable.ejs", { alertMessage });
                }
            }
        })




        //ADD COUCH

        app.get("/addCouch",(req,res)=>{
            res.render("addCouch",{alertMessage:""});
            console.log("ok")
            })
            app.post("/addCouch",async (req,res)=>{
        
                let isValid = await couchCollect.findOne({name:req.body.name})
                if(isValid != null&&req.body.amount >=0 && req.body.price >=0)
                {
                    req.body.amount += isValid.body.amount;
                }
                else if(req.body.name==''||req.body.color==''||req.body.matter==''||req.body.amount==''||req.body.pic==''||req.body.price==''||req.body.amout < 0||req.body.price < 0||req.body.size=='')
                {
                    let aler = "wront info"
                    res.render("addCouch.ejs",{aler})
                }
                else
                {
                    let info = {
                        name:req.body.name,
                        color:req.body.color,
                        matter:req.body.matter,
                        amout:req.body.amount,
                        pic:req.body.pic,
                        size:req.body.size,
                        price:req.body.price
                    }
                    try{
                            await couchCollect.insertMany([info])
                            let al = "all is done!"
                            res.render("home", { al });
                    }
                    catch (error) {
                        console.error(error);
                        let alertMessage = "Error";
                        res.render("addCouch.ejs", { alertMessage });
                    }
                }
            })


            //ADD MIRROR

            app.get("/addMirror",(req,res)=>{
                res.render("addMirror",{alertMessage:""});
                console.log("ok")
                })
                app.post("/addMirror",async (req,res)=>{
            
                    let isValid = await mirrorCollect.findOne({name:req.body.name})
                    if(isValid != null&&req.body.amount >=0 && req.body.price >=0)
                    {
                        req.body.amount += isValid.body.amount;
                    }
                    else if(req.body.name==''||req.body.color==''||req.body.amount==''||req.body.pic==''||req.body.price==''||req.body.amout < 0||req.body.price < 0||req.body.size=='')
                    {
                        let aler = "wront info"
                        res.render("addMirror.ejs",{aler})
                    }
                    else
                    {
                        let info = {
                            name:req.body.name,
                            color:req.body.color,
                            amout:req.body.amount,
                            pic:req.body.pic,
                            size:req.body.size,
                            price:req.body.price
                        }
                        try{
                                await mirrorCollect.insertMany([info])
                                let al = "all is done!"
                                res.render("home", { al });
                        }
                        catch (error) {
                            console.error(error);
                            let alertMessage = "Error";
                            res.render("addMirror.ejs", { alertMessage });
                        }
                    }
                })


                //ADD RUG
                app.get("/addRug",(req,res)=>{
                    res.render("addRug",{alertMessage:""});
                    console.log("ok")
                    })
                    app.post("/addRug",async (req,res)=>{
                
                        let isValid = await rugCollect.findOne({name:req.body.name})
                        if(isValid != null&&req.body.amount >=0 && req.body.price >=0)
                        {
                            req.body.amount += isValid.body.amount;
                        }
                        else if(req.body.name==''||req.body.color==''||req.body.amount==''||req.body.pic==''||req.body.price==''||req.body.amout < 0||req.body.price < 0||req.body.size=='')
                        {
                            let aler = "wront info"
                            res.render("addRug.ejs",{aler})
                        }
                        else
                        {
                            let info = {
                                name:req.body.name,
                                color:req.body.color,
                                amout:req.body.amount,
                                pic:req.body.pic,
                                size:req.body.size,
                                price:req.body.price
                            }
                            try{
                                    await rugCollect.insertMany([info])
                                    let al = "all is done!"
                                    res.render("home", { al });
                            }
                            catch (error) {
                                console.error(error);
                                let alertMessage = "Error";
                                res.render("addRug.ejs", { alertMessage });
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