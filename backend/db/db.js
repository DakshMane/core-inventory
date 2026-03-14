
import {mongoose} from "mongoose";
import "dotenv/config.js"

 export const connectDB = async () => {
  // console.log(process.env.MONGODB_URI)

  try {
     await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );

  } catch (error) {
    console.log("MONGODB CONNECTION ERROR " ,  error)
    process.exit(1)
  }
}

