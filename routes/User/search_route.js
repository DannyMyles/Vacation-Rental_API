const express = require("express");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const roomateController = require("../../controllers/User/roomate_controller");

// Search nearby roommates by location
router.get("/search", async (req, res) => {
  try {
    const { location, maxDistance } = req.query;

    // Search nearby roommates by location
    const roommates = await roomateController.searchByLocation(location, maxDistance);

    if (roommates.length > 0) {
      // Return success message with roommates data
      return res.status(StatusCodes.OK).json({ success: true, message: "Roommates found", roommates });
    } else {
      // Return error message if no roommates found
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "No roommates found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
