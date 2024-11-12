const Listing = require("../models/listing.js");
const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geoCodingClient = mbxGeocoding({ accessToken: mapToken }); // Correct variable name

module.exports.index = async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
};

module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render("listings/new");
};

module.exports.showListing = async (req, res, next) => {
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
};

module.exports.newListing = async (req, res, next) => {
    try {
        let response = await geoCodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();
        
        
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.geometry=response.body.features[0].geometry;
        let savedListing=await newListing.save();
        console.log(savedListing);
        req.flash("success", "New listing created");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

module.exports.editListing = async (req, res, next) => {
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
};

module.exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;  // Assuming you're passing the listing ID in the URL
        const updatedListing = req.body.listing;

        // Find the listing by ID and update it
        const listing = await Listing.findByIdAndUpdate(id, updatedListing, { new: true });

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        req.flash("success", "Listing updated successfully");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};


module.exports.deleteListing = async (req, res, next) => {
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
};
