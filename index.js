import express from "express";
import cors from "cors";
import chats from "./data.js";
const app = express();

app.get("/", (req, res) => {
  res.send("Server is ready to receive reqs");
});
app.get("/chats", async (req, res) => {
  try {
    res.status(200).send(chats);
  } catch (error) {
    res.status(500).send();
  }
});
app.use(cors());
app.listen(5000, () => {
  console.log("Server Has Started");
});
