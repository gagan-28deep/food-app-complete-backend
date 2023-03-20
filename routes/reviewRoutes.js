const express = require("express");
const reviewRoutes = express.Router();
const {
  createReviewController,
  getAllReviewController,
  getTop3Reviews,
  getReviewByID,
  deleteReview,
} = require("../controller/reviewController");
// plans -> get all the plans from db -> sensitive route -> protected route -> logged in i will only allow that person
reviewRoutes.get("/best3", getTop3Reviews);
reviewRoutes
  .route("/")
  .get(getAllReviewController)
  .post(createReviewController);

// loggedin plan
reviewRoutes.route("getreview/:id").get(getReviewByID);
reviewRoutes.route("/delete/:id").delete(deleteReview);
module.exports = reviewRoutes;
