const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
module.exports.createReview=async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success","new review created!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        next(err);
    }
};
module.exports.deleteReview=async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","listing deleted!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};