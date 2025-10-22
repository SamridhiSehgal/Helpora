import mongoose from "mongoose";
const connectDb=async()=>{
    mongoose.connection.on('connected',()=>{
        console.log("DB connected");
    })
    await mongoose.connect(`${process.env.MONGO_URL}/helpora`)
}
export default connectDb;