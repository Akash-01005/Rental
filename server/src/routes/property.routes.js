import express from 'express';
import { upload } from '../middleware/upload.js';
import { verify } from '../middleware/verify.js';
import { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty } from '../controller/property.controller.js';

const router = express.Router();

// Change the order of routes - put specific routes first
router.get("/all", getAllProperties); // Move this before the :id route
router.post("/create", verify, upload.array('images', 5), createProperty);
router.get("/:id", getPropertyById);
router.put("/update/:id", verify, updateProperty);
router.delete("/delete/:id", verify, deleteProperty);

export default router;