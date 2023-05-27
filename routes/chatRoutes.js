import express from "express";
import {
  accessChat,
  addMember,
  createGroup,
  fetchChats,
  removeMember,
  renameGroup,
} from "../controllers/chatControllers.js";
import { isAuthorized } from "../middleware/authMiddleWare.js";

let router = express.Router();

router.route("/").post(isAuthorized, accessChat);
router.route("/").get(isAuthorized, fetchChats);
router.route("/newGroup").post(isAuthorized, createGroup);
router.route("/renameGroup").put(isAuthorized, renameGroup);
router.route("/removeMember").put(isAuthorized, removeMember);
router.route("/addMember").put(isAuthorized, addMember);

export const chatRoutes = router;
