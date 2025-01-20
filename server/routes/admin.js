const express = require('express');
const fs = require('fs')

const router = express.Router();
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const User = require('../models/User')
const Bien = require('../models/Bien')
const Document = require('../models/Document')
const Exchange = require('../models/Exchange')

const adminLayout = "../views/layouts/admin"


// router.use((req, res, next)=>{
//     if (typeof req.session.loginAdmin === 'undefined') {
//         req.session.loginAdmin = false;
//     }

//     console.log("router.use middleware fired")
// })



router.get('/admin', async(req, res)=>{ 
 
    console.log(req.session.loginAdmin)

    var locals = {
        title:"Admin login",
    }
  
    if(!req.session.loginAdmin){
      
        res.render('admin/login', {locals, 
            page:'login',
            // login:req.session.login ? req.session.loginAdmin : false, 
            
            layout:adminLayout
        })
    }
    else{
       
        res.redirect('/admin/dashboard')
    }
    

})


router.post('/login-admin', (req, res)=>{
    console.log(req.body.username, req.body.password)

    if(req.body.username == "eric-admin" && req.body.password == "test123"){

        req.session.loginAdmin = true;
        res.json({done:true})


    }else{
        res.json({done:false})

    }
})



router.get('/admin/dashboard', (req, res)=>{
    var locals = {
        title:"Admin login",
    }

    if(req.session.loginAdmin){
        res.render('admin/dashboard', {locals, 
            page:'',
            loginAdmin:true,            
            layout:adminLayout
        })
    }

    else{
        res.redirect('/admin')
    }
})

router.get('/admin/users', (req, res)=>{
    var locals = {
        title:"Admin login",
    }

    if(req.session.loginAdmin){
        res.render('admin/users', {locals, 
            page:'',
            loginAdmin:true,            
            layout:adminLayout
        })
    }

    else{
        res.redirect('/admin')
    }
})

router.post('/get-users-confirmation', async(req, res)=>{
    var users;

    if(req.body.confirmation == "nconfirmed"){
        users = await User.find({confirme:0})
        
    }
    else{
        users = await User.find({confirme:1})
    }

    res.json({users})
    
})


router.post('/get-user-name', async(req, res)=>{
    var name = req.body.name;

    const users = await User.find({
        $or: [
            { firstname: { $regex: name, $options: 'i' } },
            { lastname: { $regex: name, $options: 'i' } },
            { email: { $regex: name, $options: 'i' } }
        ]
    });

    res.json({users})
})


router.post("/accept-user", async(req, res)=>{
    await User.findByIdAndUpdate(req.body.id, {confirme:1})
    res.json({done:true})
})


router.post("/refuse-user", async(req, res)=>{
    await User.findByIdAndDelete(req.body.id)
    res.json({done:true})
})





router.get('/admin/users/detail', async(req, res)=>{
    var id = req.query.id;
    var user = await User.findById(id)
    var locals = {
        title:"Admin login",
    }

    if(req.session.loginAdmin){
        res.render('admin/detail-user', {locals, 
            page:'',
            loginAdmin:true,            
            layout:adminLayout,
            id, user
        })
    }

    else{
        res.redirect('/admin')
    }
})



router.get('/admin/demandes', async(req, res)=>{
  
    var locals = {
        title:"Admin Demande",
    }

    if(req.session.loginAdmin){
        var exchanges = await Exchange.find({confirmation_receveur:1}).sort({createdAt:-1})
        res.render('admin/demandes', {locals, 
            page:'',
            loginAdmin:true,            
            layout:adminLayout,
            exchanges
        })
    }

    else{
        res.redirect('/admin')
    }
})











router.get('/admin/biens', (req, res)=>{
    var locals = {
        title:"Admin Bien",
    }

    if(req.session.loginAdmin){
        res.render('admin/biens', {locals, 
            page:'',
            loginAdmin:true,            
            layout:adminLayout
        })
    }

    else{
        res.redirect('/admin')
    }
})

router.post('/get-biens-confirmation', async(req, res)=>{
    var biens;

    if(req.body.confirmation == "nconfirmed"){
        biens = await Bien.find({confirme:0})
        
    }
    else{
        biens = await Bien.find({confirme:1})
    }

    res.json({biens})
    
})

 
router.post('/get-bien-location', async(req, res)=>{
    var location = req.body.location;

    const biens = await Bien.find({
        $or: [
            { location: { $regex: location, $options: 'i' } },
           
        ]
    });

    res.json({biens})
})

router.post('/get-bien-type', async(req, res)=>{
    var type = req.body.type;

    const biens = await Bien.find({
        category:type
    });

    res.json({biens})
})


router.post("/accept-bien", async(req, res)=>{
    await Bien.findByIdAndUpdate(req.body.id, {confirme:1})
    res.json({done:true})
})

router.post("/block-bien", async(req, res)=>{
    await Bien.findByIdAndUpdate(req.body.id, {confirme:0})
    res.json({done:true})
})


router.post("/refuse-bien", async(req, res)=>{
    await Bien.findByIdAndDelete(req.body.id)
    res.json({done:true})
})


router.get('/admin/biens/detail', async(req, res)=>{
    var id = req.query.id;
    var bien = await Bien.findById(id)
    var docs = await Document.find({bienId:bien._id})
    var doc = docs[0]
    var documentEntries = Object.entries(doc.toObject());
    documentEntries = documentEntries.slice(2, documentEntries.length - 2)
    console.log(documentEntries)
    var locals = {
        title:"Admin Detail bien",
    }

    if(req.session.loginAdmin){
        res.render('admin/detail-bien', {locals, 
            page:'',
            loginAdmin:true,            
            layout:adminLayout,
            id, bien, documentEntries
        })
    }

    else{
        res.redirect('/admin')
    }
})


module.exports = router;