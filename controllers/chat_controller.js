const helper = require("../helper/helper");
const catchAsyncFunc = require("../middlewares/catchAsyncFunc");
const Chat = require("../models/Chat");
const User = require("../models/User");

exports.searchChat = catchAsyncFunc(async (req, res, next) => {
  const { cname } = req.query;
  if (!cname) {
    return helper.sendError(
      400,
      res,
      { error: "Please provide search string" },
      req
    );
  }
  const chat = await Chat.find({
    name: { $regex: cname, $options: "i" },
  });

  return helper.sendSuccess(res, chat, req, "Success");
});

exports.renameChat = catchAsyncFunc(async (req, res, next) => {
  const { chat_id, name } = req.body;
  if (!chat_id || !name) {
    return helper.sendError(
      400,

      res,
      { error: "Please provide chat_id and name" },
      req
    );
  }
  await Chat.findByIdAndUpdate(chat_id, { name }, { new: true });
  return helper.sendSuccess(res, null, req, "Success");
});

exports.getAllChats = catchAsyncFunc(async (req, res, next) => {
  const chats = await Chat.find({
    users: { $in: [req.user] },
  })
    .populate({
      path: "users",
      select: "first_name last_name profilePic email",
    })
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "first_name last_name profilePic email",
      },
    });

  return helper.sendSuccess(res, chats, req, "Success");
});

exports.createGroupChat = catchAsyncFunc(async (req, res, next) => {
  const { name, user_ids } = req.body;
  if (user_ids.length < 2) {
    return helper.sendError(
      400,
      res,
      { error: "Please provide atleast 2 users" },
      req
    );
  }
  const users = [...user_ids, req.user];
  const chat = await Chat.create({
    name,
    users,
    isGroupChat: true,
    groupAdmin: req.user,
  });
  const chatDetails = await Chat.findById(chat._id).populate(
    "users",
    "first_name last_name profilePic"
  );

  return helper.sendSuccess(res, chatDetails, req, "Success");
});

exports.addUsersToGroupChat = catchAsyncFunc(async (req, res, next) => {
  const { chat_id, user_ids } = req.body;
  if (user_ids.length < 1) {
    return helper.sendError(
      400,
      res,
      { error: "Please provide atleast 1 user" },
      req
    );
  }
  const checkUsersExists = await Chat.find({
    _id: chat_id,
    users: { $in: user_ids },
  });
  if (checkUsersExists.length > 0) {
    return helper.sendError(
      400,
      res,
      { error: "User already exists" },

      req
    );
  }
  const chat = await Chat.findById(chat_id);
  if (!chat) {
    return helper.sendError(400, res, { error: "Chat not found" }, req);
  }
  chat.users = [...chat.users, ...user_ids];
  await chat.save();
  const updatedChats = await Chat.findById(chat_id).populate(
    "users",
    "first_name last_name profilePic"
  );
  return helper.sendSuccess(res, updatedChats, req, "Success");
});



exports.createChat = catchAsyncFunc(async (req, res, next) => {
  const { user_id } = req.body;
  if (!user_id) {
    return helper.sendError(400, res, { error: "Please provide user_id" }, req);
  }
  const user = await User.findById(user_id);
  if (!user) {
    return helper.sendError(400, res, { error: "User not found" }, req);
  }
  const checkUsersExists = await Chat.find({
    isGroupChat: false,
    users: { $all: [user_id, req.user], $size: 2 },
  }).populate("users",  "profilePic first_name last_name _id email")

  if (checkUsersExists.length > 0) {
    return helper.sendSuccess(res, checkUsersExists[0], req, "Success");
  }

  const chat = await Chat.create({
    users: [user_id, req.user],
    isGroupChat: false,
    name: "sender",
  });
  const createdChat=await Chat.findById(chat._id).populate(
    "users",
    "profilePic first_name last_name _id email"
  );
  return helper.sendSuccess(res, createdChat, req, "Success");
});



exports.removeUsersFromGroupChat = catchAsyncFunc(async (req, res, next) => {
  const { chat_id, user_ids } = req.body;
  // user_ids is an array of user ids to be removed from the group chat
  if (user_ids.length < 1) {
    return helper.sendError(
      400,
      res,
      { error: "Please provide atleast 1 user" },
      req
    );
  }
  const chat = await Chat.findById(chat_id);
  if (!chat) {
    return helper.sendError(400, res, { error: "Chat not found" }, req);
  }
  chat.users = chat.users.filter((user) => !user_ids.includes(user.toString()));

  await chat.save();

  return helper.sendSuccess(res, null, req, "Success");
});

exports.deleteGroupChat = catchAsyncFunc(async (req, res, next) => {
  const { chat_id } = req.query;
  if (!chat_id) {
    return helper.sendError(400, res, { error: "Please provide chat_id" }, req);
  }

  await Chat.findByIdAndDelete(chat_id);

  return helper.sendSuccess(res, null, req, "Success");
});
