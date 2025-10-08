//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "../db/index.js";

connectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000, () => {
        console.log('Server is running on ${process.env.PORT}')
    })

})
.catch((err) => {
    console.log("MONGODB Connection failed !!",err);    
})
dotenv.config({
    path:'./env'
})






/*
CONNECTING DB THROUGH METHOD 1
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";


const app = express()
(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}`/`${DB_NAME}`)

    // Handle server errors
    app.on("error", (error) => {
      console.log("ERRR: ", error);
      throw error;  
    });

    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
    }catch(error){
        console.error("ERROR: ",error);
        throw err
    }
})()
    */