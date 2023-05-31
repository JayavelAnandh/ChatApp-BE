import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dataBaseConnection } from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import { messageRoutes } from "./routes/messageRoutes.js";

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

app.listen(process.env.PORT, () => {
  console.log("Server Has Started");
});
