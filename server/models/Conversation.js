const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    texte: { 
        type: String, 
        required: true, 
        default:"" 
    },

    idUser: mongoose.Schema.Types.ObjectId,

    createdAt: {
        type: Date,
        default: Date.now  // La date par défaut est la date actuelle
    }
    
  });
  

// Définir le schéma du fournisseur avec le prix du produit inclus
const ConversationeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idBien: mongoose.Schema.Types.ObjectId,
    idClient: mongoose.Schema.Types.ObjectId,
    aPropos:{
        type:String,
        required:true,
        default:""
    },
    fullNameClient:{
        type:String,
        required:true,
        default:""
    },
    idProprietaire: mongoose.Schema.Types.ObjectId,

    messages:{
        type: [MessageSchema],
        default: []
    },

    
    createdAt: {
      type: Date,
      default: Date.now  // La date par défaut est la date actuelle
    }
  });
  
  // Créer le modèle du fournisseur à partir du schéma
  const Conversation = mongoose.model('Conversation', ConversationeSchema);
  module.exports = Conversation;