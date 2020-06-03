//jshint esversion:6
const express= require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
const encrypt=require("mongoose-encryption");

const app= express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true, useUnifiedTopology:true});

const userSchema=new mongoose.Schema ({
    email:String,
    password:String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.route("/")

    .get(function(req,res){
        res.render("home");
    });

app.route("/login")

    .get(function (req, res) {
        res.render("login");
    })

    .post(function(req,res){
        const username=req.body.username;
        const password = req.body.password;

        User.findOne({email:username},function(err,founduser){
            if(err){
               console.log(err);
            } else{
                if(founduser){
                     if (founduser.password === password) {
                         res.render("secrets");
                     }
                };
            };
        });

    });

app.route("/register")

    .get(function (req, res) {
        res.render("register");
    })

    .post(function(req,res){
        const newUser = new User({
            email:req.body.username,
            password:req.body.password
        });
        
        newUser.save(function(err){
            if(!err){
                res.render("secrets");
            } else{
                res.render(err);
            }

        });

    });


app.listen(3000,function(){
    console.log("Server running on port 3000.");
    
});

