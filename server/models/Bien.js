const mongoose = require('mongoose');


const caracSchema = new mongoose.Schema({
  jardin: { type: String, required: false },
  parking: { type: String, required: false },
  terrasse: { type: String, required: false },
   piscine: { type: String, required: false },
  cave: { type: String, required: false },
  balcon:{ type: String, required: false }
  
});



// Définir le schéma du produit
const BienSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  category:{
    type:String,
    required:true,
    default:""
  },
  location: {
    type: String,
    required: true
  },
  etat:{
    type: String,
    required: true,
    default:"ancien"
  },
  etage:{
    type: Number,
    required: false
  },
  n_etage:{
    type: Number,
    required: false
  },
  status:{
    type:Number,
    required:false,
    default:-1
  },
  carac:[
    caracSchema
  ],
  energy:{
    type: String,
    required: false
  },
  charge:{
    type: Number,
    required: false
  },
  n_bain:{
    type: Number,
    required: false
  },
  annee:{
    type: String,
    required: false
  },
  chauffage:{
    type: String,
    required: false
  },
  n_piece:{
    type: Number,
    required: false
  },
  n_chambre:{
    type: Number,
    required: false
  },
  
  imgs:[{
    type:String,
    required:true
  }],
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  surface:{
    type:Number,
    default:0
  },
  notes:{
    type:Number,
    default:3
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  files:[{type:String, required:false}],
  
  createdAt: {
    type: Date,
    default: Date.now  // La date par défaut est la date actuelle
  }

  ,
  confirme:{
    type:Number,
    default:0,
  }
  
});

// Créer le modèle du produit à partir du schéma
const Bien = mongoose.model('Bien', BienSchema);



// Exporter les modèles
module.exports = Bien;
