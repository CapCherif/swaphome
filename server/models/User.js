const mongoose = require('mongoose');



// Définir le schéma du fournisseur avec le prix du produit inclus
const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    
    phone:{
      type:String,
      required:true
    },
    address:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true
    },
    
    psw:{
      type:String,
      required:true
    },

    complete:{
      type:Number,
      required:false,
      default:0
    },

    confirme:{
      type:Number,
      default:0
    },

    
    imgs:[
      {
        type:String,
        required:false,
      }
    ]
    ,
    createdAt: {
      type: Date,
      default: Date.now  // La date par défaut est la date actuelle
    }
  });
  
  // Créer le modèle du fournisseur à partir du schéma
  const User = mongoose.model('User', UserSchema);
  module.exports = User;