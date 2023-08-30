const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const logger = require("./utils/winston");
const http = require("http");
const morgan = require("morgan");
const app = express();
require("dotenv").config({ path: path.join(__dirname, ".env") });

const hobbyInterestRoutes = require("./routes/hobby_interest_routes");
const adminHobbyInterestRoutes = require("./routes/admin/admin_hobby_interest_routes");
const reviewRoute = require("./routes/User/review_route");
const roomateRoute = require("./routes/User/roomate_route");
const userRoute = require("./routes/User/user_route");
const bookingRoute = require("./routes/User/booking_route");
const amenitiesRoute = require("./routes/User/amenities_route");
const roleRoute = require("./routes/User/role_route");
const session = require("express-session");
const newsLetter = require("./routes/newsletter_route");
const authRoutes = require("./routes/authentication_route");
const searchRoute = require("./routes/User/search_route");
const aboutRoute = require("./routes/about_route");
const contactRoute = require("./routes/User/contact_route");
const partnerHostingRoute = require("./routes/User/partnerhosting_route");
const careerRoute=require("./routes/career_route")
const chatRoute = require("./routes/chat_route");
const uploadMediaRoute=require("./routes/upload_media_route");
const messageRoute = require("./routes/message_route");
const notificationRoute = require("./routes/notification_route");
const paymentRoute = require("./routes/payment_route");
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;



// All Middlewares
app.use(cors());
app.use(morgan("tiny"));
app.use(
  session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use("/v1/user", hobbyInterestRoutes);
app.use("/v1/user", adminHobbyInterestRoutes);
app.use("/v1/user", notificationRoute);
app.use("/v1/user", reviewRoute);
app.use("/v1/user", roleRoute);
app.use("/v1/user", roomateRoute);
app.use("/v1/user", userRoute);
app.use("/v1/auth", authRoutes);
app.use("/v1/contact", contactRoute);
app.use("/v1/newsletter", newsLetter);
app.use("/v1/partner", partnerHostingRoute);
app.use("/v1/career", careerRoute)
app.use("/v1/chat", chatRoute);
app.use("/v1/notification", notificationRoute)
app.use("/v1/message", messageRoute);
app.use("/v1/user", bookingRoute);
app.use("/v1/user", amenitiesRoute);
app.use("/v1/payment", paymentRoute);
app.use("/v1/upload", uploadMediaRoute);
app.use("/v1/user", searchRoute);
app.use("/v1/user", aboutRoute);



// MongoDB Connection
mongoose
  .connect(MONGODB_URI || "", { appName: process.env.APP_NAME })
  .then((result) => {
    logger.info("MongoDB Connected");
    console.log("Connected!");
  })
  .catch((error) => {
    logger.error(`ERROR :: MongoDB Connection :: ${error}`);
    console.log(error);
  });

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on this port ${PORT}`);
});
