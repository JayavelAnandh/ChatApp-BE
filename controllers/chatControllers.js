import Chat from "../models/chatModel.js";
import { User } from "../models/userModel.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

export const fetchChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    let result = async (chats) => {
      chats = await User.populate(chats, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      result(chats);
    };
    res.status(200).send(chats);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

export const createGroup = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  try {
    let members = await JSON.parse(req.body.users);

    if (members.length < 2) {
      return res
        .status(400)
        .send({ message: "A group needs more than 2 members" });
    }
    members.push(req.user);

    let newGroup = await Chat.create({
      chatName: req.body.name,
      users: members,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    let groupDetails = await Chat.findOne({ _id: newGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(groupDetails);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

export const renameGroup = async (req, res) => {
  try {
    let chatId = req.body.chatId;
    let chatName = req.body.chatName;

    let renamedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(renamedChat);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

export const addMember = async (req, res) => {
  try {
    let chatId = req.body.chatId;
    let userId = req.body.userId;

    let newMember = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(newMember);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};
export const removeMember = async (req, res) => {
  try {
    let chatId = req.body.chatId;
    let userId = req.body.userId;

    let newMember = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(newMember);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};
