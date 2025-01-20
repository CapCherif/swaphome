const mongoose = require('mongoose');



// Définir le schéma du fournisseur avec le prix du produit inclus
const ExchangeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    idBienDemandeur: mongoose.Schema.Types.ObjectId,
    idBienReceveur: mongoose.Schema.Types.ObjectId,

    demandeurId: mongoose.Schema.Types.ObjectId,
    
    receveurId: mongoose.Schema.Types.ObjectId,
    locationDemandeur:{
      type:String,
      required:false,
      default:"location:---"
    },
    
    
    // psw:{
    //   type:String,
    //   required:true
    // },

    confirmation_receveur:{
      type:Number,
      required:false,
      default:0
    },

    confirmation_admin:{
      type:Number,
      required:false,
      default:0
    },
    confirmation_notaire:{
        type:Number,
        required:false,
        default:0
    },

    
    createdAt: {
      type: Date,
      default: Date.now  // La date par défaut est la date actuelle
    }
  });
  
  // Créer le modèle du fournisseur à partir du schéma
  const Exchange = mongoose.model('Exchange', ExchangeSchema);
  module.exports = Exchange;