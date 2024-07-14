const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { LoggedIn } = require("../middleware.js");
// Get all listings
router.get("/", async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});

// New listing form
router.get("/new", LoggedIn, (req, res) => {
    console.log(req.user);
    res.render("listings/new");
});

// Show a single listing
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews").populate("owner");
        if (!listing) {
            req.flash("error", "Listing does not exist");
            return res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show", { listing });
    } catch (err) {
        next(err);
    }
});

// Create a new listing
router.post("/", LoggedIn, async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success", "New listing created");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

// Edit listing form
router.get("/:id/edit", LoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        res.render("listings/edit", { listing });
    } catch (err) {
        next(err);
    }
});

// Update a listing
router.put("/:id", LoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        req.flash("success", "Listing updated");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
});

// Delete a listing
router.delete("/:id", LoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            throw new ExpressError(404, "Listing not found");
        }
        req.flash("success", "Listing deleted!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

module.exports = router;
