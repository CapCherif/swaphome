require('dotenv').config();

const express = require('express');
const app = express();

// const fs = require('fs');
// const path = require('path');



const expressLayout = require('express-ejs-layouts');
// const cookieParser = require('cookie-parser');

// const MongoStore = require('connect-mongo');

const session = require('express-session');
// const methodOverride = require('method-override');
app.use(expressLayout);

// const connectDB = require('./server/config/db');


const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);


// connect to db
// connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.use(methodOverride('_method'))
app.set('layout', "./layouts/main");
app.set('view engine', "ejs");
app.use(express.static('public'));
// app.use(cookieParser());

// const MongoStore = require('connect-mongo');



const connectDB = require('./server/config/db');







// connect to db
connectDB(); 


// Configuration de la session
// const sessionConfig = {
//   secret: 'azerty123',        // Clé secrète pour signer la session
//   resave: false,
//   saveUninitialized: false,
//   store: new RedisStore({ client: redisClient }),
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24, // Durée de vie de la session en millisecondes (1 jour)
//   },
// };

// Créez l'application Express
// const app = express();
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});



app.use(session({
  secret: 'test123',
  resave: false,
  saveUninitialized: true,
  store: store,
}));

// // Pour détruire une session spécifique
// store.destroy(req.sessionId, function(err) {
//   if (err) {
//     console.error("Error destroying session:", err);
//   } else {
//     console.log("Session destroyed successfully");
//   }
// });


// Utilisez la session avec la configuration définie
// app.use(session(sessionConfig));

// const FileStore = require('session-file-store')(session);


// app.use(session({
//   store: new FileStore(),
//   secret: 'votre_secret_key',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 3600000 * 24, // Exemple : 1 heure
//   },
// }));

// app.locals.isActiveRoute = isActiveRoute


const PORT = 5000 || process.env.PORT;

app.use((req, res, next)=>{
  // req.io = io;

  if (typeof req.session.login === 'undefined') {
      req.session.login = false;
  }
  
  if (typeof req.session.loginAdmin === 'undefined') {
    req.session.loginAdmin = false;
  }


  next();
})



app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/user'));
app.use('/', require('./server/routes/admin'));
// app.use('/', require('./server/routes/admin'));




// gestion des fichier de sessions - suppression automatique aprés 24 h

// const sessionDir = './sessions'; // Remplacez par le chemin réel

// // Supprimer les fichiers de session plus anciens d'un jour
// const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;

// fs.readdir(sessionDir, (err, files) => {
//   if (err) throw err;

//   files.forEach(file => {
//     const filePath = path.join(sessionDir, file);

//     fs.stat(filePath, (err, stats) => {
//       if (err) throw err;

//       if (stats.isFile() && stats.mtime.getTime() < cutoffTime) {
//         fs.unlink(filePath, err => {
//           if (err) throw err;
//           console.log(`Fichier supprimé : ${filePath}`);
//         });
//       }
//     });
//   });
// });












app.listen(PORT, ()=>{
    console.log(`App listening to port ${PORT}`);
})



