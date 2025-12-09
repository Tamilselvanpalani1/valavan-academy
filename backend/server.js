import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/connectdb.js';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route.js';

const app = express();

//CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true, // allow cookies to be sent
}))

const PORT = process.env.PORT;
//Informing  to the express that json data is coming from the front-end
app.use(express.json(
  {
    limit : "5mb" // file max-size should be lessthan 5mb from the front-end - default value 100kb
  }
));

//Middleware - informing express that we are going to use the cookie parser
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })); // to handle form data

app.use('/api/auth', authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
  console.log("Mongo URL:", process.env.MONGO_URL);
});