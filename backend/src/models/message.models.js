import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content : {
        type : String,
        require : true
    },
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    file: {
        type : String,
        default : ""
    }
},{
    timestamps : true
})

export const Message = mongoose.model("Message",messageSchema)