const Wishlist = require("../../models/Wishlist");
const catchAsyncFunc = require("../../middlewares/catchAsyncFunc");
const Room = require("../../models/Room");
const helper = require("../../helper/helper");

exports.getWishlists = catchAsyncFunc(async (req, res, next) => {
  const wishList = await Wishlist.find();
  return helper.sendSuccess(res, wishList, req, "Success");
});
exports.getUserWishlist = catchAsyncFunc(async (req, res, next) => {
  // const user = req.user.id;
  const { user_id } = req.body;
  const wishlist = await Wishlist.find({ user: user_id });
  return helper.sendSuccess(res, wishlist, req, "Success");
});
exports.wishlistCount = catchAsyncFunc(async (req, res, next) => {
  // const user = req.user.id;
  const { user_id } = req.body;
  const wishlist = await Wishlist.find({ user: user_id });
  return helper.sendSuccess(res, { count: wishlist.length }, req, "Success");
});
exports.addWishlist = catchAsyncFunc(async (req, res, next) => {
  const wishData = req.body;
  wishData.user = wishData.user_id;

  wishData.wishList = [];

  const room = await Room.find({ _id: wishData.room_id });
  console.log(room);
  if (!room)
    return helper.sendError(404, res, { error: "Room not found." }, req);
  const is_exist = await Wishlist.findOne({
    "wishlist.room": room,
  });
  if (is_exist) {
    return helper.sendSuccess(
      res,
      { msg: "Room already exists in your cart." },
      req,
      "Success"
    );
  }
  const is_exist_empty_cart = await Wishlist.findOne({
    user: wishData.user_id,
  });
  var found = false;
  if (is_exist_empty_cart && room) {
    for (let i = 0; i < is_exist_empty_cart?.wishlist?.length; i++) {
      if (is_exist_empty_cart.wishlist[i].room === room) {
        found = true;
        break;
      }
    }
    if (found === false) {
      const insert_in_cart = await is_exist_empty_cart.updateOne({
        $push: {
          wishlist: { room: room },
        },
      });
      const previous_updated_cart = await Wishlist.findOne({
        user: wishData.user_id,
      });

      return helper.sendSuccess(res, previous_updated_cart, req, "Success");
    }
  }

  wishData?.wishlist?.push({
    room: room,
  });
  const wish = await Wishlist.create(wishData);

  return helper.sendSuccess(res, wish, req, "Success");
});
exports.deleteWishlist = catchAsyncFunc(async (req, res, next) => {
  const { room_id, user_id } = req.body;
  const room = await Room.findById(room_id);
  if (!room)
    return helper.sendError(404, res, { error: "Room not found." }, req);
  await Wishlist.findOneAndUpdate(
    { user: user_id },
    { $pull: { wishlist: { room: room } } }
  );
  return helper.sendSuccess(res, { success: true }, req, "Success");
});
