

const express = require('express');
const fs = require('fs')
const multer = require('multer');
const path = require('path');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const User = require('../models/User')
const Bien = require('../models/Bien');
const Document = require('../models/Document');
const Exchange = require('../models/Exchange');
const Conversation = require('../models/Conversation');


const userLayout = "../views/layouts/user"

// Configuration de stockage pour multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/folders/user_'+req.session._id); // Dossier de destination
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname + path.extname(file.originalname)); // Nom du fichier
    }
});

// Initialisation de multer avec la configuration de stockage
const upload = multer({ storage: storage });





// compte ---------------------------------------------
// compte ---------------------------------------------
// compte ---------------------------------------------
router.get('/compte', (req, res)=>{
    var locals = {
        title:"Mon Compte"
    }
    if(req.session.login){
        res.render('user/compte', {
                        locals,
                        login:true, 
                        page:"compte", 
                        _id: req.session._id ,
                        fullname:req.session.fullname,
                        email:req.session.email,
                        complete: req.session.complete
        })
    }

    else{
        res.redirect('/signin');
    }
})


router.get('/compte/property', async(req, res)=>{
    var locals = {
        title:"Mes Propriétés"
    }
    var properties = await Bien.find({owner:req.session._id})
    console.log(properties)


    if(req.session.login){
        res.render('user/property', {
                        locals,
                        login:true, 
                        page:"compte", 
                        _id: req.session._id ,
                        fullname:req.session.fullname,
                        email:req.session.email,
                        complete: req.session.complete,
                        properties
        })
    }

    else{
        res.redirect('/signin');
    }
})


router.get('/compte/property/detail', async(req, res)=>{
    var locals = {
        title:"Mes Propriétés"
    }

    var id = req.query.id;
    // get the Bien from the DB
    

    if(req.session.login){
        var bien = await Bien.findById(id)
        var docs = await Document.find({bienId:bien._id})
        var doc = docs[0]
        if(bien){
            
            res.render('user/detail', {
                locals,
                login:true, 
                page:"compte", 
                _id: req.session._id , id,
                fullname:req.session.fullname,
                email:req.session.email,
                complete: req.session.complete,
                bien, docs:doc

            })
        }
        else{
            res.redirect('/')
        }
        
    }

    else{
        res.redirect('/signin');
    }
})



router.get('/property/exchange', async(req, res)=>{
    var locals = {
        title:"Exchange form"
    }

    // vérifier si l'utilisateur a deja envoyé une demande
    
    // demander un echange
    // cette page fiha, formulaire d'echange + validation
    var id = req.query.id
    // vérifier si le bien existe
    var bien = await Bien.findById(id)


    var exchangeDidExist = false;
    var ex = await Exchange.find({idBienReceveur:req.query.id, demandeurId:req.session._id,receveurId:bien.owner}) 
    if(ex.length){
        exchangeDidExist = true;
    }
    console.log(exchangeDidExist)
    console.log(ex)

    //vérifier si le demandeur a au moins un bien
    var mesBien = await Bien.find({owner:req.session._id, confirme:1})

    var canAsk = false;
    if(mesBien.length > 0){
        canAsk = true;
    }


    if(bien){
        res.render('user/exchange', {
            locals,
            exchangeDidExist,
            login:true, 
            page:"compte", 
            ex,
            bien,
            _id: req.session._id , idb:id,
            fullname:req.session.fullname,
            email:req.session.email,
            canAsk,
            mesBien,
            complete: req.session.complete,
        })
    }
    else{
        res.redirect('/compte')
    }
})


router.post('/demande-exchange', async(req, res)=>{

    var bienReceveur = await Bien.findById(req.body.idBienReceveur)
    // vérifié si user peut effectuer la demande
    console.log(req.body.monBienChoisi)
    console.log(req.body.idBienReceveur)
    var mbc = new mongoose.Types.ObjectId(req.body.monBienChoisi)

    // voir si la demande existe ?
    var siDemande = await Exchange.find({
        idBienDemandeur:mbc,
        idBienReceveur: new mongoose.Types.ObjectId(req.body.idBienReceveur),
        demandeurId: req.session._id,
        receveurId: bienReceveur.owner,
    })
    if(siDemande.length){
        res.json({didExist:true})
    }
    else{

        var exchange = new Exchange({
            _id:new mongoose.Types.ObjectId(),
            idBienDemandeur:mbc,
            idBienReceveur: new mongoose.Types.ObjectId(req.body.idBienReceveur),
            demandeurId: req.session._id,
            locationDemandeur:req.body.location,
            receveurId: bienReceveur.owner,
        })
    
        await exchange.save();

        res.json({done:true})
    }
    

    
})


