
import {mongoose} from "mongoose";
// import {dotenv} from "dotenv"
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

