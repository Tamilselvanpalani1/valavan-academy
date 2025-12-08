import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './db/connectdb.js';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT;
//Informing  to the express that json data is coming from the front-end
app.use(express.json(
  {
    limit : "5mb" // file max-size should be lessthan 5mb from the front-end - default value 100kb
  }
));

const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});