router.get('/compte/demandes', async(req, res)=>{
    var locals = {
        title:"Mes Demandes"
    }

    //var id = req.query.id;
    // get the Bien from the DB
    

    // if(req.session.login){
        // var bien = await Bien.findById(id)
    var exchanges = await Exchange.find({receveurId:req.session._id})
        
    if(req.session.login){
        
        res.render('user/demande', {
            locals,
            login:true, 
            page:"compte", 
            _id: req.session._id ,
            fullname:req.session.fullname,
            email:req.session.email,
            complete: req.session.complete,
            exchanges, layout:userLayout

        })
    }
    
    else{
        res.redirect('/signin');
    }
        
    

})


router.get('/compte/demandes/detail', async(req, res)=>{

    // detail du bien

    var bien = await Bien.findById(req.query.id)
    var id = req.query.id;
    var ide = req.query.ide

    // voir l'etat de la demande
    var exc = await Exchange.findById(ide)
    var confirmation_receveur = exc.confirmation_receveur

    // var bien = await Bien.findById(id)
    var docs = await Document.find({bienId:bien._id})
    var doc = docs[0]
    var documentEntries = Object.entries(doc.toObject());
    documentEntries = documentEntries.slice(2, documentEntries.length - 2)

    var locals = {
        title:"Détail du bien"
    }

    if(req.session.login){
        
        res.render('user/detail-exchange-bien', {
            locals,
            login:true, confirmation_receveur,
            page:"compte", 
            _id: req.session._id ,
            fullname:req.session.fullname,
            email:req.session.email,
            complete: req.session.complete,
            bien, layout:userLayout, documentEntries,
            ide
        })
    }
    
    else{
        res.redirect('/signin');
    }

})



router.post('/compte/accept-exchange', async(req, res)=>{
    // mettre la confirmation_receveur a 1
    var ex = await Exchange.findById(req.body.ide)
    ex.confirmation_receveur = 1
    await ex.save()

    res.json({done:true})
})

router.post('/remove-bien', async(req, res)=>{
    await Bien.findByIdAndDelete(req.body.id)
    res.json({done:true})
})






router.get('/compte/ajout', async(req, res)=>{
    var locals = {
        title:"Ajouter un bien"
    }

    if(req.session.login){
    // if(true){
        res.render('user/add', {
                        locals,
                        login:true, 
                        page:"compte", 
                        _id: req.session._id ,
                        fullname:req.session.fullname,
                        email:req.session.email,
                        complete: req.session.complete
        })
    }

    else{
        res.redirect('/signin');
    }
})



router.post('/upload', upload.array('photos', 5), async (req, res) => {
// router.post('/upload', async (req, res) => {
    
    var cc = [JSON.parse(req.body.carac)]
    console.log(typeof(cc))
    var nouveauBien = new Bien({
        _id: new mongoose.Types.ObjectId(),
        category:req.body.type,
        etat:req.body.etat,
        location:req.body.location,
        description:req.body.description,
        n_chambre:req.body.n_chambre,
        n_piece:req.body.n_piece,
        n_bain:req.body.n_bain,
        etage:req.body.etage,
        n_etage:req.body.n_etage,
        surface:req.body.surface,
        carac:cc,
        energy:req.body.energy,
        charge:req.body.charge,
        annee:req.body.annee,
        chauffage:req.body.chauffage,
        owner:req.session._id,
        imgs:req.files.map(file =>file.path)
    })

    await nouveauBien.save()
    var docs = new Document({
        _id:new mongoose.Types.ObjectId(),
        bienId:nouveauBien._id
    })
    await docs.save()

    res.json({done:true});
});








router.post('/upload-doc', upload.any(), async (req, res)=>{
    file = req.files
    console.log(file)
    console.log(req.body.field)

    var path = ""

    if(req.body.field != "diagnostique"){
        var docs = await Document.findOne({bienId:req.body.bienId})
      
        path = file[0].destination +"/"+ file[0].filename
        path = path.slice(7, )
        docs[req.body.field] = path
        await docs.save()
    }

    console.log("path : ", path)
    
    
    res.json({done:true, path})
})

router.post('/delete-doc-field', async(req, res)=>{
    var docs = await Document.findOne({bienId:req.body.bienId})
    docs[req.body.field] = ""
    await docs.save()
    res.json({done:true})
})










router.get('/compte/documents', async(req, res)=>{
    var locals = {
        title:"Mes documents"
    }

    if(req.session.login){
        res.render('user/documents', {
                        locals,
                        login:true, 
                        page:"compte", 
                        _id: req.session._id ,
                        fullname:req.session.fullname,
                        email:req.session.email,
                        complete: req.session.complete
        })
    }

    else{
        res.redirect('/signin');
    }
})





