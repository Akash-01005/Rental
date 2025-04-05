import express from 'express';
import { 
    getAllProperties, 
    getPropertyById, 
} from '../controller/property.controller.js';

const propertyRoutes = express.Router();

propertyRoutes.get("/", getAllProperties);
propertyRoutes.get("/:id", getPropertyById);



export default propertyRoutes;
