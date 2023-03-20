const reviewModel = require("../model/reviewModel");
const planModel = require("../model/planModel");
async function createReviewController(req, res) {
  try {
    let reviewData = req.body;
    let review = await reviewModel.create(reviewData);
    let rating = review.rating;
    let reviewId = review["_id"];
    let currentPlan = await planModel.findById(review.plan);
    // average rating
    let totalNoofRating = currentPlan.reviews.length;
    let prevAvg = currentPlan.averageRating;
    if (prevAvg) {
      let totalRatings = prevAvg * totalNoofRating;
      let newAvg = (totalRatings + rating) / (totalNoofRating + 1);
      currentPlan.averageRating = newAvg;
    } else {
      currentPlan.averageRating = rating;
    }
    currentPlan.reviews.push(reviewId);
    await currentPlan.save();
    res.status(201).json({
      review,
      result: "created",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}
async function getAllReviewController(req, res) {
  try {
    let reviews = await reviewModel
      .find()
      // multiple different entries from diff models
      .populate({ path: "user", select: "name pic " })
      .populate({ path: "plan", select: "price name" });
    res.status(200).json({
      reviews,
      result: "all results send ",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}
async function getTop3Reviews(req, res) {
  try {
    let reviews = await reviewModel
      .find()
      // multiple different entries from diff models
      .populate({ path: "user", select: "name pic " })
      .populate({ path: "plan", select: "price name" })
      .limit(3);
    res.status(200).json({
      reviews,
      result: "all results send",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

async function getReviewByID(req, res) {
  try {
    let id = req.params.planRoutes;
    let review = await reviewModel.findById(id).populate("plan");
    res.status(200).json({
      result: "Review Found",
      review: review,
    });
  } catch (err) {
    console.log(err);
    res.json(500).json({
      err: err.message,
    });
  }
}

async function deleteReview(req, res) {
  const reviewId = req.body.id;
  const userId = req.user._id; // assuming the user ID is stored in req.user

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).send("Review not found");
    }
    if (review.user.toString() !== userId) {
      return res.status(403).send("Unauthorized");
    }
    await review.remove();
    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  createReviewController,
  getAllReviewController,
  getTop3Reviews,
  getReviewByID,
  deleteReview,
};
