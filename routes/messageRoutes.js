import express from "express";
import { isAuthorized } from "../middleware/authMiddleWare.js";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import { User } from "../models/userModel.js";

const router = express.Router();

router.get("/:chatId", isAuthorized, async (req, res) => {
  try {
    let messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});
router.post("/", isAuthorized, async (req, res) => {
  try {
    let { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("InComplete data in request");
      return res
        .status(400)
        .send({ message: "content or chatId is miising in request" });
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});
export const messageRoutes = router;
