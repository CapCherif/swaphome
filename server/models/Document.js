const mongoose = require('mongoose');



// Définir le schéma du fournisseur avec le prix du produit inclus
const DocumentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bienId:mongoose.Schema.Types.ObjectId,
    piece_id: {
      type: String,
      required: false,
      default:""
    },
    acte_prop: {
      type: String,
      required: false,
      default:""
    },
    diagnostique_p_energetique:{
        type: String,
        required: false,
        default:""
    },

    diagnostique_amiante:{
        type: String,
        required: false,
        default:""
    },

    diagnostique_termite:{
        type: String,
        required: false,
        default:""
    },

    diagnostique_plomb:{
        type: String,
        required: false,
        default:""
    },

    diagnostique_gaz:{
        type: String,
        required: false,
        default:""
    },

    taxe_fonciere: {
        type: String,
        required: false,
        default:""
    },
    plan_cadastral: {
        type: String,
        required: false,
        default:""
    },
    historique_travaux:{
        type: String,
        required: false,
        default:""
    },


    attestation_absence: {
        type: String,
        required: false,
        default:""
    },
    permis_construire: {
        type: String,
        required: false,
        default:""
    },
    reglement_copropriete:{
        type: String,
        required: false,
        default:""
    },

    etat_descriptif_division:{
      type:String,
      required:false,
      default:''
    },

    etat_charge_copropriete: {
        type: String,
        required: false,
        default:""
    },
    appel_fond: {
        type: String,
        required: false,
        default:""
    },
    proces_assemblee:{
        type: String,
        required: false,
        default:""
    },
    



    createdAt: {
      type: Date,
      default: Date.now  // La date par défaut est la date actuelle
    }
  });
  
  // Créer le modèle du fournisseur à partir du schéma
  const Document = mongoose.model('Document', DocumentSchema);
  module.exports = Document;