router.get('/compte/messages', async(req, res)=>{
    var locals = {
        title:"Messagerie"
    }

    if(req.session.login){
        res.render('user/messagerie', {
                        locals,
                        login:true, 
                        page:"compte", 
                        _id: req.session._id ,
                        fullname:req.session.fullname,
                        email:req.session.email,
                        complete: req.session.complete
        })
    }

    else{
        res.redirect('/signin');
    }
})






router.get('/compte/chat', async(req, res)=>{
    // id session
    // id de la personne from query
    var locals = {
        title:"Messagerie"
    }

    var isProprietaire = await User.findById(req.query.idp)
    if(isProprietaire){
        isProprietaire = true
    }
    else{
        isProprietaire = false
    }

    // if bien existe
    var resBien = await Bien.findById(req.query.idb)
    var bienExist = false;

    if(resBien){
        bienExist = true
    }
    else{
        bienExist = false
    }
    // check id the chat exist,
    var idClient = req.query.idc
    console.log(idClient)

    var ifChat = await Conversation.find({
                        idBien:req.query.idb,
                         idProprietaire:req.query.idp,
                        idClient:idClient
                        })

    var user_ = await User.findById(idClient)
    console.log(ifChat)
    // if not create one
    if(ifChat.length == 0 && bienExist && isProprietaire){
        console.log('creation nouveau chat..')
        var newConversation = new Conversation({
            _id: new mongoose.Types.ObjectId(),
            idBien: req.query.idb,
            idClient:req.query.idc,
            fullNameClient: user_.firstname + " " + user_.lastname,
            aPropos:resBien.location,
            idProprietaire:req.query.idp
        })

        await newConversation.save()
    }

    console.log(user_)
    if(req.session.login && isProprietaire){
        res.render('user/chat', {
            
            idBien:req.query.idb,
            idProprietaire:req.query.idp,
            idClient,
            fullNameClient:user_.firstname + " " + user_.lastname,
            locals,
            login:true, 
            page:"compte", 
            _id: req.session._id ,
            fullname:req.session.fullname,
            email:req.session.email,
            complete: req.session.complete,
            layout:userLayout
        })
    }

    else{
        res.redirect('/signin');
    }
})


router.post('/compte/get-msg', async (req, res)=>{
    var result = await Conversation.findOne({idBien:req.body.idBien, 
                    idClient:req.body.idClient, 
                    idProprietaire:req.body.idProprietaire})

                

    res.json({result})
})


router.post('/compte/add-msg', async(req, res)=>{
    var texte = req.body.texte
    const newMessage = {
        _id: new mongoose.Types.ObjectId(),
        texte: texte,
        idUser: req.session._id, // ID de l'utilisateur actuel
        createdAt: new Date() // Optionnel, le schéma ajoute automatiquement la date
    };

    const result = await Conversation.findOneAndUpdate(
        {
            idBien:req.body.idBien,
            idProprietaire:req.body.idProprietaire,
            idClient:req.body.idClient
        },
        {
            $push: { messages: newMessage } // Utiliser l'opérateur $push pour ajouter au tableau
        },
        { new: true } // Retourne la conversation mise à jour
    );

    // req.io.to(req.body.idProprietaire).emit('receiveMessage', { newMessage });

    res.json({result})

})


router.post('/compte/get-invitmsg', async(req, res)=>{
    var result = await Conversation.find({
        $or: [
            { idProprietaire: req.session._id },
            { idClient: req.session._id }
        ]
    });

    res.json({result})
})


// router.get('/compte/conv', async(req, res)=>{


//     var locals = {
//         title:"Messagerie"
//     }

//     var isClient = await User.findById(req.query.idp)
//     if(isClient){
//         isClient = true
//     }
//     else{
//         isClient = false
//     }


//     if(req.session.login && isClient){
//         res.render('user/chat', {
//             idBien:req.query.idb,
//             idProprietaire:req.query.idp,
//             locals,
//             login:true, 
//             page:"compte", 
//             _id: req.session._id ,
//             fullname:req.session.fullname,
//             email:req.session.email,
//             complete: req.session.complete,
//             layout:userLayout
//         })
//     }

//     else{
//         res.redirect('/signin');
//     }
// })

// Ajouter le message dans la liste `messages` de la conversation
// const result = await Conversation.findByIdAndUpdate(
//     conversationId,
//     {
//         $push: { messages: newMessage } // Utiliser l'opérateur $push pour ajouter au tableau
//     },
//     { new: true } // Retourne la conversation mise à jour
// );



// compte ---------------------------------------------
// compte ---------------------------------------------
// compte ---------------------------------------------


module.exports = router;