import Package from "../models/package.model.js";
import braintree from "braintree";
import dotenv from "dotenv";
import Booking from "../models/booking.model.js";

dotenv.config();

// =============================
// SAFE BRAINTREE INITIALIZATION
// =============================

let gateway = null;

if (
  process.env.BRAINTREE_MERCHANT_ID &&
  process.env.BRAINTREE_PUBLIC_KEY &&
  process.env.BRAINTREE_PRIVATE_KEY
) {
  gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });
}

// =============================
// CREATE PACKAGE
// =============================
export const createPackage = async (req, res) => {
  try {
    const {
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
      packageImages,
    } = req.body;

    if (
      !packageName ||
      !packageDescription ||
      !packageDestination ||
      !packageAccommodation ||
      !packageTransportation ||
      !packageMeals ||
      !packageActivities ||
      packageOffer === undefined ||
      !packageImages
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    if (packagePrice <= 0 || packageDiscountPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0!",
      });
    }

    if (packagePrice < packageDiscountPrice) {
      return res.status(400).json({
        success: false,
        message: "Regular price must be greater than discount price!",
      });
    }

    if (packageDays <= 0 && packageNights <= 0) {
      return res.status(400).json({
        success: false,
        message: "Provide valid days and nights!",
      });
    }

    const newPackage = await Package.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      newPackage,
    });
  } catch (error) {
    console.error("Create Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating package",
    });
  }
};

// =============================
// GET ALL PACKAGES
// =============================
export const getPackages = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [true, false] };
    } else {
      offer = offer === "true";
    }

    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const packages = await Package.find({
      $or: [
        { packageName: { $regex: searchTerm, $options: "i" } },
        { packageDestination: { $regex: searchTerm, $options: "i" } },
      ],
      packageOffer: offer,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json({
      success: true,
      packages,
    });
  } catch (error) {
    console.error("Get Packages Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching packages",
    });
  }
};

// =============================
// GET SINGLE PACKAGE
// =============================
export const getPackageData = async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found!",
      });
    }

    return res.status(200).json({
      success: true,
      packageData,
    });
  } catch (error) {
    console.error("Get Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =============================
// UPDATE PACKAGE
// =============================
export const updatePackage = async (req, res) => {
  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package updated successfully!",
      updatedPackage,
    });
  } catch (error) {
    console.error("Update Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =============================
// DELETE PACKAGE
// =============================
export const deletePackage = async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);

    if (!deletedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully!",
    });
  } catch (error) {
    console.error("Delete Package Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =============================
// BRAINTREE TOKEN
// =============================
export const braintreeTokenController = async (req, res) => {
  try {
    if (!gateway) {
      return res.status(500).json({
        success: false,
        message: "Braintree not configured",
      });
    }

    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(response);
    });
  } catch (error) {
    console.error("Braintree Token Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};