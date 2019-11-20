import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import telegramRoutes from './routes/telegram.routes'

//import mongoose from 'mongoose';


const app = express();

//Settings
app.set('port',process.env.PORT || 3000);

//middleware
app.use(cors(/*{origin: ['https://web-game-fc8f9.firebaseapp.com','http://localhost:4200']}*/));
app.use(bodyParser.json());

//Routes
app.use('/telegram', telegramRoutes)

//DataBase
require('./config/configDb')//configure db
require('./models/db.model')//execute dbconnection


//Starting the server
app.listen(app.get('port'), () => {
    console.log("App now running on port", app.get('port'));
  });

  //"MONGODB_URI": "mongodb://localhost:27017/alexa027_bot"