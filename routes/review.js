const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const reviewController=require("../controllers/review.js");
router.post("/", reviewController.createReview);
router.delete("/:reviewId", reviewController.deleteReview);
module.exports=router;