import express from "express";
import { isAuthorized } from "../middleware/authMiddleWare.js";

let router = express.Router();

// router.route("/").post(isAuthorized, accessChat);
// router.route("/").get(isAuthorized, fetchChats);
// router.route("/group").post(isAuthorized, createGroupChat);
// router.route("/rename").put(isAuthorized, renameGroup);
// router.route("/groupremove").put(isAuthorized, removeFromGroup);
// router.route("/groupadd").put(isAuthorized, addToGroup);

export const chatRoutes = router;
