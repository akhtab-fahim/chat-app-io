import express from "express";
import {Server} from "socket.io";
import http from "http";
import { connectDB } from "./db/index.js";
import { User } from "./models/user.models.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { verifyToken } from "./middleware/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import { Message } from "./models/message.models.js";

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


const io = new Server(server);

// io authentication middleware

// io.use((socket,next)=>{
//     let token;
//     if(socket.handshake.auth.token){
//         token = socket.handshake.auth.token
//     }else if(socket.handshake.headers.authorization){
//         token = socket.handshake.headers.authorization
//     }

//     if(!token){
//         console.log("NO token found")
//         return next(new Error("No Auth token found "))
//     }

//     try {
//        const verifiedToken = jwt.verify(token,process.env.IO_TOKEN_SECRET) 
//        console.log(socket.user);
//        socket.user = verifiedToken;
//        next();
//     } catch (error) {
//         next(new Error("Auth token invalid"));
//     }
// })

io.use((socket, next) => {
  let token;

  if (socket.handshake.auth && socket.handshake.auth.token) {
    token = socket.handshake.auth.token;
  } else if (socket.handshake.query && socket.handshake.query.token) {
    token = socket.handshake.query.token;
  } else if (socket.handshake.headers.authorization) {
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }
  }

  console.log("Extracted token:", token);

  if (!token) {
    return next(new Error("No Auth token found"));
  }

  try {
    const verifiedToken = jwt.verify(token, process.env.IO_TOKEN_SECRET);
    socket.user = verifiedToken;
    console.log("Verified user:", socket.user);
    next();
  } catch (err) {
    next(new Error("Auth token invalid"));
  }
});


//to maintain the user info
const userSockedIdInfo = new Map();

io.on("connection",async(socket)=>{
    console.log("User connected : ",socket.id);
    userSockedIdInfo.set(socket.user.id,socket.id)

    socket.on("disconnect",()=>{
        userSockedIdInfo.delete(socket.user.id)
        console.log(socket.user.id + "disonnected");
        
    })

})


app.post("/sendMessages/:recieverId",verifyToken,async(req,res)=>{

    const {content} = req.body;
    const {recieverId} = req.params;

    if(!content){
        return res.status(400).json({ message: "Content are required." });
    }
    
    let fileUrl;

    if(req.file){
        const cloudResponse = await uploadOnCloud(req.file.path)
        fileUrl = cloudResponse?.url || " "
    }



    const message = await Message.create({
        content,
        recieverId,
        senderId : req.user.id,
        file : fileUrl
    })

    if(!message){
        return res.status(400).json({message : "message not created "})
    }
    
    const receiverSocketId = userSockedIdInfo.get(recieverId)
    if(receiverSocketId){
        io.to(receiverSocketId).emit('private_message',message);
    }

    res.status(200).json({message : "message send "})
})


app.get("/auth/:userId",verifyToken,async(req,res)=>{
    const {userId} = req.params;
    const user = await User.findById(userId).select("-password");
    if(!user){
        return res.status(401).json({message : "No user find"})
    }
    return res.status(200).json({message : "User details failed ",user})
    
})

app.post("/auth/register", async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
        return res.status(400).json({ message: "Any of the fields are missing" });
    }

    const isUserExits = await User.findOne({ email });
    if (isUserExits) {
        return res.status(400).json({ message: "User already exists. Sign In" });
    }

    const user = await User.create({
        name,
        email,
        password,
        phoneNumber
    });

    if (!user) {
        return res.status(400).json({ message: "User not created" });
    }

    const accessToken = jwt.sign(
        {
            id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

    const refreshToken = jwt.sign(
        {
            id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    res
        .cookie("refreshToken", refreshToken, options)
        .status(200)
        .json({
            accessToken,
            user,
            message: "User registered successfully"
        });
});

app.post("/auth/login",async(req,res)=>{
const {name,email,password} = req.body;

    if(!name || !email || !password ){
        return res.status(400).json({message : " Any of the fields are missing "})
    }

    const isUserExits = await User.findOne({ $or: [{ email }, { name }] })
    if(!isUserExits){
        return res.status(400).json({message : " User doesnt exists Register  "})
    } 

      const accessToken = jwt.sign({
        id : isUserExits._id,
        name : isUserExits.name,
        phoneNumber : isUserExits.phoneNumber
    },
    process.env.TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })


    const refreshToken = jwt.sign({
        id : isUserExits._id,
        name : isUserExits.name,
        phoneNumber : isUserExits.phoneNumber
    },
    process.env.TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })

    const options = {
            httpOnly : true,
            secure : true   
    }

    const isPassVerified = await bcrypt.compare(password,isUserExits.password)
    if(isPassVerified){
        res.
        cookie("refreshToken",refreshToken,options)
        .status(200)
        .json({
            accessToken,
            isUserExits,
            message : "User Signed in successfully"
        })
    }
})












connectDB().
then(()=>{
    server.listen(2000,()=>{
        console.log("Server running on port 2000");
    })
})
.catch((error)=>{
    console.log("Error ",error)
})
