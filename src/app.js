import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
//import { devUri } from './config/config';
import userRoute from './routes/user';

const app = express();

dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';

// Normal express config defaults
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', userRoute);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
};
const DATABASE_URL =process.env.devUri || '';
mongoose.connect(DATABASE_URL, options, (err) => {
  if (err) throw err;
  console.log('connected to the DB!');
});

mongoose.set('useFindAndModify', false);

app.use(express.static(`${__dirname}/public`));

// handle non-existing route
app.use((req, res, next) => {
    res.status(404).json({
      status: 404,
      error: 'Wrong request. Route does not exist',
    });
});  

//Error handlers & middlewares
if(!isProduction) {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
  
      res.json({
        errors: {
          message: err.message,
          error: err,
        },
      });

    });
  }

  app.use((err, req, res) => {
    res.status(err.status || 500);
  
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
