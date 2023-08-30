const express = require("express");
const router = express.Router();
const {
  getAllRooms,
  getRoomsByLocation,
  searchRoomsByNameAndIndex,
  fetchAvailableRooms,
  getAvailableHotels,
  getNearbyPlaces,
  getPlaceByType,
  searchByRoommatesCount,
  filterRoomsByPriceRange,
  filterRoomsByFeatures,
  filterHousesByDetails,
  addRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require("../../controllers/User/room_controller");
const upload = require("../../utils/multerUpload");

router.get("/get_all_rooms", getAllRooms);
router.get("/get_by_location", getRoomsByLocation);
router.get("/rooms/search", searchRoomsByNameAndIndex);
router.get("/rooms/available", fetchAvailableRooms);
router.get("/hotels/available", getAvailableHotels);
router.get("/get_nearby_places", getNearbyPlaces);
router.get("/get_by_type", getPlaceByType);
router.get("/rooms/roommate_count", searchByRoommatesCount);
router.get("/rooms/filter", filterRoomsByPriceRange);
router.get("/rooms/filter_features", filterRoomsByFeatures);
router.get("/houses/filter", filterHousesByDetails);
router.post("/add_room", upload, addRoom);
router.get("/get_room", getRoomById);
router.put("/update_room", upload, updateRoom);
router.delete("/perm_del_room", deleteRoom);

module.exports = router;
