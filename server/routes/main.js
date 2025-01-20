const express = require('express');
const fs = require('fs')

const router = express.Router();
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const User = require('../models/User')
const Bien = require('../models/Bien')
const Exchange = require('../models/Exchange')







router.get('', async(req, res)=>{ 
 
    var locals = {
        title:"Accueil",
    }
  
    res.render('index', {locals, locpage:"main",
                        login:req.session.login ? req.session.login : false, 
                        page:"home", 
                        _id: req.session._id ? req.session._id: false,
                        fullname:req.session.fullname ? req.session.fullname : false 
                    })

})

router.get('/accueil', async(req, res)=>{ 
 
    var locals = {
        title:"Accueil",
    }
  
    res.render('index', {locals,  locpage:"main",
                        login:req.session.login ? req.session.login : false, 
                        page:"home", 
                        _id: req.session._id ? req.session._id: false,
                        fullname:req.session.fullname ? req.session.fullname : false 
                    })

})


router.get('/property', async(req, res)=>{ 
 
    var locals = {
        title:"Property",
    }
  
    res.render('property', {locals, locpage:"main",
                        login:req.session.login ? req.session.login : false, 
                        page:"property", 
                        _id: req.session._id ? req.session._id: false,
                        fullname:req.session.fullname ? req.session.fullname : false 
                    })

})



router.post('/get-property', async (req, res)=>{
    var type = req.body.type
    var nv = req.body.nv
    var ville = req.body.ville
    var limit = req.body.limit
    var skip = req.body.skip
    console.log(skip+limit)

    const count = await Bien.countDocuments({
        confirme: 1,
        location: { $regex: ville, $options: 'i' },
        category: { $regex: type, $options: 'i' },
        etat: { $regex: nv, $options: 'i' }
    });


    var data = await Bien.find({
        confirme:1,
        location: { $regex: ville, $options: 'i' },
        category: { $regex: type, $options: 'i' },
        etat: { $regex: nv, $options: 'i' }})
        .skip(skip) // Ignore les documents des pages précédentes
        .limit(limit);

    
    res.json({data, canLoad:count > (parseInt(skip) + parseInt(limit)) ? true : false, count})
})





router.get('/property/detail', async(req, res)=>{ 
 
    var locals = {
        title:"Property Detail",
    }
    var obj = await Bien.findById(req.query.id)

    res.render('property-detail', {locals,
                        login:req.session.login ? req.session.login : false, 
                        page:"", 
                        id:req.query.id,
                        obj,
                        locpage:"main",
                        _id: req.session._id ? req.session._id: false,
                        fullname:req.session.fullname ? req.session.fullname : false 
                    })

})



router.get('/signup', async(req, res)=>{ 
 
    var locals = {
        title:"Signup Page",
    }

    if(!req.session.login){
        req.session.login = false;
    }
    if(req.session.login){
        res.redirect('/compte')
    }
  
    res.render('signup', {locals,
                        login:req.session.login ? req.session.login : false, 
                        page:"signup", 
                        locpage:"main",
                        id:req.query.id,
                        _id: req.session._id ? req.session._id: false,
                        fullname:req.session.fullname ? req.session.fullname : false 
                    })

})



router.post('/signup', async (req,res)=>{
    const resultat = await User.findOne({
        email: req.body.email,
        // numero_registre: req.body.numero_registre
    });

    if(resultat){
        res.json({err:"Cet utilisateur existe dèja."})
    }
    else{

        // saving to db
        // const hashedPassword = await bcrypt.hash(req.body.psw, 10);
        
        var nouvellePersonne = new User({
            _id: new mongoose.Types.ObjectId(),
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            birth:req.body.birth,
            address:req.body.address,
            phone:req.body.phone,
            email:req.body.email,            
            psw:req.body.psw
        })
        var path = "./public/folders/user_"+nouvellePersonne._id;

        fs.mkdir(path, { recursive: true }, async (err) => {
            if (err) {
                return console.error('Erreur lors de la création du répertoire:', err);
            }
            console.log('Répertoire créé avec succès !');
            await nouvellePersonne.save();
            // init session
            req.session.login=true
            req.session._id = nouvellePersonne._id;
            req.session.fullname = nouvellePersonne.firstname + " " + nouvellePersonne.lastname;
            req.session.email = nouvellePersonne.email;
            req.session.confirmed = 0;
            
            res.json({done:true})
        });

        
    }
})





router.get('/exchange', async(req, res)=>{

    // vérifier si user a deja demander ce bien ?
    // 
    var canDemande = true;

    var idb = req.query.id
    if(!idb || !req.session._id){
        res.redirect('/')
    }

    var locals = {
        title:"Exchange Page",
    }

    // chercher dans Exchange si il n'y a pas un mm demandeur et un mm receveur
    
    // get Bien data 
    var bien = await Bien.findById(idb)
    var receveur = await User.findById(bien.owner)

    var exchanges = await Exchange({idBienReceveur:receveur._id, idBienDemandeur:req.session._id})
    if(exchanges.length){
        canDemande = false;
    }
    res.render('exchange', {locals,
        bien, receveur,
        login:req.session.login ? req.session.login : false, 
        page:"exchange", 
        canDemande,
        locpage:"",
        idb:req.query.id,
        _id: req.session._id ? req.session._id: false,
        fullname:req.session.fullname ? req.session.fullname : false 
    })
})


router.get('/logout', (req, res)=>{
    req.session.destroy();
    res.redirect('/')
})




router.get('/signin', async(req, res)=>{ 
 
    var locals = {
        title:"Signin Page",
    }

    if(!req.session.login){
        req.session.login = false;
    }
    if(req.session.login){
        res.redirect('/compte')
    }
  
    res.render('signin', {locals,
                        login: false, 
                        page:"signin", 
                        locpage:"main",
                        fullname:req.session.fullname ? req.session.fullname : false 
                    })

})

router.post('/signin', async(req, res)=>{
    var user = await User.findOne({email:req.body.email, confirme:1})
    // check if the client is not connected somewhereelse

    if(user){
        // const isPasswordValid = await bcrypt.compare(owner.psw, req.body.psw);
        // console.log("is password valid:", isPasswordValid)
        if(user.psw == req.body.psw){
            // vérifier si le user n'est pas connecté dans la bd

            // if(user.login == 1){
            //     res.json({err:"Cette Session est déja Ouverte !"})
            // }
            // else{
                // await User.findByIdAndUpdate(user._id, { login: 1 });
                // création de la session
                req.session.login = true;
                req.session._id = user._id;
                req.session.fullname = user.firstname + " " + user.lastname;
                req.session.email = user.email
                req.session.complete = user.releve_bancaire != '' && user.piece_identitee != "" && user.acte_propriete != ""
                res.json({login:true})
            // }
            
        }
        else{
            res.json({login:false})
        }
    }
    else{
        res.json({login:false})
    }
})



























module.exports = router;