const helper = require("../helper/helper");
const catchAsyncFunc = require("../middlewares/catchAsyncFunc");
const Chat = require("../models/Chat");
const Message = require("../models/Messages");

exports.sendMessage = catchAsyncFunc(async (req, res, next) => {
  const { chat_id, message } = req.body;
  if (!chat_id || !message) {
    return helper.sendError(
      400,
      res,
      { error: "Please provide chat_id and message" },
      req
    );
  }
  const newMessage=await Message.create({
        chat: chat_id,
        sender: req.user,
        message,
    });
    const messages=await Message.find(newMessage._id).populate('sender', 'first_name last_name profilePic');
    
    await Chat.findByIdAndUpdate(
      chat_id,
      { latestMessage: newMessage._id.toString() },
      { new: true }
    );
    return helper.sendSuccess(res, messages, req, "Success");
});

exports.getMessages = catchAsyncFunc(async (req, res, next) => {
  const { chat_id } = req.query;
  if (!chat_id) {
    return helper.sendError(400, res, { error: "Please provide chat_id" }, req);
  }
  // The below query will populate the sender field with the first_name, last_name and profilePic of the sender
  const messages = await Message.find({ chat: chat_id }).populate(
    "sender",
    "first_name last_name profilePic"
  )
  return helper.sendSuccess(res, messages, req, "Success");
});
