import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dataBaseConnection } from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import { messageRoutes } from "./routes/messageRoutes.js";
import { Server } from "socket.io";
const app = express();

dotenv.config();
dataBaseConnection();

app.get("/", (req, res) => {
  res.send("Server is ready to receive reqs");
});

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log("Server Has Started");
});
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
  path: "/socket.io",
  transports: ["websocket", "polling"],
  secure: true,
});
io.on("connection", (socket) => {
  console.log("connected with socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined the room :-", room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.log("chat.users is not defined");
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER HAS BEEN DISCONNECTED");
    socket.leave(userData._id);
  });
});
