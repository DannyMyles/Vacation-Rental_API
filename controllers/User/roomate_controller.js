const axios = require("axios");
const Roomate = require("../../models/Roomate");
const helper = require("../../helper/helper");
const catchAsyncFunc = require("../../middlewares/catchAsyncFunc");
const Review = require("../../models/Review");
const User = require("../../models/User");
const Wishlist = require("../../models/Wishlist");
const { imageUpload } = require("../../utils/imageUpload");

exports.getAllRoomates = catchAsyncFunc(async (req, res, next) => {
  const result = await Roomate.find();
  return helper.sendSuccess(res, result, req, "Success");
});

exports.getRoomates = catchAsyncFunc(async (req, res, next) => {
  const { room_id } = req.query;
  const result = await Roomate.find({ user: room_id });
  return helper.sendSuccess(res, result, req, "Success");
});

exports.addRoomate = catchAsyncFunc(async (req, res, next) => {
  const roomateData = req.body;
  roomateData.user = req.query.user_id;
  roomateData.room = req.query.room_id;
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
  const wishlist = await Wishlist.find({ user: roomateData.user });
  const user = await User.findOne({ _id: roomateData.user });
  const reviews = await Review.find({ user: roomateData.user });

  roomateData.wishlist = wishlist;
  roomateData.reviews = reviews;

  const is_exist = await Roomate.findOne({ user: roomateData.user });
  if (is_exist)
    return helper.sendError(403, res, { error: "Roomate already exists" }, req);
  roomateData.image = imageURLs;
  roomateData.memberSince = user?.createdAt;

  const result = await Roomate.create(roomateData);
  return helper.sendSuccess(res, result, req, "Success");
});

exports.updateRoomateProfile = catchAsyncFunc(async (req, res, next) => {
  const roomateData = req.body;
  roomateData.user = req.query.user_id;
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
 
  const wishlist = await Wishlist.find({ user: roomateData.user });
  const user = await User.findOne({ _id: roomateData.user });
  const reviews = await Review.find({ user: roomateData.user });

  roomateData.wishlist = wishlist;
  roomateData.reviews = reviews;
  roomateData.image = imageURLs;
  roomateData.memberSince = user?.createdAt;
  const result = await Roomate.findOneAndUpdate(
    { email: roomateData.email },
    roomateData,
    {
      new: true,
      runValidators: true,
      userFindANdModify: false,
    }
  );
  roomateData.image = imageURLs;
  roomateData.memberSince = user?.createdAt;

  return helper.sendSuccess(res, result, req, "Success");
});

exports.deleteRoomate = catchAsyncFunc(async (req, res, next) => {
  const { roomate_id } = req.query;
  if (!roomate_id)
    return helper.sendError(res, { error: "Roomate id is required" });
  await Roomate.findByIdAndDelete(roomate_id);
  helper.sendSuccess(
    res,
    { msg: "Roomate deleted successfully." },
    req,
    "Success"
  );
});

// Search By Location
exports.searchByLocation = catchAsyncFunc(async (location, maxDistance) => {
  // Use a geocoding service to convert location name into coordinates
  const coordinates = await geocodeLocation(location);

  // If the coordinates are successfully obtained, perform the search
  if (coordinates) {
    const roommates = await Roomate.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [coordinates.longitude, coordinates.latitude],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    return roommates;
  } else {
    // Return an empty array if the coordinates cannot be obtained
    return [];
  }
});

async function geocodeLocation(location) {
  const apiKey = "YOUR_MAPQUEST_API_KEY"; // Replace with your MapQuest API key

  try {
    const response = await axios.get(
      `http://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}&location=${encodeURIComponent(
        location
      )}`
    );

    const results = response.data.results;

    if (results.length > 0) {
      const { lat, lng } = results[0].locations[0].latLng;
      return { latitude: lat, longitude: lng };
    } else {
      return null; // Return null if no results found
    }
  } catch (error) {
    console.error(error);
    return null; // Return null if geocoding fails
  }
}

