const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
// const multer=require("multer");
// const {storage}=require("../cloudConfig.js")
// const upload=multer({storage});
const { LoggedIn } = require("../middleware.js");
 const listingController=require("../controllers/listing.js");
// Get all listings
router.get("/", listingController.index);

// New listing form
router.get("/new", LoggedIn, listingController.renderNewForm);

// Show a single listing
router.get("/:id", listingController.showListing);
// Create a new listing
 router.post("/", LoggedIn, listingController.newListing);
// router.post("/",upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })
// // Edit listing form
router.get("/:id/edit", LoggedIn, listingController.editListing);

// Update a listing
router.put("/:id", LoggedIn, listingController.updateListing);

// Delete a listing
router.delete("/:id", LoggedIn, listingController.deleteListing);
module.exports = router;
