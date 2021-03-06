//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const _ = require('lodash');

const app = express();

app.set("view engine", 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded(
    {extended:true}
))

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
    email : String,
    password: String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

const User = mongoose.model("User", userSchema);



app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register", (req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(err=>{
        if (!err){
            res.render("secrets");
        } else {
            console.log(err);
        }
    });
    
})

app.post("/login",(req,res)=>{
    User.findOne({email:req.body.email},(err,userList)=>{
        if(userList){
            console.log('Exists');
            if(userList.password === req.body.password){
                res.render('secrets');
            } else {console.log('Wrong password')}
        }
        else{
            console.log("User doesn't exists");
        }
    })
})

app.listen(3000,()=>{
    console.log('server started.')
})