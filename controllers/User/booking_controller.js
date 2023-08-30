const Booking = require("../../models/Booking");
const catchAsyncFunc = require("../../middlewares/catchAsyncFunc");
const helper = require("../../helper/helper");
const User = require("../../models/User");
const Room = require("../../models/Room");
const { imageUpload } = require("../../utils/imageUpload");

exports.getAllBookings = catchAsyncFunc(async (req, res, next) => {
  const result = await Booking.find({ status: "active" });
  return helper.sendSuccess(res, result, req, "Success");
});
exports.getUserBooking = catchAsyncFunc(async (req, res, next) => {
  const { userId } = req.query;
  const result = await Booking.find({ user: userId, status: "active" });
  return helper.sendSuccess(res, result, req, "Success");
});

exports.addBooking = catchAsyncFunc(async (req, res, next) => {
  const {
    userId,
    roomId,
    wishlistId,
    checkInDate,
    checkOutDate,
    paymentAmount,
    paymentCurrency,
    paymentMethod,
    paymentStatus,
    checkInTime,
    checkOutTime,
    reservedHours,
    selfCleaning,
  } = req.body;

  const user = await User.findById(userId);
  const room = await Room.findById(roomId);
  const check_in_date = new Date(checkInDate);
  const check_out_date = new Date(checkOutDate);
  const timeDifference = Math.abs(
    check_in_date.getTime() - check_out_date.getTime()
  );
  const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  

  if (!user) {
    return helper.sendError(404, res, { msg: "User not found." }, req);
  } else if (!room) {
    return helper.sendError(404, res, { msg: "Room not found." }, req);
  }
  const perHourCharges = room.pricePerHour;
  var amount = perHourCharges * reservedHours;
  const percentage = amount * 0.1;
  if (selfCleaning === "Yes") {
    amount = amount - percentage;
  }

  const bookingData = {
    user: user,
    room: room,
    wishlist: wishlistId,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    checkInTime: checkInTime,
    checkOutTime: checkOutTime,
    reservedHours: reservedHours,
    numberOfDays: numberOfDays,
    payment: {
      amount: amount,
      currency: paymentCurrency,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
    },
  };
  const images = req.files;

  const imageURLs = [];


  if (images?.length > 0) {
    const imagesObj=await imageUpload(images);
    if (!imagesObj.success) {
      return helper.sendError(
        400,
        res,
        {
          error: imagesObj.message,
        },
        req
      );
    }
    imageURLs.push(...imagesObj.downloadURLs);
 


  }

  
  const is_exist = await Booking.find({
    checkInDate: checkInDate,
    checkInTime: checkInTime,
    room: room,
    user: user,
  });
  if (is_exist.length > 0) {
    return helper.sendError(
      403,
      res,
      {
        msg: "Room is not available for this date and time.",
      },
      req
    );
  }
  console.log(room.availableSeats)

    bookingData.verificationImages = imageURLs;
    const result = await Booking.create(bookingData);
    const decrementValue = -1;
    await Room.findByIdAndUpdate(
      room._id,
      {
        $inc: { availableSeats: decrementValue },
      },
      {
        new: true,
        runValidators: true,
        userFindANdModify: false,
      }
    );
    return helper.sendSuccess(res, result, req, "Success");
  
});



exports.updateBooking = catchAsyncFunc(async (req, res, next) => {
  const { bookingId } = req.query;

  const {
    userId,
    roomId,
    wishlistId,
    checkInDate,
    checkOutDate,
    paymentAmount,
    paymentCurrency,
    paymentMethod,
    paymentStatus,
    checkInTime,
    checkOutTime,
    reservedHours,
    selfCleaning,
  } = req.body;

  const user = await User.findById(userId);
  const room = await Room.findById(roomId);
  const check_in_date = new Date(checkInDate);
  const check_out_date = new Date(checkOutDate);
  const timeDifference = Math.abs(
    check_in_date.getTime() - check_out_date.getTime()
  );
  const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  if (!user) {
    return helper.sendError(404, res, { msg: "User not found." }, req);
  } else if (!room) {
    return helper.sendError(404, res, { msg: "Room not found." }, req);
  }
  const perHourCharges = room.pricePerHour;
  var amount = perHourCharges * reservedHours;
  const percentage = amount * 0.1;
  if (selfCleaning === "Yes") {
    amount = amount - percentage;
  }
  const bookingData = {
    user: user,
    room: room,
    wishlist: wishlistId,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    checkInTime: checkInTime,
    checkOutTime: checkOutTime,
    reservedHours: reservedHours,
    numberOfDays: numberOfDays,

    payment: {
      amount: amount,
      currency: paymentCurrency,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
    },
  };
  const images = req.files;

  const imageURLs = [];


  if (images?.length > 0) {
    const imagesObj=await imageUpload(images);
    if (!imagesObj.success) {
      return helper.sendError(
        400,
        res,
        {
          error: imagesObj.message,
        },
        req
      );
    }
    imageURLs.push(...imagesObj.downloadURLs);
 


  }
  bookingData.verificationImages = imageURLs;
 await Booking.findByIdAndUpdate(bookingId, bookingData, {
    new: true,
    runValidators: true,
    userFindANdModify: false,
  });
  return helper.sendSuccess(
    res,
    { msg: "Booking updated successfully." },
    req,
    "Success"
  );
});

exports.cancelBooking = catchAsyncFunc(async (req, res, next) => {
  const { bookingId } = req.query;

  const bookingData = {
    status: "cancelled",
  };

  await Booking.findByIdAndUpdate(bookingId, bookingData, {
    new: true,
    runValidators: true,
    userFindANdModify: false,
  });
  return helper.sendSuccess(
    res,
    { msg: "Booking updated successfully." },
    req,
    "Success"
  );
});

exports.deleteBooking = catchAsyncFunc(async (req, res, next) => {
  const { bookingId } = req.query;
  if (!bookingId)
    return helper.sendError(res, { error: "Booking id not found." });
  await Booking.findByIdAndDelete(bookingId);
  return helper.sendSuccess(
    res,
    { msg: "Booking deleted successfully." },
    req,
    "Success"
  );
});
